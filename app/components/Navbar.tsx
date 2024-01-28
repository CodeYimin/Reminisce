import { css } from "@emotion/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

export default function Navbar({
  onClick,
}: {
  onClick: (section: "register" | "login" | "friends" | "camera") => void;
}) {
  return (
    <View
      style={css`
        background-color: #222831;
        display: flex;
        flex-direction: row;
        height: 110px;
        width: 100%;
        top: 750px;
        // border-radius:20px;
      `}
    >
      {["register", "login", "friends", "camera"].map((section) => (
        <TouchableOpacity
          key={section}
          style={css`
            background-color: #222831;
            width: 22.5%;
            margin: 0 1.25%;
            align-items: center; // Center content horizontally
            justify-content: center; // Center content vertically
            margin-bottom: 30px;
            // border-radius:20px;
          `}
          onPress={() => onClick(section as any)}
        >
          <Ionicons name={getIconName(section)} size={24} color="white" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Helper function to get the icon name based on the section
function getIconName(section: string) {
  switch (section) {
    case "register":
      return "person";
    case "login":
      return "log-in";
    case "friends":
      return "people";
    case "camera":
      return "camera";
    default:
      return "camera";
  }
}
