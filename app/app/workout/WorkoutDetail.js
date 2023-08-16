import styles from "../../style/discoverstyles"
import { Avatar, Card, Text } from "react-native-paper"
import { View, ScrollView, Image, TouchableOpacity } from "react-native"
import { MaterialIcons, AntDesign } from "@expo/vector-icons"
import { VStack, Flex, Wrap, Spacer, Button } from "@react-native-material/core"

import axios from "axios"
import { Buffer } from "buffer"
import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation, useRouter } from "expo-router"
import { EXERCISE_BY_ID } from "../../utils/appRoutes"

const WorkoutDetail = () => {
  const [exerciseData, setExerciseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])

  const router = useRouter()
  const navigation = useNavigation()

  const handleback = () => {
    navigation.goBack()
  }
  const LeftContent = (props) => (
    <MaterialIcons
      className="bg-slate-700"
      name="fitness-center"
      size={18}
      color="black"
    />
  )

  const TimerContent = (props) => (
    <AntDesign
      className="bg-slate-700"
      name="clockcircle"
      size={18}
      color="black"
    />
  )
  const [title, setTitle] = useState("")
  const [categoryTitle, setCategoryTitle] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    const GetExerciseData = async () => {
      const id = await AsyncStorage.getItem("exerciseId")

      const userData = JSON.parse(await AsyncStorage.getItem("userData"))

      const headers = {
        Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
      }
      try {
        const res = await axios.get(EXERCISE_BY_ID + "/" + id + "/active", {
          headers,
        })
        console.log(res.data)
        setExerciseData(res.data)
        setTitle(res.data.title)
        setCategoryTitle(res.data.exerciseCategoryTitle)
        setTime(res.data.timeDuration)
        setDescription(res.data.description)
        setImage(res.data.encodedImage)

        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    GetExerciseData()
  }, [])

  const renderWorkoutCard = (value) => {
    if (value === "" || value === undefined) {
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
          <Text className="font-bold text-base">WorkoutDetail</Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </View>
      <View style={styles.largecontainer}>
        <View className="px-3 py-5 ">
          {exerciseData && (
            <ScrollView className="gap-4" style={{ height: "90%" }}>
              <Card className="pb-3 ">
                {renderWorkoutCard(image)}

                <View>
                  <Wrap>
                    <Card.Title
                      className="w-2/4 "
                      title={title}
                      subtitle={categoryTitle}
                      left={LeftContent}
                    />

                    <Card.Title
                      className="w-2/4"
                      title={time}
                      subtitle="Total time"
                      left={TimerContent}
                    />
                  </Wrap>
                </View>
              </Card>
              <Card className="pb-3 mb-5 ">
                <Card.Content className="p-6 px-6 mb-5">
                  <Text className="font-bold text-xl">Description</Text>
                  <Text className=" text-base mt-4">{description}</Text>
                </Card.Content>
              </Card>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  )
}

export default WorkoutDetail

function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
