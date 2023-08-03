import axios from "axios"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native"

import React, { useState, useEffect } from "react"
import styles from "../../style/homestyles"
import { useRouter } from "expo-router"

export default LookingFor = () => {
  const router = useRouter()

  const handleChatBot = () => {
    router.push(`chatbots/chatbot`)
  }

  const handledoc = () => {
    router.push(`doctor`)
  }
  const handleDoctor = () => {
    router.push(`doctor/doctorList`)
  }
  return (
    <View style={styles.lookingfor}>
      <Text style={{ fontSize: 16 }}>What are you looking for?</Text>
      <View style={styles.lookingcontainer}>
        <TouchableOpacity style={styles.lookingcard} onPress={handleChatBot}>
          <Image
            source={require("../../assets/Images/medical-report.png")}
            resizeMode="contain"
            style={styles.lookingimage}
          />
          <View style={styles.lTcontainer}>
            <Text style={styles.lookingtext}>Share</Text>
            <Text style={styles.lookingtext}>Your Problem</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lookingcard} onPress={handleDoctor}>
          <Image
            source={require("../../assets/Images/chat.png")}
            resizeMode="contain"
            style={styles.lookingimage}
          />
          <View style={styles.lTcontainer}>
            <Text style={styles.lookingtext}>View All</Text>
            <Text style={styles.lookingtext}>Doctor</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lookingcard}>
          <Image
            source={require("../../assets/Images/Graph-PNG-Transparent-Image.png")}
            resizeMode="contain"
            style={{ width: 40, height: 40 }}
          />
          <View style={styles.lTcontainer}>
            <Text style={styles.lookingtext}>Chart</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
