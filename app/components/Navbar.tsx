import { css } from "@emotion/native";
import { Text, TouchableOpacity, View } from "react-native";

export default function Navbar({
  onClick,
}: {
  onClick: (section: "register" | "login" | "friends" | "camera") => void;
}) {
  return (
    <View
      style={css`
        background-color: black;
        display: flex;
        flex-direction: row;
        height: 150px;
        width: 100%;
      `}
    >
      <TouchableOpacity
        style={css`
          background-color: blue;
          width: 22.5%;
          margin: 0 1.25%;
        `}
        onPress={() => onClick("register")}
      >
        <Text
          style={css`
            margin: auto 0;
            font-size: 20px;
            color: white;
            text-align: center;
          `}
        >
          Register
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={css`
          background-color: blue;
          width: 22.5%;
          margin: 0 1.25%;
        `}
        onPress={() => onClick("login")}
      >
        <Text
          style={css`
            margin: auto 0;
            font-size: 20px;
            color: white;
            text-align: center;
          `}
        >
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={css`
          background-color: blue;
          width: 22.5%;
          margin: 0 1.25%;
        `}
        onPress={() => onClick("friends")}
      >
        <Text
          style={css`
            margin: auto 0;
            font-size: 20px;
            color: white;
            text-align: center;
          `}
        >
          Friends
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={css`
          background-color: blue;
          width: 22.5%;
          margin: 0 1.25%;
        `}
      >
        <Text
          style={css`
            margin: auto 0;
            font-size: 20px;
            color: white;
            text-align: center;
          `}
          onPress={() => onClick("camera")}
        >
          Camera
        </Text>
      </TouchableOpacity>
    </View>
  );
}
