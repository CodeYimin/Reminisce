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

  return (
    <View>
      <TextInput
        style={css`
          font-size: 25px;
          padding: 25px;
          border: 3px black solid;
          margin: 20px;
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
