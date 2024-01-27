import React from "react";
import { Text, View } from "react-native";

export default function Messages({ navigation, route }: any) {
  return (
    <View>
      <Text>Messages Screen</Text>
      <Text>This is {route.params.name}'s profile</Text>
    </View>
  );
}
