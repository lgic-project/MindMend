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
import CircularProgress from "react-native-circular-progress-indicator"
import { DOCTOR, DOCTOR_RATING, MOOD_CATEGORY } from "../../utils/appRoutes"
import axios from "axios"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Wrap, Button, Spacer } from "@react-native-material/core"

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const router = useRouter()
  const handleprofile = () => {
    router.push(`profile`)
  }
  const handledoc = () => {
    router.push(`doctor`)
  }

  const renderData = (value) => {
    // Call the convertBase64ToString function
    const decodedString = convertBase64ToString(value)
    // Use the decoded string in your JSX code
    return (
      <Image
        source={{ uri: decodedString }}
        resizeMode="contain"
        style={{ width: "85%", height: "85%" }}
      />
    )
  }

  const handlePress = (id) => {
    setSelectedItem(id === selectedItem ? null : id)
  }
  const [data, setData] = useState([])
  const [moodData, setMoodData] = useState([])
  const [doctorData, setDoctorData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const slicedData = doctorData.slice(0, 2) // Extract the first 5 data items

  useEffect(() => {
    const GetMoodData = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"))

      const headers = {
        Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
      }
      try {
        const res = await axios.get(MOOD_CATEGORY, { headers })
        setMoodData(res.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    GetMoodData()

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
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        <View
          style={{
            backgroundColor: "#face51",
            flex: 1,
            borderBottomStartRadius: 45,
            borderBottomEndRadius: 45,
          }}
        >
          <View style={styles.heading}>
            <View>
              <Text style={{ fontSize: 22, color: "white" }}>Hi Mahima</Text>
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
                How are you this morning?
              </Text>
            </View>
            <TouchableOpacity onPress={handleprofile}>
              <Image
                source={require("../../assets/Images/myprofile.png")}
                resizeMode="contain"
                style={{ width: 45, height: 45, borderRadius: 50 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.largecontainer}>
        {/* Emoji Mood Section */}
        {/* {showView &&
      ( */}
        <View style={styles.moodcontainer}>
          {moodData.map((column, index) => (
            <View style={styles.emojibutton} key={column.id}>
              <TouchableOpacity
                style={[
                  styles.emojiview,
                  column.id === selectedItem && styles.selected,
                ]}
                onPress={() => handlePress(column.id)}
              >
                {renderData(column.encodedImage)}
              </TouchableOpacity>
              <Text
                style={[
                  styles.notselected,
                  column.id === selectedItem && styles.selectedtext,
                ]}
              >
                {column.name}
              </Text>
            </View>
          ))}
        </View>
        {/* fitness */}
        <View style={styles.fitnesscontainer}>
          <View style={styles.fitnesscard}>
            <Text
              style={{
                paddingLeft: 10,
                paddingTop: 2,
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              Walk
            </Text>
            <View style={{ flex: 1, alignItems: "center" }}>
              <CircularProgress
                value={7500}
                maxValue={20000}
                radius={40}
                duration={2000}
                progressValueColor={"gray"}
                activeStrokeColor={"#F07B7B"}
                inActiveStrokeColor={"#F0D7D7"}
                title={"Steps"}
                titleColor={"black"}
                titleStyle={{ fontWeight: "bold" }}
              />
            </View>
          </View>
          <View style={styles.fitnesscard}></View>
        </View>
        {/* Looking for section */}
        <View style={styles.lookingfor}>
          <Text style={{ fontSize: 16 }}>What are you looking for?</Text>
          <View style={styles.lookingcontainer}>
            <TouchableOpacity style={styles.lookingcard}>
              <Image
                source={require("../../assets/Images/medical-report.png")}
                resizeMode="contain"
                style={styles.lookingimage}
              />
              <View style={styles.lTcontainer}>
                <Text style={styles.lookingtext}>Share</Text>
                <Text style={styles.lookingtext}>Your Problem</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lookingcard} onPress={handleDoctor}>
              <Image
                source={require("../../assets/Images/chat.png")}
                resizeMode="contain"
                style={styles.lookingimage}
              />
              <View style={styles.lTcontainer}>
                <Text style={styles.lookingtext}>View All</Text>
                <Text style={styles.lookingtext}>Doctor</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lookingcard}>
              <Image
                source={require("../../assets/Images/newspaper.png")}
                resizeMode="contain"
                style={{ width: 40, height: 40 }}
              />
              <View style={styles.lTcontainer}>
                <Text style={styles.lookingtext}>Health</Text>
                <Text style={styles.lookingtext}>News</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Doctor Section */}
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
      </View>
    </View>
  )
}

export default Home

function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
