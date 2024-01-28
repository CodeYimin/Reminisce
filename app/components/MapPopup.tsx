import { css } from "@emotion/native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { URL } from "./consts";
import { NotificationUser } from "./types";

export default function MapPopup({
  nUsers,
  userId,
  notificationId,
}: {
  nUsers: NotificationUser[];
  userId: string;
  notificationId: string;
}) {
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>();

  useEffect(() => {
    nUsers.forEach((u) => {
      if (u.latitude && u.longitude) {
        setMapRegion({
          latitude: u.latitude,
          longitude: u.longitude,
          latitudeDelta: mapRegion?.latitudeDelta || 0.0922,
          longitudeDelta: mapRegion?.longitudeDelta || 0.0423,
        });
      }
    });
  }, [nUsers]);

  return (
    <View
      style={css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-color: black;
        height: 80%;
      `}
    >
      <MapView
        style={css`
          height: 90%;
        `}
        region={mapRegion}
      >
        {nUsers
          .filter((nu) => nu.latitude && nu.longitude)
          .map((nu) => (
            <Marker
              coordinate={{ latitude: nu.latitude!, longitude: nu.longitude! }}
            >
              <View
                style={css`
                  background-color: white;
                  width: 75px;
                  height: 75px;
                  border-radius: 100%;
                  border: 3px solid black;
                `}
              >
                <Text
                  style={css`
                    text-align: center;
                    margin: auto;
                  `}
                >
                  {nu.user.username}
                </Text>
              </View>
            </Marker>
          ))}
      </MapView>
      <View
        style={css`
          height: 20%;
        `}
      >
        <TouchableOpacity
          style={css`
            background-color: black;
            height: 100px;
            padding: 0 10px;
            border: 3px solid red;
          `}
          onPress={async () => {
            const res = await fetch(`http://${URL}/toggleVisibility`, {
              method: "POST",
              body: JSON.stringify({
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
              font-size: 25px;
            `}
          >
            Toggle Location Visibility
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
