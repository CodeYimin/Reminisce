import React, { useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Friend from "../components/Friend";

export default function ProfileScreen({ navigation }: any) {
  const [friend, setFriend] = useState<string | null>(null);
  const [friendItems, setFriendItems] = useState<any[]>([]);

  const handleAddFriend = () => {
    console.log(friend);
    Keyboard.dismiss();
    setFriendItems([...friendItems, friend]);
    setFriend(null);
  };

  return (
    <View>
      <Text style={styles.h1}>Profile</Text>
      {/* <Image source={require("../assets/profilePic.jpg")} /> */}
      <Text style={styles.description}>Name: Jorge</Text>
      <Text style={styles.description}>Username: Jorge123</Text>
      <Text style={styles.description}>Friends List</Text>

      <View>
        {friendItems.map((item, index) => {
          return (
            <Friend style={styles.li} text={friendItems[index]} key={index} />
          );
        })}
        {/* testing friends (for the demo) */}
        <Friend text="Sherwin"></Friend>
        <Friend text="Yimin"></Friend>
        <Friend text="Stanley"></Friend>
        <Friend text="Preston"></Friend>
      </View>

      {/* Add friend */}
      <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TextInput
          style={styles.input}
          placeholder={"Add a friend"}
          value={friend ? friend : undefined}
          onChangeText={(text) => setFriend(text)}
        />
        <TouchableOpacity onPress={() => handleAddFriend()}>
          <View>
            <Text style={styles.icon}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* navigation */}
      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate("Message")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 6,
  },
  icon: {
    fontSize: 30,
  },
  li: {
    // paddingVertical: 15,
    // paddingHorizontal: 15,
    // backgroundColor: '#FFF',
    // borderRadius: 60,
    // borderColor: '#C0C0C0',
    // borderWidth: 1,
    // width: 250,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "50%",
    // backgroundColor: '#0553',
  },
});
