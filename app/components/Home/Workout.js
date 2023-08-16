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
import { EXERCISE } from "../../utils/appRoutes"

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />

export default Workout = () => {
  const router = useRouter()
  const [exerciseData, setExerciseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const slicedExercise = exerciseData.slice(0, 2) // Extract the first 5 data items

  useEffect(() => {
    const GetExerciseData = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"))

      const headers = {
        Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
      }
      try {
        const res = await axios.get(EXERCISE, { headers })
        setExerciseData(res.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    GetExerciseData()
  }, [])

  const handleDoctorDetail = async (id) => {
    await AsyncStorage.setItem("doctorId", JSON.stringify(id))
    router.push("/doctor/doctorpage")
  }

  const handleWorkout = () => {
    router.push(`workout/WorkoutList`)
  }
  const handleWorkoutDetail = async (id) => {
    await AsyncStorage.setItem("exerciseId", JSON.stringify(id))
    router.push("/workout/WorkoutDetail")
  }

  const renderWorkoutCard = (value) => {
    if (value === "") {
      return (
        <Card.Cover
          className="h-28"
          source={require("../../assets/Images/shutterstock-163579436-yoga-alexander-y-1485955962.jpg")}
        />
      )
    } else {
      const decodedString = convertBase64ToString(value)
      return <Card.Cover className="h-28" source={{ uri: decodedString }} />
    }
    // Use the decoded string in your JSX code
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
        {slicedExercise.map((column, index) => (
          <Card
            key={column.id}
            className="pb-3 w-5/12 "
            onPress={() => handleWorkoutDetail(column.id)}
          >
            {renderWorkoutCard(column.encodedImage)}

            <Card.Content className="p-2 pb-3">
              <Text className="font-bold text-base">{column.title}</Text>
              <Text className=" text-sm">{column.exerciseCategoryTitle}</Text>
            </Card.Content>
            <Card.Actions className="-mt-16">
              <Text className="border text-xs font-bold border-slate-500 p-1 px-1 rounded-full text-white bg-slate-500">
                {column.timeDuration}
              </Text>
            </Card.Actions>
          </Card>
        ))}
      </Wrap>
    </View>
  )
}
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
