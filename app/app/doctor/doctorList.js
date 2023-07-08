import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import styles from "../../style/discoverstyles"
import { VStack, Flex, Wrap } from "@react-native-material/core"
import axios from "axios"
import { Buffer } from "buffer"
import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DOCTOR, DOCTOR_RATING } from "../../utils/appRoutes"
import { useRouter } from "expo-router"

const DoctorList = () => {
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
          <Text style={styles.titletext}>Doctor</Text>
        </View>
      </View>
      <View style={styles.largecontainer}>
        <ScrollView>
          {/* card container */}
          <View style={styles.cardcontainer}>
            {/* card1 */}
            {doctorData.map((column, index) => (
              <View key={column.id} style={styles.doctorcardmain}>
                <View key={column.id} style={styles.doctorcard}>
                  {renderDoctorCard(column.encodedImage)}

                  <View style={styles.blankview}></View>
                  {/* text container */}
                  <View style={styles.textcontainer}>
                    <VStack m={4} spacing={15}>
                      <Flex>
                        <Text style={[styles.title, styles.title1]}>
                          {column.doctorName}
                        </Text>
                        <Text style={[styles.subHeading, styles.subHeading1]}>
                          {column.doctorCategoryName}
                        </Text>
                      </Flex>
                      <Wrap m={4} spacing={2}>
                        <AntDesign name="staro" size={18} color="black" />
                        <AntDesign name="staro" size={18} color="black" />
                        <AntDesign name="staro" size={18} color="black" />
                        <AntDesign name="staro" size={18} color="black" />
                        <AntDesign name="staro" size={18} color="black" />
                        <Text
                          variant="caption"
                          font="bold"
                          style={{ paddingLeft: 5, fontWeight: 600 }}
                        >
                          {column.rating}
                        </Text>
                      </Wrap>
                    </VStack>
                    <TouchableOpacity
                      onPress={() => handleDoctorDetail(column.id)}
                      style={[styles.buttonodd, styles.button1]}
                    >
                      <Text style={{ color: "white", fontSize: 15 }}>
                        See details
                      </Text>
                      <AntDesign name="arrowright" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            {/* card1 end */}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default DoctorList
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
