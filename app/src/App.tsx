import { registerRootComponent } from "expo";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import registerNNPushToken from "native-notify";
import { useRef, useState } from "react";
import {
  Button,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const URL = "100.67.11.186:4000";

const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";

Location.requestForegroundPermissionsAsync();
Location.requestBackgroundPermissionsAsync();

// 1 define the task passing its name and a callback that will be called whenever the location changes
TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  const [location] = (data as any).locations;
  console.log(location);
  try {
  } catch (err) {
    console.error(err);
  }
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
Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
  if (value) {
    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
  }
});

function App() {
  const [type, setType] = useState(CameraType.back);
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
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    const photo = await cameraElement.current?.takePictureAsync({
      base64: true,
    });

    if (!photo) {
      return;
    }
    setPreviewVisible(true);
    setCapturedImage(photo);

    const res = await fetch(`http://${URL}/uploadPhoto`, {
      method: "POST",
      body: JSON.stringify({ data: photo.base64 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPreviewVisible(true);
      setCapturedImage(result);
    }
    const res = await fetch(`http://${URL}/uploadPhoto`, {
      method: "POST",
      body: JSON.stringify({ data: result.base64 }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const CameraPreview = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={{ uri: capturedImage && capturedImage.uri }}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => setPreviewVisible(false)}
          >
            <Text style={{ fontSize: 18, color: "#333" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => {
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
            <Text style={styles.text}></Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={pickImageFromGallery}
          >
            <Text style={styles.text}> Upload Image </Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <CameraPreview />
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

function wrapClassComponent(Component: any) {
  return function WrappedComponent(props: any) {
    registerNNPushToken(19102, "c0clDuoJsi0Pbud9Hc9qI0");
    return <Component />;
  };
}

registerRootComponent(App);

export default wrapClassComponent(App);
