import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import React, { useState, useEffect } from "react"
import styles from "../../style/homestyles"
import { useRouter } from "expo-router"
import { MOOD_CATEGORY, PROFILE } from "../../utils/appRoutes"
import axios from "axios"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Doctor from "../../components/Home/Doctor"
import Workout from "../../components/Home/Workout"
import LookingFor from "../../components/Home/LookingFor"
import FitnessChart from "../../components/Home/FitnessChart"
import Profile from "../../components/Home/Profile"

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const router = useRouter()
  const handleprofile = () => {
    router.push(`profile`)
  }
  const handledoc = () => {
    router.push(`doctor`)
  }

  const renderData = (value) => {
    // Call the convertBase64ToString function
    const decodedString = convertBase64ToString(value)
    // Use the decoded string in your JSX code
    return (
      <Image
        source={{ uri: decodedString }}
        resizeMode="contain"
        style={{ width: "85%", height: "85%" }}
      />
    )
  }

  const handlePress = (id) => {
    setSelectedItem(id === selectedItem ? null : id)
  }
  const [data, setData] = useState([])
  const [moodData, setMoodData] = useState([])

  const [image, setImage] = useState("")

  useEffect(() => {
    const GetMoodData = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"))

      const headers = {
        Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
      }
      try {
        const res = await axios.get(MOOD_CATEGORY, { headers })
        setMoodData(res.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    GetMoodData()
  }, [])

  const handleDoctor = () => {
    router.push(`doctor/doctorList`)
  }

  const handleChatBot = () => {
    router.push(`chatbots/chatbot`)
  }

  return (
    <View style={styles.container}>
      <Profile />
      <View style={styles.largecontainer}>
        {/* Emoji Mood Section */}
        {/* {showView &&
      ( */}
        <View style={styles.moodcontainer}>
          {moodData.map((column, index) => (
            <View style={styles.emojibutton} key={column.id}>
              <TouchableOpacity
                style={[
                  styles.emojiview,
                  column.id === selectedItem && styles.selected,
                ]}
                onPress={() => handlePress(column.id)}
              >
                {renderData(column.encodedImage)}
              </TouchableOpacity>
              <Text
                style={[
                  styles.notselected,
                  column.id === selectedItem && styles.selectedtext,
                ]}
              >
                {column.name}
              </Text>
            </View>
          ))}
        </View>
        <ScrollView style={{ height: "80%" }}>
          <FitnessChart />
          <LookingFor />
          <Doctor />
          <Workout />
        </ScrollView>
      </View>
    </View>
  )
}

export default Home

function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
