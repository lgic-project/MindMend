import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  FlatList,
} from "react-native"
import React, { useEffect, useState } from "react"
import styles from "../../style/profilestyle"
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { Buffer } from "buffer"
import { PROFILE } from "../../utils/appRoutes"

const profilepage = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const [profileData, setProfileData] = useState([])
  const [image, setImage] = useState([])
  const [firstName, setFirstName] = useState([])
  const [lastName, setLastName] = useState([])
  const [address, setAddress] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const data = [
    {
      title: "Personal",
      icon: <Ionicons name="person" size={20} color="#98E8B1" />,
    },
    {
      title: "Badges and Trophies",
      icon: <MaterialCommunityIcons name="trophy" size={20} color="#E89898" />,
    },
    {
      title: "Groups",
      icon: <MaterialIcons name="group" size={20} color="#8793E8" />,
    },
    {
      title: "Guided Programs",
      icon: <MaterialIcons name="group" size={20} color="yellow" />,
    },
  ]

  const handleback = () => {
    navigation.goBack()
  }

  const GetProfile = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"))

    const headers = {
      Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
    }
    const id = userData.id
    try {
      const res = await axios.get(PROFILE + userData.id, { headers })
      setProfileData(res.data)
      setName(res.data.firstName + " " + res.data.lastName)
      setAddress(res.data.city)
      setImage(res.data.encodedImage)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  useEffect(() => {
    const GetProfileData = async () => {
      setFirstName(JSON.parse(await AsyncStorage.getItem("profileName")))
      setAddress(JSON.parse(await AsyncStorage.getItem("profileAddress")))
    }
    GetProfileData()
    GetProfile()
  }, [])

  const renderBackGroundImage = (imageurl) => {
    if (imageurl === "" || imageurl === undefined) {
      return (
        <ImageBackground
          source={require("../../assets/Images/person.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          blurRadius={3}
        >
          <View style={styles.bgcontainer}>
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={handleback}
            >
              <AntDesign name="left" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )
    } else {
      const decodedString = convertBase64ToString(imageurl)
      return (
        <ImageBackground
          source={{ uri: decodedString }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          blurRadius={3}
        >
          <View style={styles.bgcontainer}>
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={handleback}
            >
              <AntDesign name="left" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )
    }
  }

  const renderImage = (imageurl) => {
    if (imageurl === "" || imageurl === undefined) {
      return (
        <Image
          source={require("../../assets/Images/person.png")}
          resizeMode="contain"
          style={{ width: 80, height: 80, borderRadius: 50 }}
        />
      )
    } else {
      const decodedString = convertBase64ToString(imageurl)
      return (
        <Image
          source={{ uri: decodedString }}
          resizeMode="contain"
          style={{ width: 80, height: 80, borderRadius: 50 }}
        />
      )
    }
  }

  const handleRoute = async (item) => {
    if (item === "Groups") {
      await AsyncStorage.setItem("groupScreen", JSON.stringify(2))
      navigation.navigate("Community")
    }
    if (item === "Personal") {
      navigation.navigate("editprofile")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        {renderBackGroundImage(profileData.encodedImage)}
      </View>
      {/* Profile info container section */}
      <View style={styles.largecontainer}>
        <View style={styles.profileinfo}>
          {renderImage(profileData.encodedImage)}

          <View style={styles.profiletext}>
            <Text style={styles.name}>
              {profileData.firstName} {profileData.lastName}
            </Text>
            <View style={styles.location}>
              <Entypo name="location-pin" size={20} color="#634BF9" />
              <Text>{address}, Nepal</Text>
            </View>
          </View>
        </View>
        {/* ScrollView */}
        <ScrollView style={styles.scrollview}>
          <View style={styles.card} className="px-3">
            {/* Content */}

            {/* flatlist */}
            <FlatList
              scrollEnabled={false}
              // add it when there comes virtualized list error
              data={data}
              renderItem={({ item }) => (
                <View key={item.title}>
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => handleRoute(item.title)}
                  >
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                    >
                      {item.icon}
                      <Text style={{ fontSize: 16 }}>{item.title}</Text>
                    </View>
                    <AntDesign name="right" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {/* end */}

            {/* </TouchableOpacity> */}
          </View>
          <View style={styles.card}></View>
        </ScrollView>
        {/* </ScrollView> */}
      </View>
    </View>
  )
}

export default profilepage
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
