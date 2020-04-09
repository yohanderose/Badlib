import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";

import TagInput from "react-native-tag-input";

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

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.cardID = props.cardID.toString();
    this.state = { note: "", title: "", tags: [], tagText: "" };
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
        this.setState(card.state);
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
          {/* https://github.com/jwohlfert23/react-native-tag-input/tree/90e8a50d187a807b58ff3454eb25ce31c478b78f */}
          <TagInput
            value={this.state.tags}
            onChange={(tags) => this.setState({ tags: tags })}
            labelExtractor={(tag) => tag}
            text={this.state.tagText}
            onChangeText={(text) => {
              {
                this.setState({ tagText: text });

                const lastTyped = text.charAt(text.length - 1);
                const parseWhen = [",", " ", ";", "\n"];

                if (parseWhen.indexOf(lastTyped) > -1) {
                  this.setState({
                    tags: [...this.state.tags, this.state.tagText],
                    tagText: "",
                  });
                  //console.log(this.state.tags);
                  this._storeCard();
                }
              }
            }}
            tagColor="blue"
            tagTextColor="white"
            inputProps={{ placeholder: "Tags" }}
          ></TagInput>
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
});
