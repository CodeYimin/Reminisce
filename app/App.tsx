import { css } from "@emotion/native";
import { registerRootComponent } from "expo";
import { CameraCapturedPicture } from "expo-camera";
import * as Location from "expo-location";
import { addNotificationResponseReceivedListener } from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import registerNNPushToken, { registerIndieID } from "native-notify";
import { useEffect, useState } from "react";
import { View } from "react-native";
import CameraView from "./components/CameraView";
import Friends from "./components/Friends";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import NotifScreen from "./components/NotifScreen";
import PhotoTakenPopup from "./components/PhotoTakenPopup";
import Register from "./components/Register";
import { URL } from "./components/consts";

async function setup() {
  const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";

  await Location.requestForegroundPermissionsAsync();
  await Location.requestBackgroundPermissionsAsync();

  // 1 define the task passing its name and a callback that will be called whenever the location changes
  TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data, error }) => {
    const [location] = (data as any).locations;
    await fetch(`http://${URL}/location`, {
      method: "POST",
      body: JSON.stringify(location),
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  // 2 start the task
  Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1, // minimum change (in meters) betweens updates
    deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
    // foregroundService is how you get the task to be updated as often as would be if the app was open
    foregroundService: {
      notificationTitle: "Using your location",
      notificationBody:
        "To turn off, go back to the app and switch something off.",
    },
  });

  // 3 when you're done, stop it
  Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then(
    async (value) => {}
  );
}

export default function App() {
  const [notificationId, setNotificationId] = useState<string>();
  const [userId, setUserId] = useState<string>();
  registerNNPushToken(19139, "DLvOby9T6bf4IVzrvpA6CN"); // DO NOT TOUCH THIS LINE WHATEVER YOU DO
  useEffect(() => {
    setup();
    addNotificationResponseReceivedListener((response) => {
      setNotificationId(response.notification.request.content.data.id);
      console.log(response.notification.request.content.data);
    });
    const int = setInterval(async () => {
      const location = await Location.getLastKnownPositionAsync();
      await fetch(`http://${URL}/location`, {
        method: "POST",
        body: JSON.stringify(location),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }, 5000);

    return () => clearInterval(int);
  }, []);

  const [photo, setPhoto] = useState<
    CameraCapturedPicture & { location: Location.LocationObject }
  >();
  const [section, setSection] = useState<
    "register" | "login" | "friends" | "camera"
  >("camera");

  if (notificationId) {
    return (
      <NotifScreen
        notificationId={notificationId}
        userId={userId || ""}
        onExit={() => setNotificationId(undefined)}
      />
    );
  }

  return (
    <View
      style={css`
        display: flex;
        flex-direction: column;
      `}
    >
      {/* <CameraView onPhoto={setPhoto} /> */}
      <Navbar onClick={setSection} />
      {section === "camera" ? (
        <View>
          <CameraView
            onPhoto={(photo, location) => {
              setPhoto({ ...photo, location: location });
            }}
          />
          {/* <PhotoTakenPopup
            photoUri={
              "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
            }
            onClose={() => {}}
            onSave={() => {}}
          /> */}
          {photo && (
            <PhotoTakenPopup
              photoUri={`data:image/jpg;base64,${photo.base64}`}
              onClose={() => setPhoto(undefined)}
              onSave={async (friendsAdded) => {
                const res = await fetch(`http://${URL}/uploadPhoto`, {
                  method: "POST",
                  body: JSON.stringify({
                    data: `data:image/jpg;base64,${photo.base64}`,
                    location: photo.location,
                    taggedUserIds: friendsAdded,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                setPhoto(undefined);
              }}
            />
          )}
        </View>
      ) : section === "friends" ? (
        <Friends onAdd={() => {}} onRemove={() => {}} />
      ) : section === "register" ? (
        <Register
          onRegister={async (username, password) => {
            const res = await fetch(`http://${URL}/register`, {
              method: "POST",
              body: JSON.stringify({
                username: username,
                password: password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
            return res.status === 200;
          }}
        />
      ) : section === "login" ? (
        <Login
          onLogin={async (username, password) => {
            const res = await fetch(`http://${URL}/login`, {
              method: "POST",
              body: JSON.stringify({
                username: username,
                password: password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
            if (res.status === 200) {
              const data = await res.json();
              await registerIndieID(data.id, 19139, "DLvOby9T6bf4IVzrvpA6CN");
              setUserId(data.id);
              return true;
            } else {
              return false;
            }
          }}
        />
      ) : null}
      {/* <MapPopup /> */}

      {/* <ProfileScreen /> */}
    </View>
  );
}

registerRootComponent(App);
