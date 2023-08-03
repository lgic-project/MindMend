import { View, ScrollView, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import styles from "../../style/discoverstyles"
import { VStack, Flex, Wrap, Spacer, Button } from "@react-native-material/core"
import axios from "axios"
import { Buffer } from "buffer"
import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { EXERCISE } from "../../utils/appRoutes"
import { useRouter, useNavigation } from "expo-router"
import { Avatar, Card, Text } from "react-native-paper"

const WorkoutList = () => {
  const [exerciseData, setExerciseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])

  const router = useRouter()
  const navigation = useNavigation()

  const handleWorkoutDetail = async (id) => {
    await AsyncStorage.setItem("exerciseId", JSON.stringify(id))
    router.push("/workout/WorkoutDetail")
  }

  const handleback = () => {
    navigation.goBack()
  }

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

  const renderWorkoutCard = (value) => {
    if (value === "") {
      return (
        <Card.Cover
          className="h-36"
          source={require("../../assets/Images/shutterstock-163579436-yoga-alexander-y-1485955962.jpg")}
          resizeMode="contain"
        />
      )
    } else {
      const decodedString = convertBase64ToString(value)
      return <Card.Cover className="h-28" source={{ uri: decodedString }} />
    }
    // Use the decoded string in your JSX code
  }

  return (
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        {/* heading container */}
        <View className="w-full flex-row justify-between ml-5 ">
          <TouchableOpacity onPress={handleback}>
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <Text className="font-bold text-base">Exercise</Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </View>
      <View style={styles.largecontainer}>
        <View className="px-3 py-5">
          <ScrollView className="gap-6">
            {exerciseData.map((column, index) => (
              <Card
                key={column.id}
                className="pb-3 "
                onPress={() => handleWorkoutDetail(column.id)}
              >
                {renderWorkoutCard(column.encodedImage)}

                <Card.Content className="p-2 px-6">
                  <Text className="font-bold text-lg">{column.exercise}</Text>
                  <Text className=" text-sm">
                    {column.exerciseCategoryTitle}
                  </Text>
                </Card.Content>
                <Card.Actions className="-mt-12">
                  <Text className="border text-sm font-bold border-slate-500 p-1 px-2 rounded-full text-white bg-slate-500">
                    {column.timeDuration}
                  </Text>
                </Card.Actions>
              </Card>
            ))}
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
