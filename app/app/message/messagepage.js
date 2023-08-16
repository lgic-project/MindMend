// import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
// import React from 'react'
// import styles from '../../style/messagestyle'
// import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
// import MessageCard from '../../components/Message/MessageCard';
// import { useRouter } from 'expo-router';
// const messagepage = () => {
//   const router = useRouter();
//   const handleback = () =>{
//      router.push(`../dashboard/Inbox`)
//   }
//   return (
//     <View style={styles.container} >
//       <View style={styles.smallcontainer}>
//         {/* heading container */}
//         <TouchableOpacity style={styles.buttoncontainer} onPress={handleback}>
//           <AntDesign name="left" size={18} color="black" />
//         </TouchableOpacity>
//         <View style={styles.titlecontainer}>
//           <Text style={styles.titletext}>
//             Simran
//           </Text>
//         </View>
//       </View>
//       <View style={styles.largecontainer}>
//         {/* Message typing section */}
//         <View style={styles.messagesection}>
//         <TextInput placeholder='Send a message' style={styles.textinput} />
//         <View style={styles.msgbutton}>
//         <FontAwesome5 name="telegram-plane" size={26} color="white" />
//         </View>
//         </View>
//         <MessageCard/>
//       </View>
//     </View>
//   )
// }

// export default messagepage

import React, { useState, useEffect, useLayoutEffect, useCallback } from "react"
import { GiftedChat } from "react-native-gifted-chat"
import { TouchableOpacity, Text, View } from "react-native"
import styles from "../../style/messagestyle"

// import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'

import {
  collection,
  addDoc,
  orderBy,
  doc,
  onSnapshot,
  query,
  getDocs,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore"
import { signOut } from "firebase/auth"
import { auth, database } from "../../utils/firebase"
import { AntDesign } from "@expo/vector-icons"
import { useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "expo-router"

export default Chat = ({ user }) => {
  const route = useRoute() // Use useRoute() hook to get the route object
  const [uid, setUid] = useState("")
  const [name, setName] = useState("")
  const [senderId, setSenderId] = useState("")

  const [messages, setMessages] = useState([])
  const navigation = useNavigation()

  const handleback = () => {
    navigation.goBack()
  }

  const GetUID = async () => {
    const senderId = JSON.parse(await AsyncStorage.getItem("firebaseUserId"))
    const id = JSON.parse(await AsyncStorage.getItem("friendId"))
    setSenderId(senderId)
    setUid(id.id)
    setName(id.name)
    // await AsyncStorage.removeItem("friendId")
  }
  const fetchData = async () => {
    const senderId = JSON.parse(await AsyncStorage.getItem("firebaseUserId"))
    const id = JSON.parse(await AsyncStorage.getItem("friendId"))
    const uuid =
      id.id > senderId ? senderId + "-" + id.id : id.id + "-" + senderId
    const collectionRef = collection(database, "chatrooms", uuid, "messages")
    const q = query(collectionRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const messages = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      data.createdAt = data.createdAt.toDate()
      return data
    })

    setMessages(messages)
  }

  useEffect(() => {
    GetUID()
    fetchData()
  }, [])

  const Signout = () => {
    signOut(auth).catch((error) => console.log(error))
  }

  const onSend = (messageArray) => {
    const msg = messageArray[0]
    const myMsg = {
      ...msg,
      sendBy: senderId,
      sendTo: uid,
      createdAt: new Date(),
    }
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    )

    // Ensure that the uuid is constructed with two segments separated by a hyphen ("-")
    const uuid = uid > senderId ? senderId + "-" + uid : uid + "-" + senderId

    const paymentRef = collection(database, "chatrooms")
    addDoc(collection(paymentRef, uuid, "messages"), {
      ...myMsg,
      createdAt: serverTimestamp(),
    })
  }

  return (
    <View style={styles.container}>
      <View className="h-28 fixed">
        {/* heading container */}
        <View className="w-full flex-row justify-between ml-5 mt-5 ">
          <TouchableOpacity onPress={handleback}>
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-center text-xl font-bold text-white">
            {name}
          </Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </View>
      <View className="bg-white h-40" style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: senderId,
          }}
        />
      </View>
    </View>
  )
}
