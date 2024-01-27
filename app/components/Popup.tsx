import { css } from "@emotion/native";
import { Text, View } from "react-native";

export default function Popup() {
  return (
    <View
      style={css`
        position: absolute;
        top: 25%;
        left: 25%;
        width: 50%;
        height: 50%;
        background-color: black;
      `}
    >
      <Text>Hello</Text>
    </View>
  );
}
