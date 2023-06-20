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
import { DOCTOR, MOOD_CATEGORY } from "../../utils/appRoutes"
import axios from "axios"
import { Buffer } from "buffer"
import Carousel, { CarouselProps } from "react-native-snap-carousel"

const Home = () => {
  const [moodData, setMoodData] = useState([])
  const [doctorData, setDoctorData] = useState([])

  const [selectedItem, setSelectedItem] = useState(null)
  // const [showView, setShowView] = useState(true);
  const router = useRouter()
  const handleprofile = () => {
    router.push(`profile`)
  }
  const handledoc = () => {
    router.push(`doctor`)
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      axios.get(MOOD_CATEGORY).then((res) => {
        setMoodData(res.data)

        // setData = res.data
      })
    } catch (error) {
      console.log(error)
    }

    try {
      axios.get(DOCTOR).then((res) => {
        setDoctorData(res.data)

        // setData = res.data
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

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

  const renderDoctorCard = ({ item }) => {
    return (
      <TouchableOpacity style={styles.doc1view} onPress={handledoc}>
        {item.encodedImage == "" ? (
          <ImageBackground
            source={require("../../assets/Images/person.jpeg")}
            style={{ flex: 1 }}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="cover"
            blurRadius={1}
          >
            <Text style={styles.doc1text}>{item.doctorName}</Text>
            {/* {renderData(column.encodedImage)} */}
          </ImageBackground>
        ) : (
          <ImageBackground
            source={{
              uri: convertBase64ToString(item.encodedImage),
            }}
            style={{ flex: 1 }}
            imageStyle={{ borderRadius: 10 }}
            resizeMode="cover"
            blurRadius={1}
          >
            <Text style={styles.doc1text}>{item.doctorName}</Text>
            {/* {renderData(column.encodedImage)} */}
          </ImageBackground>
        )}
      </TouchableOpacity>
    )
  }

  const handlePress = (id) => {
    setSelectedItem(id === selectedItem ? null : id)
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
        {/* )} */}
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
                <Text style={styles.lookingtext}>General</Text>
                <Text style={styles.lookingtext}>Check-Up</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lookingcard}>
              <Image
                source={require("../../assets/Images/chat.png")}
                resizeMode="contain"
                style={styles.lookingimage}
              />
              <View style={styles.lTcontainer}>
                <Text style={styles.lookingtext}>Chat with</Text>
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
          <View style={styles.doccard}>
            <Carousel
              data={doctorData}
              renderItem={renderDoctorCard}
              sliderWidth={400} // Adjust the width of the carousel
              itemWidth={300} // Adjust the width of each card
              containerCustomStyle={styles.carousel}
              contentContainerCustomStyle={styles.carouselContentContainer}
              slideStyle={styles.slide}
            />
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
