import { View, Text } from "react-native"
import Walkthrough from "./walkthrough"
import * as Notifications from "expo-notifications"
import { useCallback, useEffect, useRef, useState } from "react"
import Toast from "react-native-toast-message"

Notifications.setNotificationHandler({
  handleNotification: async () => ({}),
})

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    console.log("Permission for push notifications not granted")
    return
  }

  // Get the device token
  const token = (await Notifications.getExpoPushTokenAsync()).data
  console.log("Device Token:", token)

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }
}
export default function Home() {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])
  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Walkthrough />
    </View>
  )
}
