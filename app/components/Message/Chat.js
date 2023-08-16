import React, { useState, useEffect, useCallback } from "react"
import { GiftedChat } from "react-native-gifted-chat"
import { TouchableOpacity, Text } from "react-native"
import {
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore"
import { signOut } from "firebase/auth"
import { auth, database } from "../../utils/firebase"
import { useNavigation } from "@react-navigation/native"
import { AntDesign } from "@expo/vector-icons"

export default Chat = () => {
  const [messages, setMessages] = useState([])
  const navigation = useNavigation()

  // const Signout = () => {
  //   signOut(auth).catch((error) => console.log(error))
  // }

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         style={{
  //           marginRight: 10,
  //         }}
  //         onPress={Signout}
  //       >
  //         <AntDesign name="logout" size={24} style={{ marginRight: 10 }} />
  //       </TouchableOpacity>
  //     ),
  //   })
  // }, [navigation])

  const fetchData = async () => {
    try {
      const collectionRef = collection(database, "chats")
      const q = query(collectionRef, orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      )
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    )
    // setMessages([...messages, ...messages]);
    const { _id, createdAt, text, user } = messages[0]
    addDoc(collection(database, "chats"), {
      _id,
      createdAt,
      text,
      user,
    })
  }, [])
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={(messages) => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
      textInputStyle={{
        backgroundColor: "#fff",
        borderRadius: 20,
      }}
      user={{
        _id: auth?.currentUser?.email,
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  )
}
