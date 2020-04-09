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
    this.state = { note: "", title: "" };
    this._retrieveCard();
    // console.log(this.cardID);
  }

  _deleteCardData = async () => {
    console.log("Deleting data of card: ", this.cardID);
    try {
      await AsyncStorage.removeItem(this.cardID);
    } catch (error) {
      // Error deleting card data
    }
    // Call method that invokes parent method
    this.props.removeCardDisplay(this.cardID);
    console.log(this.title);
  };

  _storeCard = async () => {
    try {
      let cardObj = {
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
      <View style={[styles.card]}>
        <TouchableOpacity>
          {/* Card Title  */}
          <TextInput
            style={styles.title}
            value={this.state.title}
            // Update state of title as user makes changes
            onChangeText={(text) => this.setScratchState(text, "title")}
          ></TextInput>
          {/* Card Note Content */}
          {/* https://stackoverflow.com/questions/33071950/how-would-i-grow-textinput-height-upon-text-wrapping */}
          <TextInput
            value={this.state.note}
            // Change text input height depending on text size
            // onContentSizeChange={(event) => {
            //   this.setState({ height: event.nativeEvent.contentSize.height });
            // }}
            // style={{ height: Math.max(height / 6, this.state.height) }}
            // Update state of note as user makes changes
            onChangeText={(text) => this.setScratchState(text, "note")}
            multiline
          />
          {/* Card Tags */}

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

    // Initialise dummy data for testing
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
  card: {
    margin: width * 0.03,
    padding: width * 0.03,
    width: width * 0.95,
    borderRadius: 10,
    backgroundColor: "white",
  },
  title: {
    borderColor: (0, 0, 0, 0.1), // Add this to specify bottom border color and opacity
    borderBottomWidth: 1, // Add this to specify bottom border thickness
  },
  note: {
    flex: 1,
  },
  bin: {
    backgroundColor: "pink",
  },
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
