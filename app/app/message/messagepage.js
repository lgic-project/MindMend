import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import styles from '../../style/messagestyle'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import MessageCard from '../../components/Message/MessageCard';
import { useRouter } from 'expo-router';
const messagepage = () => {
  const router = useRouter();
  const handleback = () =>{
     router.push(`../dashboard/Inbox`)
  }
  return (
    <View style={styles.container} >
      <View style={styles.smallcontainer}>
        {/* heading container */}
        <TouchableOpacity style={styles.buttoncontainer} onPress={handleback}>
          <AntDesign name="left" size={18} color="black" />
        </TouchableOpacity>
        <View style={styles.titlecontainer}>
          <Text style={styles.titletext}>
            Simran
          </Text>
        </View>
      </View>
      <View style={styles.largecontainer}>
        {/* Message typing section */}
        <View style={styles.messagesection}>
        <TextInput placeholder='Send a message' style={styles.textinput} />
        <View style={styles.msgbutton}>
        <FontAwesome5 name="telegram-plane" size={26} color="white" />
        </View>
        </View>
        <MessageCard/>
      </View>
    </View>
  )
}

export default messagepage