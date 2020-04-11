import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";

import Card from "./card";

import {
  Text,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
} from "react-native";

export default class BitScreen extends Component {
  constructor(props) {
    super(props);

    // Initialise dummy data for testing
    // this.TEMP();

    this.state = { cards: [] };
    this._getCards();
  }

  TEMP = () => {
    let tempData = [1, 2, 3];
    try {
      AsyncStorage.setItem("ids", JSON.stringify(tempData));
    } catch (error) {
      // Failed loading dummy data
    }
  };

  _setCards = async () => {
    try {
      AsyncStorage.setItem("ids", JSON.stringify(this.state.cards));
    } catch (error) {
      // Failed setting cards
    }
  };

  _getCards = async () => {
    try {
      let cards = await AsyncStorage.getItem("ids");
      cards = JSON.parse(cards);
      // console.log(typeof cards);

      this.setState({ cards: cards });
    } catch (error) {
      // Could not load card IDs
    }
  };

  _addCardandDisplay = () => {
    let updatedCards = this.state.cards;
    console.log("Adding card to ", this.state.cards);
    let min = 1000;
    let max = 100000;
    let randomID = Math.floor(Math.random() * (+max - +min)) + +min;

    // Make sure no duplicate card ids exist
    while (this.state.cards.includes(randomID)) {
      randomID = Math.floor(Math.random() * (+max - +min)) + +min;
    }

    updatedCards.push(randomID);
    // Update local and Async
    this.setState({ cards: updatedCards });
    console.log(this.state.cards);
    this._setCards();
  };

  _removeCardDisplay = (cardID) => {
    console.log(this.state.cards);
    console.log("Removing card from ", this.state.cards);

    let updatedCards = this.state.cards;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    let idx = updatedCards.indexOf(parseInt(cardID));
    updatedCards.splice(idx, 1);

    // Update local and Async
    this.setState({ cards: updatedCards });
    console.log(this.state.cards);
    this._setCards();
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FlatList
          data={this.state.cards}
          extraData={this.state}
          // https://stackoverflow.com/questions/50081664/using-array-index-on-flatlist-in-react-native
          keyExtractor={(index) => index.toString()}
          renderItem={(card) => (
            <Card
              cardID={card.item}
              removeCardDisplay={this._removeCardDisplay}
            ></Card>
          )}
        ></FlatList>

        <TouchableOpacity style={styles.add} onPress={this._addCardandDisplay}>
          <Ionicons style={styles.add_icon} name="ios-add" color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  add: {
    width: width / 7,
    height: width / 7,
    borderRadius: 50,
    backgroundColor: "#ee6e73",
    position: "absolute",
    bottom: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  add_icon: {
    fontSize: 32,
  },
});
