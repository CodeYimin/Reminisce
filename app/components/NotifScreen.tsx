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
    <View
      style={css`
        background-color: #222831;
        padding: 15px;
        width: 100%;
      `}
    >
      <View
        style={css`
          display: flex;
          flex-direction: row;
          border: 1px white solid;
          margin-top: 30px;
          border-radius: 15px;
        `}
      >
        <TextInput
          style={css`
            margin: 10px;
            flex-grow: 1;
            border-radius: 15px;
            color: white;
          `}
          placeholder="Send message..."
          placeholderTextColor="white"
          value={messageSending}
          onChangeText={setMessageSending}
        />
        <TouchableOpacity
          style={css`
            border: 1px solid white;
            padding: 0 30px;
            border-radius: 15px;
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
              color: white;
            `}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={css`
          height: 31%;
          margin-top: 15px;
        `}
      >
        <ScrollView>
          {messages.map((m) => (
            <View
              style={css`
                display: flex;
                flex-direction: column;
                border: 1px solid white;
                padding: 5px 15px;
                margin: 5px 15px;
                border-radius: 15px;
              `}
              key={m.id}
            >
              <Text
                style={css`
                  color: white;
                  font-size: 10px;
                `}
              >
                {m.owner.user.username}
              </Text>
              <Text
                style={css`
                  font-size: 15px;
                  color: white;
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
          margin: 15px;
        `}
      >
        <Image source={{ uri: photo, height: 350 }} borderRadius={15} />
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
