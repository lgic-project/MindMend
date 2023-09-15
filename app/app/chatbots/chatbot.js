import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
  Image,
  Text,
  ScrollView,
} from "react-native"
import React, { useState } from "react"
import { Buffer } from "buffer"

import { AntDesign, FontAwesome5 } from "@expo/vector-icons"
import MessageCard from "../../components/Message/MessageCard"
import { useNavigation, useRouter } from "expo-router"
import styles from "../../style/chatbotstyles"

import {
  TextInput,
  Button,
  Divider,
  VStack,
  Wrap,
} from "@react-native-material/core"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import DoctorList from "./DoctorList"
import ExerciseList from "./ExerciseList"
import ChatBotMainMessage from "./ChatBotMainMessage"
import { SHARE_PROBLEM } from "../../utils/appRoutes"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Chatbot = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const handleback = () => {
    navigation.goBack()
  }
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [solution, setSolution] = useState([])

  const [visible, setVisible] = useState('')

  const handleProblem = async () => {
    setVisible('false')
    const userData = JSON.parse(await AsyncStorage.getItem("userData"))

    const headers = {
      Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
    }
    try {
      const res = await axios.post(
        SHARE_PROBLEM,
        {
          message,
        },
        { headers }
      )
      setSolution(res.data)

      setLoading(true)
      if (res.data) {
        setLoading(false)
        setVisible('true')
      }
    } catch (error) {
      console.log("Error:", error)
      // Handle the error here (e.g., display an error message to the user)
    }
  }

  const handleInput = (text) => {
    setMessage(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        {/* heading container */}
        <View className="w-full flex-row justify-between ml-5 ">
          <TouchableOpacity onPress={handleback}>
            <AntDesign name="left" size={20} color="white" />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-white">Share Your Problem</Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </View>

      <View style={styles.largecontainer}>
        {/* Message typing section */}

        <View style={styles.cardcontainer}>
          {/* card1 */}
          <View style={styles.cardmain}>
            <View style={styles.card}>
              {/* text container */}
              <View style={styles.textcontainer}>
                <Text style={[styles.title, styles.title1]}>
                  Feel free to post your problems
                </Text>
                <TextInput
                  multiline
                  label="Your issue"
                  variant="standard"
                  color="primary"
                  value={message}
                  onChangeText={handleInput}
                  style={{ marginTop: 6, padding: 4 }}
                />
                <Button
                  title="Send"
                  onPress={handleProblem}
                  color="#FACE51"
                  trailing={(props) => <Icon name="arrow-right" {...props} />}
                  loading={loading}
                  loadingIndicator="➡️"
                  loadingIndicatorPosition="trailing"
                  style={{ width: 100, marginBottom: 10 }}
                />
              </View>
            </View>
          </View>
          {visible=='true' ? (
  <ScrollView>
    <ChatBotMainMessage response={solution.aiResponse} />
    <DoctorList response={solution.doctorResps} />
    <ExerciseList response={solution.exerciseResps} />
  </ScrollView>
)  : visible === 'false' ? (
  <ActivityIndicator size="small" color="#0000ff" style={{ marginTop:5, marginLeft:170 }} />
): ( 
  <Text></Text>
)}
        </View>
      </View>
    </View>
  )
}

export default Chatbot
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
