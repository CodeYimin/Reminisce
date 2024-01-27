import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import MapScreen from "../screens/MapScreen";
import MessagesScreen from "../screens/MessagesScreen";
import PhotosScreen from "../screens/PhotosScreen";
import ProfileScreen from "../screens/ProfileScreen";

//export type RootStackParamList = {
//  Profile: typeof ProfileScreen;
// Messages: typeof MessagesScreen;
// Map: typeof MapScreen;
//  Photos: typeof PhotosScreen;
//};

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Photos" component={PhotosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
