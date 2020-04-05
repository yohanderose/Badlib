import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";

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

class Card extends Component {
  constructor(props) {
    super(props);
    this.cardID = props.cardID.toString();
    this.idx = props.idx;
    this.state = { note: "", title: "" };
    this._retrieveCard();
    // console.log(this.cardID);
  }

  _deleteCardData = async () => {
    console.log("Deleting data");
    try {
      await AsyncStorage.removeItem(this.cardID);
    } catch (error) {
      // Error deleting card data
    }
    // Call method that invokes parent method
    this.props.removeCardDisplay(this.idx);
    console.log(this.title);
  };

  _storeCard = async () => {
    try {
      let cardObj = {
        idx: this.idx,
        state: this.state,
      };
      console.log("Storing this: ", cardObj);
      await AsyncStorage.setItem(this.cardID, JSON.stringify(cardObj));
      console.log("ALERT: Saved card " + this.cardID);
    } catch (error) {
      // Error saving data
      console.log("ERROR: Unable to save " + this.cardID);
      // console.log(error);
    }
  };

  _retrieveCard = async () => {
    try {
      let card = await AsyncStorage.getItem(this.cardID);
      card = JSON.parse(card);
      // console.log(typeof card);

      if (card != null) {
        // We have data!!
        this.idx = card.idx;
        this.setState({ title: card.state.title.toString() });
        this.setState({ note: card.state.note.toString() });
      } else {
        // No data for card so create new
        this._storeCard();
      }
    } catch (error) {
      // Error retrieving data
      // console.log(error);
    }
  };

  setScratchState = async (text, context) => {
    // Note prop being edited
    if (context == "note") {
      this.setState({ note: text });
    } else if (context == "title") {
      // Title prop being edited
      this.setState({ title: text });
    }
    // Save changes
    this._storeCard();
  };

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.card}>
          {/* Card Title  */}
          <TextInput
            style={styles.title}
            value={this.state.title}
            onChangeText={(text) => this.setScratchState(text, "title")}
          ></TextInput>
          {/* Card Note Content */}
          <TextInput
            value={this.state.note}
            onChangeText={(text) => this.setScratchState(text, "note")}
            multiline
          />
          {/* TODO: Bin is entire bottom bar instead of bottom right corner */}
          <TouchableOpacity style={styles.bin}>
            <Ionicons
              name="ios-trash"
              color="tomato"
              style={{ fontSize: 24 }}
              onPress={this._deleteCardData}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class BitScreen extends Component {
  constructor(props) {
    super(props);

    // Initialise dummy data for testing using async
    this.TEMP();

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
      console.log(typeof cards);
      this.setState({ cards: cards });
    } catch (error) {
      // Could not load card IDs
    }
  };

  _removeCardDisplay = (idx) => {
    console.log(this.state.cards);
    console.log("Removing card");
    let updatedCards = this.state.cards;
    updatedCards.splice(idx, 1);
    this.setState({ cards: updatedCards });
    console.log(this.state.cards);
    // Update local
    this._setCards();
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FlatList
          data={this.state.cards}
          // https://stackoverflow.com/questions/50081664/using-array-index-on-flatlist-in-react-native
          keyExtractor={(index) => index.toString()}
          renderItem={(card) => (
            <Card
              cardID={card.item}
              idx={card.index}
              removeCardDisplay={this._removeCardDisplay}
            ></Card>
          )}
        ></FlatList>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    margin: width * 0.05,
    padding: width * 0.03,
    width: width * 0.95,
    height: height / 7,
    borderRadius: 10,
    backgroundColor: "white",
  },
  title: {
    borderColor: (0, 0, 0, 0.1), // Add this to specify bottom border color and opacity
    borderBottomWidth: 1, // Add this to specify bottom border thickness
  },
  note: {},
  bin: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "pink",
  },
});
