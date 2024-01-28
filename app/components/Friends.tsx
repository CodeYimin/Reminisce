import { css } from "@emotion/native";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { URL } from "./consts";
import { User } from "./types";

export default function Friends({
  onAdd,
  onRemove,
}: {
  onAdd: (friend: User) => void;
  onRemove: (friend: User) => void;
}) {
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [addFriend, setAddFriend] = useState<string>("");

  const updateData = useCallback(() => {
    (async () => {
      const friendRequestsRes = await fetch(`http://${URL}/getFriendRequests`, {
        credentials: "include",
      });
      setFriendRequests(await friendRequestsRes.json());
    })();
    (async () => {
      const friendsRes = await fetch(`http://${URL}/getFriends`, {
        credentials: "include",
      });
      setFriends(await friendsRes.json());
    })();
  }, []);

  useEffect(() => {
    updateData();
  }, []);

  return (
    <View
      style={css`
        height: 80%;
      `}
    >
      <ScrollView>
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
            placeholder="Add friend by username..."
            placeholderTextColor="green"
            value={addFriend}
            onChangeText={setAddFriend}
          />
          <TouchableOpacity
            style={css`
              border: 3px solid black;
              padding: 0 30px;
            `}
            onPress={async () => {
              const res = await fetch(`http://${URL}/sendFriendRequest`, {
                method: "POST",
                body: JSON.stringify({
                  otherUsername: addFriend,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });
              setAddFriend("");
            }}
          >
            <Text
              style={css`
                margin: auto;
              `}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={css`
            text-align: center;
            font-size: 30px;
          `}
        >
          Friend Requests
        </Text>

        {friendRequests.map((request) => (
          <View
            style={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin: 5px;
            `}
          >
            <Text
              style={css`
                font-size: 30px;
              `}
            >
              {request.username}
            </Text>
            <View
              style={css`
                display: flex;
                flex-direction: row;
              `}
            >
              <TouchableOpacity
                style={css`
                  border: 3px black solid;
                  margin-right: 10px;
                `}
                onPress={async () => {
                  const res = await fetch(`http://${URL}/acceptFriendRequest`, {
                    method: "POST",
                    body: JSON.stringify({
                      otherId: request.id,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  });

                  updateData();
                }}
              >
                <Text>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={css`
                  border: 3px black solid;
                `}
                onPress={async () => {
                  const res = await fetch(
                    `http://${URL}/declineFriendRequest`,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        otherId: request.id,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    }
                  );

                  updateData();
                }}
              >
                <Text>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text
          style={css`
            text-align: center;
            font-size: 30px;
          `}
        >
          Friends
        </Text>

        {friends.map((friend) => (
          <View
            style={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin: 5px;
            `}
          >
            <Text
              style={css`
                font-size: 30px;
              `}
            >
              {friend.username}
            </Text>
            <TouchableOpacity
              style={css`
                border: 3px black solid;
              `}
              onPress={async () => {
                const res = await fetch(`http://${URL}/removeFriend`, {
                  method: "POST",
                  body: JSON.stringify({
                    otherId: friend.id,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                });

                updateData();
              }}
            >
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
