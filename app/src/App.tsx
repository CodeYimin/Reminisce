import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// import components
// import Navbar from "./components/navbar.js";

export default function App() {
  fetch("http://localhost:4000");

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />

      {/* bottom */}
      {/* <Navbar /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
