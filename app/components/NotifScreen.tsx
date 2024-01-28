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
import MapPopup from "./MapPopup";
import { URL } from "./consts";
import { INotification, Message, NotificationUser } from "./types";

export default function NotifScreen({
  notificationId,
  onExit,
  userId,
}: {
  notificationId: string;
  onExit: () => void;
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [photo, setPhoto] = useState<string>();
  const [users, setUsers] = useState<NotificationUser[]>([]);
  const [messageSending, setMessageSending] = useState<string>("");
  const [mapOpen, setMapOpen] = useState<boolean>(false);

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
      setUsers(data.recipients);
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, []);

  return (
    <View>
      <Image source={{ uri: photo, height: 400 }} />
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
          height: 35%;
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
              <Text>{m.owner.user.username}</Text>
              <Text
                style={css`
                  font-size: 25px;
                `}
              >
                {m.content}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={css`
          display: flex;
          flex-direction: row;
          width: 100%;
        `}
      >
        <TouchableOpacity
          style={css`
            background-color: black;
            height: 100px;
            padding: 0 10px;
            border: 3px solid red;
            flex-grow: 1;
          `}
          onPress={onExit}
        >
          <Text
            style={css`
              margin: auto;
              color: white;
              font-size: 25px;
            `}
          >
            Exit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={css`
            background-color: black;
            height: 100px;
            padding: 0 10px;
            border: 3px solid red;
            flex-grow: 1;
          `}
          onPress={() => {
            setMapOpen(!mapOpen);
          }}
        >
          <Text
            style={css`
              margin: auto;
              color: white;
              font-size: 25px;
            `}
          >
            {mapOpen ? "Close" : "Open"} Map
          </Text>
        </TouchableOpacity>
      </View>
      {mapOpen && (
        <MapPopup
          nUsers={users}
          userId={userId}
          notificationId={notificationId}
        />
      )}
    </View>
  );
}
