import axios from "axios"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Wrap, Button, Spacer } from "@react-native-material/core"

import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native"
import { Avatar, Card, Text } from "react-native-paper"

import React, { useState, useEffect } from "react"
import styles from "../../style/homestyles"
import { useRouter } from "expo-router"

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />

export default Workout = () => {
  const router = useRouter()
  const [doctorData, setDoctorData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const slicedData = doctorData.slice(0, 2) // Extract the first 5 data items

  useEffect(() => {
    const GetDoctorData = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"))

      const headers = {
        Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
      }
      try {
        const res = await axios.get(DOCTOR_RATING, { headers })
        setDoctorData(res.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    GetDoctorData()
  }, [])

  const handleDoctorDetail = async (id) => {
    await AsyncStorage.setItem("doctorId", JSON.stringify(id))
    router.push("/doctor/doctorpage")
  }

  const handleWorkout = () => {
    router.push(`workout/WorkoutList`)
  }

  const renderDoctorCard = (value) => {
    const decodedString = convertBase64ToString(value.encodedImage)
    // Use the decoded string in your JSX code
    return (
      <ImageBackground
        style={{ flex: 1 }}
        imageStyle={{ borderRadius: 10 }}
        source={{ uri: decodedString }}
        resizeMode="cover"
      >
        <Text style={styles.doc1text}>{value.doctorName}</Text>
      </ImageBackground>
    )
  }
  return (
    <View className="m-5">
      <Wrap>
        <Text className=" font-semibold mt-2 text-base pb-3">Exercise</Text>
        <Spacer />
        <Button
          style={{ marginRight: 13, marginBottom: 4 }}
          onPress={handleWorkout}
          variant="text"
          title="View All"
        />
      </Wrap>
      <Wrap spacing={16}>
        <Card className="pb-3 w-5/12 ">
          <Card.Cover
            className="h-28"
            source={{ uri: "https://picsum.photos/700" }}
          />
          <Card.Content className="p-2">
            <Text className="font-bold text-base">Fat burn</Text>
            <Text className=" text-sm">10 minute</Text>
          </Card.Content>
          <Card.Actions className="-mt-12">
            <Text className="border text-xs font-bold border-slate-500 p-1 px-1 rounded-full text-white bg-slate-500">
              100 Calcs
            </Text>
          </Card.Actions>
        </Card>
        <Card className="w-5/12 pb-3 ">
          <Card.Cover
            className="h-28"
            source={{ uri: "https://picsum.photos/700" }}
          />
          <Card.Content className="p-2">
            <Text className="font-bold text-base">Fat burn</Text>
            <Text className=" text-sm">10 minute</Text>
          </Card.Content>
          <Card.Actions className="-mt-12">
            <Text className="border text-xs font-bold border-slate-500 p-1 px-1 rounded-full text-white bg-slate-500">
              100 Calcs
            </Text>
          </Card.Actions>
        </Card>
      </Wrap>
    </View>
  )
}
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
