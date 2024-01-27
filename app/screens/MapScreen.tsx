// make maps the home page

import React from "react";
import { Button, Text, View } from "react-native";

export default function Map({ navigation }: any) {
  return (
    // <View>
    //   <Text>Maps Screen</Text>
    //   {/* <Nav/> */}
    // </View>
    <View>
      <Text>Map</Text>
      <Button title="Go to Map" onPress={() => navigation.navigate("Map")} />
    </View>
  );
}
