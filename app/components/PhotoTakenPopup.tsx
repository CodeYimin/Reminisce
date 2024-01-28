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
        top: 0;
        left: 0;
        width: 100%;
        background-color: #222831;
        height: 1000px;
      `}
    >
      <ScrollView style={css``}>
        <View
          style={css`
            margin: 15px;
          `}
        >
          <Image
            source={{
              uri: photoUri,
              height: 350,
            }}
            borderRadius={15}
          />
        </View>
        <View
          style={css`
            /* background-color: white; */
          `}
        >
          <Text
            style={css`
              text-align: center;
              font-size: 30px;
              color: white;
            `}
          >
            Add friends to your photo!
          </Text>
          <TextInput
            style={css`
              display: flex;
              flex-direction: row;
              border: 2px #eeeeee solid;
              border-radius: 15px;
              padding: 15px;
              margin: 15px;
              color: white;
            `}
            placeholder="Filter Username..."
            placeholderTextColor="white"
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
                  border: 1px white solid;
                  margin: 10px;
                  border-radius: 15px;
                `}
              >
                <Text
                  style={css`
                    text-align: center;
                    font-size: 30px;
                    color: white;
                  `}
                >
                  {friend.username}
                </Text>
                <TouchableOpacity
                  style={css`
                    border: 1px white solid;
                    padding: 10px;
                    border-radius: 15px;
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
                  <Text
                    style={css`
                      color: white;
                    `}
                  >
                    {friendsAdded.includes(friend.id) ? "Remove" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          <View
            style={css`
              display: flex;
              flex-direction: row;
              justify-content: center;
            `}
          >
            <TouchableOpacity
              style={css`
                border: 1px white solid;
                border-radius: 15px;
                padding: 15px;
                width: 50%;
                margin: 15px;
              `}
            >
              <Text
                style={css`
                  text-align: center;
                  font-size: 30px;
                  color: white;
                `}
                onPress={() => onSave(friendsAdded)}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={css`
                border: 1px #9d9d9d solid;
                border-radius: 15px;
                padding: 15px;
                flex-grow: 1;
                margin: 15px;
              `}
              onPress={onClose}
            >
              <Text
                style={css`
                  margin: auto 0;
                  text-align: center;
                  font-size: 30px;
                  color: #9d9d9d;
                `}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
