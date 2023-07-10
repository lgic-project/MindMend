import { View, ScrollView, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import styles from "../../style/discoverstyles"
import { VStack, Flex, Wrap, Spacer, Button } from "@react-native-material/core"
import axios from "axios"
import { Buffer } from "buffer"
import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DOCTOR, DOCTOR_RATING } from "../../utils/appRoutes"
import { useRouter } from "expo-router"
import { Avatar, Card, Text } from "react-native-paper"

const WorkoutList = () => {
  const [doctorData, setDoctorData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])

  const router = useRouter()

  const handleDoctorDetail = async (id) => {
    await AsyncStorage.setItem("doctorId", JSON.stringify(id))
    router.push("/doctor/doctorpage")
  }

  const handleback = () => {
    router.push(`../dashboard/Home`)
  }

  const handleWorkoutDetail = () => {
    router.push(`/workout/WorkoutDetail`)
  }

  useEffect(() => {
    const GetDoctorData = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"))
      const headers = {
        Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
      }
      try {
        const res = await axios.get(DOCTOR, { headers })
        setDoctorData(res.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    GetDoctorData()
  }, [])

  const renderDoctorCard = (value) => {
    const decodedString = convertBase64ToString(value)
    // Use the decoded string in your JSX code
    return (
      <Image
        source={{ uri: decodedString }}
        style={[styles.img, styles.imgodd]}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        {/* heading container */}
        <TouchableOpacity
          style={{ position: "absolute", top: 15, left: 15 }}
          onPress={handleback}
        >
          <AntDesign name="left" size={18} color="black" />
        </TouchableOpacity>
        <View style={styles.titlecontainer}>
          <Text style={styles.titletext}>Exercise</Text>
        </View>
      </View>
      <View style={styles.largecontainer}>
        <View className="px-3 py-5">
          <ScrollView className="gap-6">
            <Card className="pb-3 " onPress={handleWorkoutDetail}>
              <Card.Cover
                className="h-36"
                source={{ uri: "https://picsum.photos/700" }}
              />
              <Card.Content className="p-2 px-6">
                <Text className="font-bold text-lg">Fat burn</Text>
                <Text className=" text-sm">10 minute</Text>
              </Card.Content>
              <Card.Actions className="-mt-12">
                <Text className="border text-sm font-bold border-slate-500 p-1 px-2 rounded-full text-white bg-slate-500">
                  100 Calcs
                </Text>
              </Card.Actions>
            </Card>
            <Card className="pb-3 " onPress={handleWorkoutDetail}>
              <Card.Cover
                className="h-36"
                source={{ uri: "https://picsum.photos/700" }}
              />
              <Card.Content className="p-2 px-6">
                <Text className="font-bold text-lg">Fat burn</Text>
                <Text className=" text-sm">10 minute</Text>
              </Card.Content>
              <Card.Actions className="-mt-12">
                <Text className="border text-sm font-bold border-slate-500 p-1 px-2 rounded-full text-white bg-slate-500">
                  100 Calcs
                </Text>
              </Card.Actions>
            </Card>
            <Card className="pb-3 " onPress={handleWorkoutDetail}>
              <Card.Cover
                className="h-36"
                source={{ uri: "https://picsum.photos/700" }}
              />
              <Card.Content className="p-2 px-6">
                <Text className="font-bold text-lg">Fat burn</Text>
                <Text className=" text-sm">10 minute</Text>
              </Card.Content>
              <Card.Actions className="-mt-12">
                <Text className="border text-sm font-bold border-slate-500 p-1 px-2 rounded-full text-white bg-slate-500">
                  100 Calcs
                </Text>
              </Card.Actions>
            </Card>
            <Card className="pb-3 " onPress={handleWorkoutDetail}>
              <Card.Cover
                className="h-36"
                source={{ uri: "https://picsum.photos/700" }}
              />
              <Card.Content className="p-2 px-6">
                <Text className="font-bold text-lg">Fat burn</Text>
                <Text className=" text-sm">10 minute</Text>
              </Card.Content>
              <Card.Actions className="-mt-12">
                <Text className="border text-sm font-bold border-slate-500 p-1 px-2 rounded-full text-white bg-slate-500">
                  100 Calcs
                </Text>
              </Card.Actions>
            </Card>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default WorkoutList
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
