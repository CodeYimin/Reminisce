import { css } from "@emotion/native";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { LocationObject, getLastKnownPositionAsync } from "expo-location";
import { useRef, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function CameraView({
  onPhoto,
}: {
  onPhoto: (photo: CameraCapturedPicture, location: LocationObject) => void;
}) {
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
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

  return (
    <View
      style={css`
        height: 700px;
        display: flex;
        flex-direction: column;
      `}
    >
      <Camera
        ref={(ref: any) => {
          // @ts-ignore
          cameraElement.current = ref;
        }}
        type={type}
        style={css`
          width: 100%;
          height: 80%;
        `}
      />
      <View
        style={css`
          display: flex;
          flex-direction: row;
          background-color: green;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
        `}
      >
        <TouchableOpacity
          style={css`
            background-color: blue;
            margin-right: 3px;
          `}
          onPress={toggleCameraType}
        >
          <Text
            style={css`
              font-size: 36px;
              color: white;
            `}
          >
            Flip Camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={css`
            width: 70px;
            height: 70px;
            bottom: 0;
            border-radius: 50px;
            background-color: #fff;
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
