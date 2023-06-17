import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { moderateScale, verticalScale } from 'react-native-size-matters'
import styles from '../../style/inboxstyle'
import { useRouter } from 'expo-router'
const InboxCard = () => {
    const router = useRouter();
    const handlemessage=()=>{
        router.push(`message`)
    }
    
  return (
    <View style={styles.chatcontainer}>
            
            <TouchableOpacity style={styles.iconatiner} >
                <Image source={require('../../assets/Images/person.png')} style={{ width: moderateScale(50), height: verticalScale(45), borderRadius: 50 }} />
                <View style={styles.online}>
                    <View style={styles.onlinegreen}></View>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.textconatiner} onPress={handlemessage}>
                <Text style={styles.ctext1}>Simran Baniya</Text>
                <Text style={styles.ctext2}>So Any Updates on your project defense?</Text>
                <Text style={styles.ctext2}>Remember its going to be essential for your College Application</Text>
            </TouchableOpacity>
        </View>
  )
}

export default InboxCard