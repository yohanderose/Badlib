import React, { Component } from "react";

import { Ionicons } from "@expo/vector-icons";
import TagInput from "react-native-tag-input";
import keyword_extractor from "keyword-extractor";

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
    this.state = {
      note: "",
      title: "",
      tags: [],
      tagText: "",
    };
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
      console.log(card);

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

  _autoTag = () => {
    try {
      let keywords = keyword_extractor.extract(this.state.note, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });
      let updatedTags = this.state.tags;
      let temp = [];
      keywords.forEach((keyword) => {
        if (!updatedTags.includes(keyword)) {
          updatedTags.push(keyword);
          temp.push(keyword);
        }
      });
      console.log(temp);
      return new Promise((resolve) => {
        this.setState({ tags: updatedTags }, () => {
          resolve();
          this._storeCard();
        });
      });
    } catch (e) {
      console.error("Exception thrown", e);
    }
  };

  render() {
    return (
      <View style={[styles.card]}>
        {/* Card Title  */}
        <TextInput
          style={styles.title}
          value={this.state.title}
          // Update state of title as user makes changes
          onChangeText={(text) => {
            return new Promise((resolve) => {
              this.setState({ title: text }, () => {
                resolve();
                this._storeCard();
              });
            });
          }}
        ></TextInput>
        {/* Card Note Content */}
        {/* https://stackoverflow.com/questions/33071950/how-would-i-grow-textinput-height-upon-text-wrapping */}
        <TextInput
          value={this.state.note}
          onChangeText={(text) => {
            return new Promise((resolve) => {
              this.setState({ note: text }, () => {
                resolve();
                this._storeCard();
              });
            });
          }}
          multiline
        ></TextInput>

        {/* Card Tags */}
        {/* https://github.com/jwohlfert23/react-native-tag-input/tree/90e8a50d187a807b58ff3454eb25ce31c478b78f */}
        <View
          style={{
            height: height / 12,
            overflow: "hidden",
          }}
        >
          <TagInput
            value={this.state.tags}
            onChange={(tags) => {
              console.log(tags);
              return new Promise((resolve) => {
                this.setState({ tags: tags }, () => {
                  resolve();
                  this._storeCard();
                });
              });
            }}
            labelExtractor={(tag) => tag}
            text={this.state.tagText}
            onChangeText={(text) => {
              {
                return new Promise((resolve) => {
                  this.setState({ tagText: text }, () => {
                    resolve();
                    const lastTyped = text.charAt(text.length - 1);
                    const parseWhen = [",", " ", ";", "\n"];

                    if (parseWhen.indexOf(lastTyped) > -1) {
                      return new Promise((resolve) => {
                        let newTag = this.state.tagText.trim();
                        if (!this.state.tags.includes(newTag)) {
                          this.setState(
                            {
                              tags: [
                                ...this.state.tags,
                                this.state.tagText.trim(),
                              ],
                              tagText: "",
                            },
                            () => {
                              resolve();
                              //console.log(this.state.tags);
                              this._storeCard();
                            }
                          );
                        } else {
                          this.setState({ tagText: "" });
                        }
                      });
                    }
                  });
                });
              }
            }}
            tagColor="blue"
            tagTextColor="white"
            inputProps={{ placeholder: "Tags" }}
          ></TagInput>
        </View>

        {/* Buttons  */}
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            margin: width * 0.01,
          }}
        >
          <TouchableOpacity style={styles.tag} onPress={this._autoTag}>
            <Ionicons
              name="ios-pricetags"
              color="tomato"
              style={{ fontSize: 24 }}
            />
            <Text>Auto Tag</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bin} onPress={this._deleteCardData}>
            <Ionicons
              name="ios-trash"
              color="tomato"
              style={{ fontSize: 24 }}
            />
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 7,
    backgroundColor: "white",
  },
  title: {
    borderColor: (0, 0, 0, 0.1), // Add this to specify bottom border color and opacity
    borderBottomWidth: 1, // Add this to specify bottom border thickness
  },
  note: {
    flex: 1,
    height: height / 10,
  },
  tag: {
    backgroundColor: "green",
    alignSelf: "flex-end",
  },
  bin: {
    backgroundColor: "pink",
    alignSelf: "flex-end",
  },
});
