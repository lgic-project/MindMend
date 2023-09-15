import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native"
import React, { useEffect, useState } from "react"
import { AntDesign } from "@expo/vector-icons"
import styles from "../../style/doctorstyles"
import StarRating from "react-native-star-rating-widget"
import { useRouter } from "expo-router"
import { DOCTOR_BY_ID, DOCTOR_CATEGORY } from "../../utils/appRoutes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Buffer } from "buffer"

const SeeMoreText = ({ initialNumberOfLines, content }) => {
  const [showFullText, setShowFullText] = useState(false)

  const toggleShowFullText = () => {
    setShowFullText(!showFullText)
  }

  return (
    <TouchableOpacity onPress={toggleShowFullText}>
      <Text numberOfLines={showFullText ? undefined : initialNumberOfLines}>
        {content}
      </Text>
      {!showFullText && (
        <Text style={{ fontWeight: "500", color: "blue" }}>See More</Text>
      )}
    </TouchableOpacity>
  )
}

const doctorpage = () => {
  const [rating, setRating] = useState(null)
  const router = useRouter()
  const [doctorData, setDoctorData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])

  useEffect(() => {
    const GetDoctorDetail = async () => {
      const id = await AsyncStorage.getItem("doctorId")

      const userData = JSON.parse(await AsyncStorage.getItem("userData"))
      const headers = {
        Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
      }
      try {
        const res = await axios.get(DOCTOR_BY_ID + "/" + id, { headers })
        setDoctorData(res.data)
        setRating(res.data.rating)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    GetDoctorDetail()
  }, [])

  const renderDoctorCard = (value) => {
    if (value === "" || value === undefined) {
      return (
        <ImageBackground
          source={require("../../assets/Images/doc1.png")}
          resizeMode="stretch"
          style={{ width: "70%", height: "100%", marginLeft: 50 }}
        />
      )
    } else {
      const decodedString = convertBase64ToString(value)
      return (
        <ImageBackground
          source={{ uri: decodedString }}
          resizeMode="stretch"
          style={{ width: "100%", height: "100%", marginLeft: 50 }}
        />
      )
    }
  }

  const handleback = () => {
    router.back();
  }

  return (
    <View style={styles.container}>
      <View key={doctorData.id}>
        <View style={styles.smallcontainer}>
          {/* heading container */}
          <TouchableOpacity
            style={{ position: "absolute", top: 15, left: 15 }}
            onPress={handleback}
          >
            <AntDesign name="left" size={18} color="black" />
          </TouchableOpacity>
          {renderDoctorCard(doctorData.encodedImage)}
        </View>
        {/* large container */}
        <View style={styles.largecontainer}>
          <View style={styles.titlesection}>
            <View style={styles.titlefirst}>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                {doctorData.doctorName}
              </Text>
              <StarRating rating={rating} onChange={setRating} starSize={20} />
            </View>
            <View style={styles.titlesecond}>
              <Text style={styles.textspecial}>
                {doctorData.doctorCategoryName}
              </Text>
            </View>
          </View>
          {/* large section */}
          <View style={styles.underlarge}>
            <View style={styles.aboutsection}>
              <Text style={{ fontSize: 15, fontWeight: "700" }}>About</Text>
              <ScrollView>
                <SeeMoreText
                  initialNumberOfLines={3}
                  content={doctorData.description}
                />
              </ScrollView>
            </View>
            <View style={{ display: "flex", gap: 5 }}>
              <Text style={{ fontSize: 15, fontWeight: "700" }}>
                Working Hours
              </Text>
              <Text>
                {doctorData.workingDay}: {doctorData.workingHours} hours
              </Text>
            </View>
            {doctorData.city &&
              doctorData.country ? (
                <View style={{ display: "flex", gap: 5 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700" }}>
                    Address
                  </Text>
                  <Text>
                  {doctorData.street}, {doctorData.city}, {doctorData.state}, {doctorData.country}
                  </Text>
                </View>
              ): (
                <View style={{ display: "flex", gap: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: "700" }}>
                  Address
                </Text>
                </View>
              )}
            <View style={styles.boxcontainer}>
              <TouchableOpacity style={styles.box}>
                <Text>{doctorData.experience}</Text>
                <Text>Experience</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box}>
                <Text>{doctorData.rating}</Text>
                <Text>Avg Rating</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.absolutebutton}>
              <View style={styles.centerbtn}>
                <TouchableOpacity style={styles.btn}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "500",
                      color: "white",
                    }}
                  >
                    Make an Appointment
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </View>
      </View>
    </View>
  )
}

export default doctorpage

function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
