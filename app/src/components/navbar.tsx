import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Cam() {
  return (
    <View style={styles.navbar}>
      <Link style={styles.link} href="/pages/map">
        Map
      </Link>
      <Link style={styles.link} href="/pages/messages">
        Messages
      </Link>
      <Link style={styles.link} href="/pages/photos">
        Photos
      </Link>
      <Link style={styles.link} href="/pages/profile">
        Profile
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#87C4FF",
  },
  navbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    backgroundColor: "#39A7FF",
  },
  link: {
    fontSize: 20,
    color: "white",
  },
});
