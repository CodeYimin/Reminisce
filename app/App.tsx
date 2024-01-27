import { registerRootComponent } from "expo";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import registerNNPushToken from "native-notify";
import { View } from "react-native";
import { URL } from "./components/consts";
import ProfileScreen from "./screens/ProfileScreen";

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
  async (value) => {}
);

export default function App() {
  // KEEP AS EXPORT DEFAULT IF POSSIBLE
  registerNNPushToken(19139, "DLvOby9T6bf4IVzrvpA6CN"); // DO NOT TOUCH THIS LINE WHATEVER YOU DO

  return (
    <View>
      {/* <Popup /> */}
      {/* <CameraView /> */}
      <ProfileScreen />
    </View>
  );
}

registerRootComponent(App);
