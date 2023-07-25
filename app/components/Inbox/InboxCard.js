import { View, Text, TouchableOpacity, Image } from "react-native"
import React from "react"
import { moderateScale, verticalScale } from "react-native-size-matters"
import styles from "../../style/inboxstyle"
import { useRouter } from "expo-router"
import { useNavigation } from "@react-navigation/native"

import { auth, database } from "../../utils/firebase"
import AsyncStorage from "@react-native-async-storage/async-storage"

import Toast from "react-native-simple-toast"
import {
  collection,
  getDoc,
  doc,
  orderBy,
  where,
  onSnapshot,
  query,
} from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
const InboxCard = () => {
  const navigation = useNavigation()
  const router = useRouter()
  const handlemessage = () => {}

  const [messages, setMessages] = useState([])
  const handleNavigateToChat = async (uid) => {
    const data = {
      name: uid.name,
      id: uid.uid,
    }
    await AsyncStorage.setItem("friendId", JSON.stringify(data))

    navigation.navigate("message")
  }
  const fetchData = async () => {
    const uid = JSON.parse(await AsyncStorage.getItem("firebaseUserId"))

    const collectionRef = collection(database, "users")
    const q = query(collectionRef, where("uid", "!=", uid), orderBy("uid"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(querySnapshot.docs.map((doc) => doc.data()))
    })
    return unsubscribe
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View>
      {messages.map((column, index) => (
        <View style={styles.chatcontainer} key={index}>
          <TouchableOpacity style={styles.iconatiner}>
            <Image
              source={{ uri: column.img }}
              style={{
                width: moderateScale(50),
                height: verticalScale(45),
                borderRadius: 50,
              }}
            />
            <View style={styles.online}>
              <View style={styles.onlinegreen}></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textconatiner}
            onPress={() => handleNavigateToChat(column)}
          >
            <Text style={styles.ctext1}>{column.name}</Text>
            <Text style={styles.ctext2}>
              So Any Updates on your project defense?
            </Text>
            <Text style={styles.ctext2}>
              Remember its going to be essential for your College Application
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

export default InboxCard
