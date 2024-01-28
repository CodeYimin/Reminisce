import { css } from "@emotion/native";
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { LocationObject, getLastKnownPositionAsync } from "expo-location";
import { useRef, useState } from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";

export default function CameraView({
  onPhoto,
}: {
  onPhoto: (photo: CameraCapturedPicture, location: LocationObject) => void;
}) {
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [zoom, setZoom] = useState<number>(0);
  const cameraElement = useRef<Camera>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={css`
          height: 100%;
        `}
      >
        <Text>We need your permission to show the camera</Text>
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
    const location = await getLastKnownPositionAsync();

    if (!photo || !location) {
      return;
    }

    onPhoto(photo, location);
  }

  function handleZoomIn() {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 1));
  }

  function handleZoomOut() {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0));
  }

  return (
    <View
      style={css`
        height: 700px;
        display: flex;
        flex-direction: column;
        margin-top: -150px;
      `}
    >
      <View
        style={css`
          height: 235px;
          display: flex;
          flex-direction: row;
          background-color: #222831;
        `}
      >
        <TouchableOpacity
          style={css`
            background-color: #222831;
            margin-right: 3px;
            margin-top: 100px;
            padding: 10px;
          `}
          onPress={toggleCameraType}
        >
          <Ionicons name="camera-reverse" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleZoomIn}>
          <Ionicons name="add" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleZoomOut}>
          <Ionicons name="remove" size={36} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: "../assets/icon.png" }}
          style={{
            width: 50, // Set your desired width
            height: 50, // Set your desired height
            marginRight: 10, // Adjust the margin as needed
          }}
        />
      </View>
      <View
        style={css`
          background-color: #222831;
          display: flex;
          width: 100%;
        `}
      ></View>
      <Camera
        ref={(ref: any) => {
          // @ts-ignore
          cameraElement.current = ref;
        }}
        type={type}
        zoom={zoom}
        style={css`
          width: 100%;
          height: 80%;
          display: flex;
          bottom: 60px;
        `}
      />
      <View
        style={css`
          display: flex;
          flex-direction: row;
          background-color: #222831;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
          display: flex;
          bottom: 60px;
        `}
      >
        <TouchableOpacity
          style={css`
            width: 54px;
            height: 54px;
            bottom: 0;
            border-radius: 50px;
            background-color: #eeeeee;
            border-width: 5px;
            border-color: #414a4c;
            margin-top: 8px;
          `}
          onPress={takePicture}
        >
          <Text
            style={css`
              text-align: center;
            `}
          ></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
