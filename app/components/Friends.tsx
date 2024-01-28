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
        height: 760px;
        background-color: #393e46;
        margin-top: -120px;
        padding: 15px;
      `}
    >
      {/* Updated Header Text */}
      <View
        style={css`
          margin-top: 60px;
          height: 150px; // Increased height for more space
          justify-content: center; // Center content vertically
          align-items: center; // Center content horizontally
        `}
      >
        <Text
          style={css`
            font-size: 30px;
            color: white;
            text-align: center;
          `}
        >
          Connect with your friends!
        </Text>
      </View>

      <ScrollView>
        <View
          style={css`
            display: flex;
            flex-direction: row;
            border: 2px #eeeeee solid;
            border-radius: 15px;
          `}
        >
          <TextInput
            style={css`
              margin: 10px;
              flex-grow: 1;
            `}
            placeholder="Add friend by username..."
            placeholderTextColor="#EEEEEE"
            value={addFriend}
            onChangeText={setAddFriend}
          />
          <TouchableOpacity
            style={css`
              border: 1px solid #eeeeee;
              padding: 0 30px;
              height: 30px;
              margin: auto;
              margin-right: 5px;
              border-radius: 10px;
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
                color: #eeeeee;
              `}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={css`
            background-color: #222831;
            border-radius: 15px;
            padding: 15px;
            margin: 15px;
          `}
        >
          <Text
            style={css`
              text-align: center;
              font-size: 30px;
              color: white;
            `}
          >
            Friend Requests
          </Text>

          {friendRequests.length === 0 && (
            <Text
              style={css`
                color: white;
                text-align: center;
                margin-top: 5px;
              `}
            >
              You have no new friend requests.
            </Text>
          )}
          {friendRequests.map((request) => (
            <View
              key={request.id}
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
                  color: white;
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
                    const res = await fetch(
                      `http://${URL}/acceptFriendRequest`,
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
                  <Text
                    style={css`
                      color: white;
                    `}
                  >
                    Accept
                  </Text>
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
                  <Text
                    style={css`
                      color: white;
                    `}
                  >
                    Decline
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View
          style={css`
            background-color: #222831;
            border-radius: 15px;
            padding: 15px;
          `}
        >
          <Text
            style={css`
              text-align: center;
              font-size: 30px;
              color: white;
            `}
          >
            Friends
          </Text>

          {friends.length === 0 && (
            <Text
              style={css`
                color: white;
                text-align: center;
                margin-top: 5px;
              `}
            >
              You have no friends.
            </Text>
          )}

          {friends.map((friend) => (
            <View
              key={friend.id}
              style={css`
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin: 5px;
                align-items: center;
              `}
            >
              <Text
                style={css`
                  font-size: 20px;
                  color: white;
                `}
              >
                {friend.username}
              </Text>
              <TouchableOpacity
                style={css`
                  border: 1px white solid;
                  border-radius: 15px;
                  padding: 15px;
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
                <Text
                  style={css`
                    color: white;
                    margin: auto;
                  `}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
