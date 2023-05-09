import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../style/homestyles'
const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View>
          <Text style={{ fontSize:20, color:"gray" }}>Hi User</Text>
          <Text>How are you this morning?</Text>
        </View>
        <TouchableOpacity>
          <Image source={require('../../assets/Images/person.png')} resizeMode='contain' style={{ width:45, height:45,borderRadius:50}}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Home