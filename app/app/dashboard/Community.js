import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native"
import React,{useEffect, useMemo, useState} from "react"
import styles from "../../style/communitystyles"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { FRIEND, PROFILE } from "../../utils/appRoutes"
import { Buffer } from "buffer"


const FirstRoute = () => {
  const router = useRouter()
  const handleprofile = () => {
    router.push(`userprofile`)
  }
  return (
    <ScrollView style={styles.pagescrollcontainer}>
      <View style={styles.pagecontainer}>
        {/* news feed */}
        <View style={styles.newsfeed}>
          <View style={styles.feedheading}>
            <View style={styles.imgtxt}>
              <TouchableOpacity onPress={handleprofile}>
                <Image
                  source={require("../../assets/Images/person.png")}
                  style={{ width: 30, height: 30, borderRadius: 50 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleprofile}>
                <Text style={{ alignSelf: "center", fontSize: 16 }}>
                  Simran Baniya
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 13 }}>Help Needed</Text>
          </View>
          <View style={{ width: "100%", height: "60%" }}>
            <Image
              source={require("../../assets/Images/gym.png")}
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={styles.iconcontainer}>
            <TouchableOpacity style={styles.icon}>
              <AntDesign name="like2" size={24} color="#FACE51" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <FontAwesome name="comment-o" size={24} color="#FACE51" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <FontAwesome name="share" size={24} color="#FACE51" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const SecondRoute = () => {
  const router = useRouter()
  const [friends, setFriends] = useState([]);
  const handleprofile = async (id) => {
    await AsyncStorage.setItem("friendId", JSON.stringify(id))

    router.push(`addfriend`)
  }

  const renderImage = (imageurl) => {
    if (imageurl === "" || imageurl === undefined || imageurl ===null) {
      return (
        <Image
                source={require("../../assets/Images/person.png")}
                style={styles.frndimg}
              />
      )
    } else {
      const decodedString = convertBase64ToString(imageurl)
      return (
        <Image
                source={{uri: decodedString}}
                style={styles.frndimg}
              />
      )
    }
  }

  const getFriendList =async ()=>{
    const userData = JSON.parse(await AsyncStorage.getItem("userData"))
    const headers = {
      Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
    }
    try {


      const res = await axios.get(FRIEND+userData.id+"/user", { headers })
      setFriends(res.data);
    } catch (error) {
      console.log(error);
    }
  }
useEffect(()=>{
  getFriendList();
})

  return (
    <ScrollView style={styles.scrollfriend}>
      <View>
      {friends.map((column, index) => (

        <TouchableOpacity key={index} style={styles.friend} onPress={()=>handleprofile(column.friendId)}>
          <View style={styles.imgtext}>
            <TouchableOpacity>
           { renderImage(column.friendImage)}

            </TouchableOpacity>
            <Text style={{ alignSelf: "center" }}>{column.friendName}</Text>
          </View>
          <AntDesign name="right" size={20} color="#FACE51" />
        </TouchableOpacity>
      ))}
      </View>
    </ScrollView>
  )
}

const ThirdRoute = () => (
  <ScrollView style={styles.Scrollgroup}>
    <Text style={styles.groupheading}>Open Groups</Text>
    <TouchableOpacity style={styles.group}>
      <View style={styles.block}>
        <Image
          source={require("../../assets/Images/gym.png")}
          style={styles.groupimg}
        />
        <View style={styles.groupinfo}>
          <Text style={styles.infoheading}>Gym Group</Text>
          <View style={styles.groupdetails}>
            <Ionicons name="people-sharp" size={20} color="gray" />
            <Text style={styles.member}>832k members</Text>
          </View>
        </View>
      </View>
      <AntDesign name="right" size={20} color="#FACE51" />
    </TouchableOpacity>
    <Text style={styles.groupheading1}>Joined Groups</Text>
    <TouchableOpacity style={styles.group}>
      <View style={styles.block}>
        <Image
          source={require("../../assets/Images/gym.png")}
          style={styles.groupimg}
        />
        <View style={styles.groupinfo}>
          <Text style={styles.infoheading}>Gym Group</Text>
          <View style={styles.groupdetails}>
            <Ionicons name="people-sharp" size={20} color="gray" />
            <Text style={styles.member}>832k members</Text>
          </View>
        </View>
      </View>
      <AntDesign name="right" size={20} color="#FACE51" />
    </TouchableOpacity>
  </ScrollView>
)

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
})

function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}

const Community = () => {
  const layout = useWindowDimensions()
  const navigation = useNavigation()

  const handleback = () => {
    navigation.goBack()
  }
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "first", title: "Feed" },
    { key: "second", title: "Friends" },
    { key: "third", title: "Groups" },
  ])

  React.useEffect(() => {
    const GetScreenId = async () => {
      if (JSON.parse(await AsyncStorage.getItem("groupScreen"))) {
        setIndex(JSON.parse(await AsyncStorage.getItem("groupScreen")))
        await AsyncStorage.removeItem("groupScreen")
      }
    }
    GetScreenId()
  })

  const handleprofile = () => {
    router.push(`userprofile`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.firstmain}>
        <View style={styles.firstview}>
          <Text style={styles.groups}>Community</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <TabView
          style={{ marginTop: -20 }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <View style={styles.tabmain}>
              <TabBar
                {...props}
                style={styles.tabbar}
                labelStyle={{ color: "gray", fontWeight: "500", fontSize: 13 }}
                indicatorStyle={{ height: 0 }}
                activeColor="#FACE51"
              />
              <TouchableOpacity style={styles.add} onPress={handleprofile}>
                <Ionicons name="person-add" size={25} color="#FACE51" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  )
}

export default Community
