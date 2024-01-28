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
import { User } from "./types";

export default function PhotoTakenPopup({
  photoUri,
  onClose,
  onSave,
}: {
  photoUri: string;
  onClose: () => void;
  onSave: (friendsAdded: string[]) => void;
}) {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendsAdded, setFriendsAdded] = useState<string[]>([]);
  const [friendFilter, setFriendFilter] = useState<string>("");

  useEffect(() => {
    (async () => {
      const friendsRes = await fetch(`http://${URL}/getFriends`, {
        credentials: "include",
      });
      setFriends(await friendsRes.json());
    })();
  }, []);

  return (
    <View
      style={css`
        position: absolute;
        top: 2%;
        left: 5%;
        width: 90%;
        background-color: black;
        height: 95%;
      `}
    >
      <ScrollView style={css``}>
        <TouchableOpacity
          style={css`
            background-color: white;
            height: 50px;
          `}
          onPress={onClose}
        >
          <Text
            style={css`
              margin: auto 0;
              text-align: center;
              font-size: 25px;
            `}
          >
            X
          </Text>
        </TouchableOpacity>
        <Image
          source={{
            uri: photoUri,
            height: 400,
          }}
        />
        <View
          style={css`
            background-color: white;
          `}
        >
          <Text
            style={css`
              text-align: center;
              font-size: 30px;
              color: red;
            `}
          >
            Add your friends to your photo
          </Text>
          <TextInput
            style={css`
              border: 3px green solid;
              margin: 10px;
            `}
            placeholder="Username"
            placeholderTextColor="green"
            value={friendFilter}
            onChangeText={setFriendFilter}
          />
          {friends
            .filter((ff) => ff.username.startsWith(friendFilter))
            .map((friend) => (
              <View
                style={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  padding: 20px;
                  border: 3px black solid;
                  margin: 10px;
                `}
              >
                <Text
                  style={css`
                    text-align: center;
                    font-size: 30px;
                  `}
                >
                  {friend.username}
                </Text>
                <TouchableOpacity
                  style={css`
                    border: 1px black solid;
                    padding: 10px;
                  `}
                  onPress={() => {
                    if (!friendsAdded.includes(friend.id)) {
                      setFriendsAdded([...friendsAdded, friend.id]);
                    } else {
                      setFriendsAdded(
                        friendsAdded.filter((f) => f !== friend.id)
                      );
                    }
                  }}
                >
                  <Text>
                    {friendsAdded.includes(friend.id) ? "Remove" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          <TouchableOpacity
            style={css`
              margin: 0 auto;
              background-color: blue;
            `}
          >
            <Text
              style={css`
                text-align: center;
                font-size: 50px;
                color: white;
              `}
              onPress={() => onSave(friendsAdded)}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
