import { css } from "@emotion/native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register({
  onRegister,
}: {
  onRegister: (username: string, password: string) => Promise<boolean>;
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
        <Text
          style={css`
            margin-top: 100px;
            font-size: 50px;
          `}
        >
          Register
        </Text>
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
          setStatus(await onRegister(username, password));
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
          Register
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
