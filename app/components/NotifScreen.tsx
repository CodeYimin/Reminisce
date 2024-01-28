import { css } from "@emotion/native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { URL } from "./consts";
import { INotification, Message, User } from "./types";

export default function NotifScreen({
  notificationId,
  onExit,
}: {
  notificationId: string;
  onExit: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [photo, setPhoto] = useState<string>();
  const [users, setUsers] = useState<User[]>();
  const [messageSending, setMessageSending] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `http://${URL}/notification?id=${notificationId}&includePhoto=1`
      );
      const data = (await res.json()) as INotification;

      setPhoto(data.photo!.data);
      setUsers(data.recipients);
    })();

    const int = setInterval(async () => {
      const res = await fetch(
        `http://${URL}/notification?id=${notificationId}&includePhoto=1`
      );
      const data = (await res.json()) as INotification;

      setMessages(data.messages);
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, []);

  return (
    <View>
      <Image source={{ uri: `data:image/jpg;base64,${photo}`, height: 400 }} />
      <View
        style={css`
          display: flex;
          flex-direction: row;
          border: 3px green solid;
        `}
      >
        <TextInput
          style={css`
            margin: 10px;
            flex-grow: 1;
          `}
          placeholder="Send message..."
          placeholderTextColor="green"
          value={messageSending}
          onChangeText={setMessageSending}
        />
        <TouchableOpacity
          style={css`
            border: 3px solid black;
            padding: 0 30px;
          `}
          onPress={async () => {
            setMessageSending("");
            const res = await fetch(`http://${URL}/sendNotificationMessage`, {
              method: "POST",
              body: JSON.stringify({
                message: messageSending,
                notificationId: notificationId,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
          }}
        >
          <Text
            style={css`
              margin: auto;
            `}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={css`
          height: 40%;
        `}
      >
        <ScrollView>
          {messages.map((m) => (
            <View
              style={css`
                display: flex;
                flex-direction: column;
                border: 3px solid black;
                padding: 15px;
                margin: 15px;
              `}
              key={m.id}
            >
              <Text>{m.owner.username}</Text>
              <Text
                style={css`
                  font-size: 20px;
                `}
              >
                {m.content}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={css`
          background-color: black;
          height: 80px;
          padding: 0 30px;
        `}
        onPress={onExit}
      >
        <Text
          style={css`
            margin: auto;
            color: white;
          `}
        >
          Exit
        </Text>
      </TouchableOpacity>
    </View>
  );
}
