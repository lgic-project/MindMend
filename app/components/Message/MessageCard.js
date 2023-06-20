import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../style/messagestyle'
import { useRouter } from 'expo-router'
const MessageCard = () => {
  const router = useRouter();
    const handleprofile=()=>{
        router.push(`userprofile`)
    }

  return (
    <View style={{width:"100%", height:"88%", paddingTop:35, paddingHorizontal:10, display:"flex", justifyContent:"flex-end", gap:30}}>
      <View style={{width:"100%", display:"flex", flexDirection:"row", gap:10, padding:5, alignItems:"center"}}>
        <TouchableOpacity onPress={handleprofile} >
        <Image source={require('../../assets/Images/person.png')} style={{ width:25, height:25, borderRadius:50 }}/>
        </TouchableOpacity>
      <View style={{width:"65%", backgroundColor:"#EAE9E9", borderRadius:25, padding:15}}>
        <Text>
            How do you feel today? Today I have been running a long distance
            in a short time and now I am feeling excited. I want to share this fun with you.
        </Text>
      </View>
      </View>
      <View style={{width:"100%", display:"flex", justifyContent:"flex-end", flexDirection:"row"}}>
      <View style={{width:"65%", backgroundColor:"#FACE51",borderRadius:25, padding:15}}>
        <Text>Oh really, congratulations you must be very happy. I also feel happy for you.</Text>
      </View>
      </View>
    </View>
  )
}

export default MessageCard