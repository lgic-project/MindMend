import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import styles from '../../style/messagestyle'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
const messagepage = () => {
  return (
    <View style={styles.container} >

      <View style={styles.smallcontainer}>
        {/* heading container */}
        <TouchableOpacity style={styles.buttoncontainer}>
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
        <View style={{width:"100%", height:"10%", position:"absolute", bottom:5, display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row", }}>
        <TextInput placeholder='Send a message' style={{borderWidth:1, paddingVertical:5, paddingLeft:10, width:"70%", borderRadius:25}} />

        </View>
      </View>
    </View>
  )
}

export default messagepage