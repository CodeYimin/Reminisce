import { registerRootComponent } from "expo";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import registerNNPushToken from "native-notify";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const URL = "100.67.11.186:4000";

const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";

Location.requestForegroundPermissionsAsync();
Location.requestBackgroundPermissionsAsync();

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
  async (value) => {
    // if (value) {
    // console.log(JSON.stringify(value));
    // await fetch(`http://${URL}/location`, {
    //   method: "POST",
    //   body: JSON.stringify(value),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
    // }
  }
);

export default function App() {
  // KEEP AS EXPORT DEFAULT IF POSSIBLE
  registerNNPushToken(19139, "DLvOby9T6bf4IVzrvpA6CN"); // DO NOT TOUCH THIS LINE WHATEVER YOU DO
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const cameraElement = useRef<Camera>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function toggleCameraType() {
    setType((current: any) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    const photo = await cameraElement.current?.takePictureAsync({
      base64: true,
    });

    if (!photo) {
      return;
    }
    setCapturedImage(photo);

    const res = await fetch(`http://${URL}/uploadPhoto`, {
      method: "POST",
      body: JSON.stringify({ data: photo.base64 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref: any) => {
          // @ts-ignore
          cameraElement.current = ref;
        }}
        type={type}
        style={styles.camera}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 70,
              height: 70,
              bottom: 0,
              borderRadius: 50,
              backgroundColor: "#fff",
            }}
            onPress={takePicture}
          >
            <Text style={styles.text}>A</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    height: "100%",
  },
  camera: {
    // flex: 1,
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

registerRootComponent(App);
