import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

class Card extends Component {
  constructor(props) {
    super(props);
    this.cardID = props.cardID;
    this.state = { note: "", title: "" };
    this._retrieveTitle();
    this._retrieveNote();
  }

  _removeData = async () => {
    console.log(this.cardID);
    // try {
    //   await AsyncStorage.removeItem(this.cardID + "title");
    //   await AsyncStorage.removeItem(this.cardID + "note");
    // } catch (error) {
    //   // Error saving data
    // }
  };

  _storeTitle = async (text) => {
    try {
      await AsyncStorage.setItem(this.cardID + "title", text);
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveTitle = async () => {
    try {
      const data = await AsyncStorage.getItem(this.cardID + "title");
      if (data !== null) {
        // We have data!!
        this.setState({ title: data });
      }
    } catch (error) {
      // Error retrieving data
      this.setState({ title: "" });
    }
  };

  _storeNote = async (text) => {
    try {
      await AsyncStorage.setItem(this.cardID + "note", text);
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveNote = async () => {
    try {
      const data = await AsyncStorage.getItem(this.cardID + "note");
      if (data !== null) {
        // We have data!!
        this.setState({ note: data });
      }
    } catch (error) {
      // Error retrieving data
      this.setState({ note: "" });
    }
  };

  setScratchState = (text, context) => {
    // Note prop being edited
    if (context == "note") {
      this.setState({ note: text });
      this._storeNote(this.state.note);
    } else if (context == "title") {
      // Title prop being edited
      this.setState({ title: text });
      this._storeTitle(this.state.title);
    }
  };

  TEST = () => {
    this._retrieveNote();
    console.log(this.state.note);
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
          <TouchableOpacity style={styles.bin}>
            <Ionicons
              name="ios-trash"
              color="tomato"
              style={{ fontSize: 24 }}
              onPress={this._removeData}
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
    this.state = { cards: [] };
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Card cardID={1}></Card>
        <Card cardID={2}></Card>
        <Card cardID={3}></Card>
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
  },
});
