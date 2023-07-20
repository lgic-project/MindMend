import { View, Text, Image, TouchableOpacity, FlatList, ImageBackground, ScrollView, } from "react-native"
import React, { useState, useEffect } from "react"
import styles from "../../style/homestyles"
import { useRouter } from "expo-router"
import CircularProgress from "react-native-circular-progress-indicator"
import { DOCTOR, MOOD_CATEGORY } from "../../utils/appRoutes"
import axios from "axios"
import { Buffer } from "buffer"
const Home = () => {

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
    setSelectedItem(id === selectedItem ? null : id);
  };
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const GetMoodData = async () => {
      try {
        const res = await axios.get(MOOD_CATEGORY);
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    };
    GetMoodData();
  }, []);

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
          {data.map((meta, index) => (
            <View style={styles.emojibutton} key={index} >
              <TouchableOpacity style={[styles.emojiview,
              meta.id === selectedItem && styles.selected
              ]} onPress={() => handlePress(meta.id)}>
                <Image source={{ uri: `data:image/png;base64,${meta.logo}` }} convertBase64ToString={true} resizeMode="contain" style={{ width: "85%", height: '85%' }} />
                <Text style={[styles.notselected, data.id === selectedItem && styles.selectedtext]}>{meta.name}</Text>
              </TouchableOpacity>
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
          {/* <View style={styles.doccard}> */}
          {/* <Carousel
              data={doctorData}
              renderItem={renderDoctorCard}
              sliderWidth={400} // Adjust the width of the carousel
              itemWidth={300} // Adjust the width of each card
              containerCustomStyle={styles.carousel}
              contentContainerCustomStyle={styles.carouselContentContainer}
              slideStyle={styles.slide}
            /> */}
          {/* </View> */}
          <View style={styles.doccard}>
            <View style={styles.doc1view} >
              <ImageBackground style={{ flex: 1 }} imageStyle={{ borderRadius: 10 }} source={require('../../assets/Images/bubbley.jpg')} resizeMode="cover" >
                <Text style={styles.doc1text} >Dr. Rachita Shrestha</Text>
                <Image source={require('../../assets/Images/doc.png')} style={styles.doc1img} />
              </ImageBackground>
            </View>
            <View style={styles.doc2view}>
              <ImageBackground style={{ flex: 1 }} imageStyle={{ borderRadius: 10 }} source={require('../../assets/Images/bubblay.jpg')} resizeMode="cover" >
                <Text style={styles.doc2text}>Dr. Rachit Shrestha</Text>
                <Image source={require('../../assets/Images/doc1.png')} style={styles.doc2img} />
              </ImageBackground>
            </View>
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
