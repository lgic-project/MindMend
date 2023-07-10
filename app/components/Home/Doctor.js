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
import { DOCTOR_RATING } from "../../utils/appRoutes"

export default Doctor = () => {
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

  const handleDoctor = () => {
    router.push(`doctor/doctorList`)
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
    <View style={styles.doccontainer}>
      <Text style={{ fontSize: 16 }}>Top Rated Doctors</Text>

      {/* <View style={styles.doccard}> */}
      <View style={styles.doccard}>
        {slicedData.map((column, index) => (
          <TouchableOpacity
            key={column.id}
            style={styles.doc1view}
            onPress={() => handleDoctorDetail(column.id)}
          >
            {renderDoctorCard(column)}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
