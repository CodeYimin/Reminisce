import { css } from "@emotion/native";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login({
  onLogin: onLogin,
}: {
  onLogin: (username: string, password: string) => Promise<boolean>;
}) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<boolean>();
  const logoSrc = require("../assets/reminisce.png");

  return (
    <View>
      <View
        style={css`
          height: 200px;
          display: flex;
          flex-direction: row;
          justify-content: center; /* Center content horizontally */
          align-items: center; /* Center content vertically */
          background-color: white;
          margin-top: -120px;
        `}
      >
        <Image
          source={logoSrc}
          style={{
            width: 200 * 1.25, // Adjust the width as needed for a larger logo
            height: 100 * 1.25, // Adjust the height as needed for a larger logo
            marginLeft: -30, // Adjust the marginLeft to move the logo slightly to the left
            marginTop: 20,
          }}
        />
      </View>
      <TextInput
        style={css`
          font-size: 25px;
          padding: 25px;
          border: 3px black solid;
          margin: 20px;
          border-radius: 15px;
        `}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={css`
          font-size: 25px;
          padding: 25px;
          border: 3px black solid;
          margin: 20px;
          border-radius: 15px;
        `}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={css`
          border: 3px solid black;
          padding: 20px;
          width: 50%;
          margin: 10px auto;
          border-radius: 15px;
        `}
        onPress={async () => {
          setStatus(await onLogin(username, password));
          setUsername("");
          setPassword("");
        }}
      >
        <Text
          style={css`
            margin: auto;
            font-size: 25px;
          `}
        >
          Login
        </Text>
      </TouchableOpacity>
      {status !== undefined && (
        <Text
          style={css`
            text-align: center;
            font-size: 15px;
            color: ${status ? "green" : "red"};
          `}
        >
          {status ? "Success" : "Fail"}
        </Text>
      )}
    </View>
  );
}
