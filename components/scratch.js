import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AsyncStorage,
} from "react-native";

export default class ScratchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { notes: "" };
    this._retrieveData();
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem("user", this.state.notes);
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      const data = await AsyncStorage.getItem("user");
      // console.log(data);
      if (data !== null) {
        // We have data!!
        this.setState({ notes: data });
      }
    } catch (error) {
      // Error retrieving data
      this.setState({ notes: "" });
    }
  };

  TEST = () => {
    this._retrieveData();
    console.log(this.state.notes);
  };

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.container}></View>

        <TextInput
          style={styles.notesArea}
          value={this.state.notes}
          onChangeText={(text) => {
            return new Promise((resolve) => {
              // console.log(text);
              this.setState({ notes: text }, () => {
                resolve();
                this._storeData();
              });
            });
          }}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={this.TEST}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 2,
  },
  container: {
    margin: width * 0.04,
    marginTop: 20,
    backgroundColor: "white",
  },
  notesArea: {
    textAlignVertical: "top",
    margin: width * 0.02,
    backgroundColor: "white",
    height: height * 0.9,
    padding: width * 0.04,
  },
  button: {
    marginLeft: width * 0.06,
    margin: height * 0.02,
    backgroundColor: "tomato",
    width: width * 0.08,
    height: height * 0.03,
    alignItems: "center",
    borderRadius: 3,
  },
});
