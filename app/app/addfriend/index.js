
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
import style1 from "../../style/userprofilestyle"

import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons"
import { TabBar, TabView } from "react-native-tab-view"
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PROFILE } from "../../utils/appRoutes"
import axios from "axios"

const friendDetail = () => {
    const navigation = useNavigation();
    const [profile, setProfile] =useState([]);
    const handleback = () => {
      navigation.goBack();
    }

    useEffect(()=>{
        getFriendDetail=async ()=>{
            const id = await AsyncStorage.getItem("friendId")
            const userData = JSON.parse(await AsyncStorage.getItem("userData"))

            const headers = {
              Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
            }
            try {
              const res = await axios.get(PROFILE  + id , {
                headers,
              })
              setProfile(res.data);
      
            } catch (error) {
              console.log(error)
            }

        }
        getFriendDetail();
    },[])

    const renderFriendImage = (value) => {
        if (value === "" || value === undefined) {
          return (
            <Image source={require('../../assets/Images/person.png')} resizeMode='contain' style={style1.image} />

          )
        } else {
          const decodedString = convertBase64ToString(value)
          return  <Image source={{uri: decodedString}} resizeMode='contain' style={style1.image} />

        }
    }
    return (
    <View style={styles.container}>
    <View style={styles.firstmain}>
      <View style={styles.firstview}>
      <View style={styles.heading}>
        <TouchableOpacity onPress={handleback}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-xl">{profile.firstName} {profile.lastName}</Text>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color="white" />
        </TouchableOpacity>
      </View>   
         </View>
      
    </View>
    <View style={style1.headcontainer}>
        <View style={style1.imagecontainer}>
           {renderFriendImage(profile.encodedImage)}   
     </View>
        <View style={style1.textcontainer}>
          <Text style={style1.username}>{profile.username}</Text>
          <Text style={style1.headingtext}>{profile.description}
          </Text>
        </View>
      </View>
      {/* Add Message section */}
      <View style={style1.addsection}>
        <View style={style1.add} >
          <Ionicons name="person" size={24} color="white" />
          <Text style={style1.addtext}>Friends</Text>
        </View>
        <View style={style1.messenger}>
          {/* <FontAwesome5 name="facebook-messenger" size={30} color="#B9B7B5" /> */}
          <AntDesign name="message1" size={30} color="#B9B7B5" />
        </View>
        <View style={style1.downbutton}>
          <AntDesign name="caretdown" size={24} color="#B9B7B5" />
        </View>
      </View>
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.pagescrollcontainer}>
      <View style={styles.pagecontainer}>
        {/* news feed */}
        <View style={styles.newsfeed}>
          {/* <View style={styles.feedheading}>
            <View style={styles.imgtxt}>
              <TouchableOpacity >
                <Image
                  source={require("../../assets/Images/person.png")}
                  style={{ width: 30, height: 30, borderRadius: 50 }}
                />
              </TouchableOpacity>
              <TouchableOpacity >
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
          </View> */}
          
          <Text className="text-lg text-slate-400 text-center pt-12">No Post Available</Text>
        </View>
      </View>
    </ScrollView>
    </View>
  </View>
    )
}

export default friendDetail
function convertBase64ToString(base64) {
    const bytes = Buffer.from(base64, "base64")
    const decodedString = bytes.toString("utf8")
    return decodedString
  }