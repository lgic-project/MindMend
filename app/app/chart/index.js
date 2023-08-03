import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import styles from "../../style/discoverstyles"
import { VStack, Flex, Wrap } from "@react-native-material/core"
import axios from "axios"
import { Buffer } from "buffer"
import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DOCTOR, DOCTOR_RATING } from "../../utils/appRoutes"
import { useNavigation, useRouter } from "expo-router"
import { LineChart, PieChart } from "react-native-chart-kit"

const History = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const navigation = useNavigation()

  const router = useRouter()

  const handleDoctorDetail = async (id) => {
    await AsyncStorage.setItem("doctorId", JSON.stringify(id))
    router.push("/doctor/doctorpage")
  }

  const handleback = () => {
    navigation.goBack()
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
        <View className="w-full flex-row justify-between ml-5 ">
          <TouchableOpacity onPress={handleback}>
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <Text className="font-bold text-base">Progress Report </Text>
          <TouchableOpacity></TouchableOpacity>
        </View>
      </View>
      <View style={styles.largecontainer} className="px-5">
        <ScrollView>
          {/* card container */}
          <View style={styles.cardcontainer} className="">
            {/* card1 */}
            <Text className="font-bold text-base">Overall Progress</Text>
            <ScrollView horizontal={true}>
              <LineChart
                data={{
                  labels: ["January", "February", "March", "April"],
                  datasets: [
                    {
                      data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                      ],
                    },
                  ],
                }}
                width={Dimensions.get("window").width * 2} // from react-native
                height={220}
                yAxisLabel={""}
                chartConfig={{
                  backgroundColor: "#1cc910",
                  backgroundGradientFrom: "#eff3ff",
                  backgroundGradientTo: "#efefef",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </ScrollView>
            {/* card1 end */}
          </View>

          <View style={styles.cardcontainer} className="">
            {/* card1 */}
            <Text className="font-bold text-base">Your Mood History</Text>
            <ScrollView horizontal={true}>
              <PieChart
                data={[
                  {
                    name: "Happy",
                    population: 215,
                    color: "#FAFFAF",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                  {
                    name: "Very Happy",
                    population: 280,
                    color: "#E8A0BF",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                  {
                    name: "Normal",
                    population: 119,
                    color: "rgb(0, 0, 255)",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                  {
                    name: "Sad",
                    population: 50,
                    color: "rgba(131, 167, 234, 1) ",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                  {
                    name: "Very Sad",
                    population: 11,
                    color: "#22577E",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                ]}
                width={Dimensions.get("window").width - 35}
                height={220}
                chartConfig={{
                  backgroundColor: "#1cc910",
                  backgroundGradientFrom: "#eff3ff",
                  backgroundGradientTo: "#efefef",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                accessor="population"
                backgroundColor="#E8F9FD"
                paddingLeft="15"
                absolute //for the absolute number remove if you want percentage
              />
            </ScrollView>
            {/* card1 end */}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default History
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
