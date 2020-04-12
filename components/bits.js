import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";
// import _ from "lodash";

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

    this.state = {
      cards: [],
      allCards: [],
      search: "",
      searchArr: [],
      searching: false,
    };
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
      AsyncStorage.setItem("ids", JSON.stringify(this.state.allCards));
    } catch (error) {
      // Failed setting cards
    }
  };

  _getCards = async () => {
    try {
      let cards = await AsyncStorage.getItem("ids");
      cards = JSON.parse(cards);
      // console.log(typeof cards);

      return new Promise((resolve) => {
        this.setState({ cards: cards, allCards: cards }, () => {
          resolve();
        });
      }).then(() => {
        this._setupSearch();
      });
    } catch (error) {
      // Could not load card IDs
    }
  };

  _setupSearch = () => {
    console.log("Updating search array for", this.state.allCards);
    this.setState({ searchArr: [] }, () => {
      this.state.allCards.forEach((cardID) => {
        this._getCardData(cardID);
      });
    });
  };

  _getCardData = (cardID) => {
    try {
      let card = AsyncStorage.getItem(cardID.toString()).then((card) => {
        card = JSON.parse(card);
        let arr = [];
        if (card.state.tags.length > 0) {
          arr = card.state.tags;
        }
        if (card.state.note != "") {
          if (arr == []) {
            arr = card.state.note.split(" ");
          } else {
            arr = arr.concat(card.state.note.split(" "));
          }
        }
        if (card.state.title != "") {
          if (arr == []) {
            arr = card.state.title.split(" ");
          } else {
            arr = arr.concat(card.state.title.split(" "));
          }
        }

        arr = arr.map((str) => {
          return str.toLowerCase();
        });

        this.setState(
          {
            searchArr: [
              ...this.state.searchArr,
              {
                cardID: cardID,
                arr: arr,
              },
            ],
          }
          // console.log(this.state.searchArr)
        );
      });
    } catch (error) {
      // Could not load card IDs
    }
  };

  _handleSearch = () => {
    let query = this.state.search.toLowerCase();

    console.log(query);
    if (query == "") {
      this.setState({ cards: this.state.allCards, searching: false });
      return;
    } else {
      this.setState({ searching: true });
    }
    const cards = [];
    this.state.searchArr.forEach((obj) => {
      if (obj.arr.filter((str) => str.includes(query)).length > 0) {
        cards.push(obj.cardID);
      }
    });
    this.setState({ cards: cards });
  };

  _addCardandDisplay = () => {
    let updatedCards = this.state.allCards;
    console.log("Adding card to ", this.state.allCards);
    let min = 1000;
    let max = 100000;
    let randomID = Math.floor(Math.random() * (+max - +min)) + +min;

    // Make sure no duplicate card ids exist
    while (this.state.allCards.includes(randomID)) {
      randomID = Math.floor(Math.random() * (+max - +min)) + +min;
    }

    updatedCards.push(randomID);
    // Update local and Async
    this.setState({ allCards: updatedCards });
    console.log(this.state.cards);
    this._setCards();
  };

  _removeCardDisplay = (cardID) => {
    console.log(this.state.allCards);
    console.log("Removing card from ", this.state.allCards);

    let updatedCards = this.state.allCards;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    let idx = updatedCards.indexOf(parseInt(cardID));
    updatedCards.splice(idx, 1);

    // Update local and Async
    this.setState({ allCards: updatedCards });
    console.log(this.state.allCards);
    this._setCards();
  };

  // Does not display 'add card' button if user is searching something
  _renderAddButton = () => {
    if (this.state.searching == false) {
      return (
        <TouchableOpacity style={styles.add} onPress={this._addCardandDisplay}>
          <Ionicons style={styles.add_icon} name="ios-add" color="white" />
        </TouchableOpacity>
      );
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <SearchBar
          containerStyle={{ width: width * 0.8, marginTop: height * 0.05 }}
          platform="ios"
          placeholder="Search"
          value={this.state.search}
          onChangeText={(text) => {
            return new Promise((resolve) => {
              this.setState({ search: text }, () => {
                resolve();
                this._handleSearch();
              });
            });
          }}
        />

        <FlatList
          data={this.state.cards}
          extraData={this.state}
          // https://stackoverflow.com/questions/50081664/using-array-index-on-flatlist-in-react-native
          keyExtractor={(index) => index.toString()}
          renderItem={(card) => (
            <Card
              cardID={card.item}
              removeCardDisplay={this._removeCardDisplay}
              updateSearching={this._setupSearch}
            ></Card>
          )}
        ></FlatList>

        {this._renderAddButton()}
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
