import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native"
import * as React from "react"
import styles from "../../style/communitystyles"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
  const handleprofile = () => {
    router.push(`userprofile`)
  }
  return (
    <ScrollView style={styles.scrollfriend}>
      <View>
        <TouchableOpacity style={styles.friend} onPress={handleprofile}>
          <View style={styles.imgtext}>
            <TouchableOpacity>
              <Image
                source={require("../../assets/Images/person.png")}
                style={styles.frndimg}
              />
            </TouchableOpacity>
            <Text style={{ alignSelf: "center" }}>Simran Baniya</Text>
          </View>
          <AntDesign name="right" size={20} color="#FACE51" />
        </TouchableOpacity>
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

const Community = () => {
  const layout = useWindowDimensions()
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
              <TouchableOpacity style={styles.add}>
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
