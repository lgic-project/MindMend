import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import React, { useState, useEffect } from "react"
import styles from "../../style/homestyles"
import { useRouter } from "expo-router"
import axios from "axios"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PROFILE } from "../../utils/appRoutes"

export default Profile = () => {
  const router = useRouter()
  const [profileData, setProfileData] = useState([])
  const currentDate = new Date()
  const myDate = currentDate.getHours().toString().padStart(2, "0")
  const [image, setImage] = useState("")
  const [decodeImage, setDecodeImage] = useState("")

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])

  const handleprofile = async () => {
    await AsyncStorage.setItem("profileName", JSON.stringify(name))
    await AsyncStorage.setItem("profileAddress", JSON.stringify(address))

    router.push(`profile`)
  }

  const GetProfileData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"))

    const headers = {
      Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
    }
    const id = userData.id
    try {
      const res = await axios.get(PROFILE + "4", { headers })
      setName(res.data.firstName)
      setAddress(res.data.city)
      setImage(res.data.encodedImage)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  useEffect(() => {
    GetProfileData()
  }, [])

  const renderProfile = () => {
    if (image === "" || image === undefined) {
      return (
        <Image
          source={require("../../assets/Images/myprofile.png")}
          resizeMode="contain"
          style={{ width: 45, height: 45, borderRadius: 50 }}
        />
      )
    } else {
      const decodedString = convertBase64ToString(image)
      return (
        <Image
          source={{ uri: decodedString }}
          resizeMode="contain"
          style={{ width: 45, height: 45, borderRadius: 50 }}
        />
      )
    }
  }

  const renderGreet = () => {
    if (myDate < 12) {
      return (
        <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
          How are you this morning?
        </Text>
      )
    } else if (myDate >= 12 && myDate <= 17) {
      return (
        <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
          How are you this afternoon?
        </Text>
      )
    } else {
      return (
        <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
          How are you this evening?
        </Text>
      )
    }
  }

  return (
    <View style={[styles.smallcontainer, { position: "relative" }]}>
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
            <Text style={{ fontSize: 22, color: "white" }}>Hi {name}</Text>
            {renderGreet()}
          </View>
          <TouchableOpacity onPress={handleprofile}>
            {renderProfile()}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
