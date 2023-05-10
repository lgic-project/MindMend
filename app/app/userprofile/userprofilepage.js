import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import styles from '../../style/userprofilestyle'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
const Userprofile = () => {
  
  
  return (
    <View style={styles.container}>
      {/* Heading */}
      <View style={styles.heading}>
        <TouchableOpacity>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text>Simran Baniya</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>
      {/* Profile Head Section */}
      <View style={styles.headcontainer}>
        <View style={styles.imagecontainer}>
          <Image source={require('../../assets/Images/person.png')} resizeMode='contain' style={styles.image} />
        </View>
        <View style={styles.textcontainer}>
          <Text style={styles.username}>@simran_moti</Text>
          <Text style={styles.headingtext}>Hi hello there I am Simran Baniya. I like to read books and books only. I am a girl. I am a very bad girl. Lol. Can you please do this and this. I say this only all the time
          </Text>
        </View>
      </View>
      {/* Add Message section */}
      <View style={styles.addsection}>
        <View style={styles.add} >
          <Ionicons name="person-add" size={24} color="white" />
          <Text style={styles.addtext}>Add Friend</Text>
        </View>
        <View style={styles.messenger}>
          <FontAwesome5 name="facebook-messenger" size={30} color="#B9B7B5" />
        </View>
        <View style={styles.downbutton}>
          <AntDesign name="caretdown" size={24} color="#B9B7B5" />
        </View>
      </View>
    </View>
  )
}

export default Userprofile