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

const handleback = () => {
  router.push(`../dashboard/Inbox`)
}

// import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'

import {
  collection,
  addDoc,
  orderBy,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore"
import { signOut } from "firebase/auth"
import { auth, database } from "../../utils/firebase"
import { useNavigation } from "@react-navigation/native"
import { AntDesign } from "@expo/vector-icons"
import { useRouter } from "expo-router"

export default Chat = ({ user, route }) => {
  const router = useRouter()

  // const { uid } = route.params

  const [messages, setMessages] = useState([])
  const navigation = useNavigation()

  const Signout = () => {
    signOut(auth).catch((error) => console.log(error))
  }

  useEffect(() => {}, [])

  // useLayoutEffect(() => {
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

  // useLayoutEffect(() => {
  //   const collectionRef = collection(database, "chats")
  //   const q = query(collectionRef, orderBy("createdAt", "desc"))

  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     setMessages(
  //       querySnapshot.docs.map((doc) => ({
  //         _id: doc.data()._id,
  //         createdAt: doc.data().createdAt.toDate(),
  //         text: doc.data().text,
  //         user: doc.data().user,
  //       }))
  //     )
  //   })
  //   return unsubscribe
  // }, [])

  const onSend = useCallback((messageArray) => {
    const msg = messageArray[0]
    const myMsg = {
      ...msg,
      sendBy: user.uid,
      createdat: new Date(),
    }
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    )

    const uuid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

    const paymentRef = doc(database, "chatrooms", uuid, "messages")
    addDoc(paymentRef, {
      ...myMsg,
    })
  }, [])
  return (
    <View style={styles.container}>
      <View className="h-28 fixed">
        {/* heading container */}
        <TouchableOpacity
          className="mt-5 w-5"
          style={styles.buttoncontainer}
          onPress={handleback}
        >
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-center text-xl -mt-5 font-bold text-white">
            Simran
          </Text>
        </View>
      </View>
      <View className="bg-white h-40" style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={(text) => onSend(text)}
          user={{
            _id: 1,
            avatar: "https://placeimg.com/140/140/any",
          }}
        />
      </View>
    </View>
  )
}
