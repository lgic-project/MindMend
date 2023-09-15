import { Avatar, ListItem, Wrap } from "@react-native-material/core"
import React,{useEffect, useMemo, useState} from "react"
import * as ImagePicker from 'expo-image-picker';
import { Text, View, Image, ScrollView, FlatList, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { Buffer } from "buffer"
import { Button } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TextInput, RadioButton } from "react-native-paper"
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { PROFILE } from "../../utils/appRoutes"
import { useNavigation, useRouter } from "expo-router"


const editProfile = () => {
  const [value, setValue] = useState(null);
  const navigation = useNavigation()

  const [countryValue, setCountryValue] = useState([]);
  const [stateValue, setStateValue] = useState([]);
  const [cityValue, setCityValue] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [profile, setProfile]= useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [image, setImage]= useState(null);
  const [imageConfirmed, setImageConfirmed] = useState(false);


  const handleback = () => {
    navigation.goBack()
  }

  const GetCountryData = async () => {


var config = {
  method: 'get',
  url: 'https://api.countrystatecity.in/v1/countries',
  headers: {
    'X-CSCAPI-KEY': 'T0MyS2xvbmV2WmlTcVVRbU9Sc2F2bGxLZW9HdzR4SU00RjdMOHBMMA=='
  }
};

await axios(config)
.then(function (response) {
  var count = Object.keys(response.data).length;
  let countryArray =[];
  for (let i = 0; i < count; i++) {
    countryArray.push({
      value: response.data[i].iso2,
      label: response.data[i].name,
    })
    
  }
  setCountryValue(countryArray);
})
.catch(function (error) {
  console.log(error);
});
  } 

  const GetProfileData = async ()=>{
    const userData = JSON.parse(await AsyncStorage.getItem("userData"))
    const headers = {
      Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
    }
    try {
      const res = await axios.get(PROFILE+userData.id, { headers })
      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleState=async (countryCode)=>{
    var config = {
      method: 'get',
      url: `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
      headers: {
        'X-CSCAPI-KEY': 'T0MyS2xvbmV2WmlTcVVRbU9Sc2F2bGxLZW9HdzR4SU00RjdMOHBMMA=='
      }
    };
    
    await axios(config)
    .then(function (response) {
      var count = Object.keys(response.data).length;
  let stateArray =[];
  for (let i = 0; i < count; i++) {
    stateArray.push({
      value: response.data[i].iso2,
      label: response.data[i].name,
    })
    
  }
  setStateValue(stateArray);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const handleCity=async (countryCode,state)=>{
    console.log(countryCode)
    console.log(state)
    var config = {
      method: 'get',
      url: `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${state}/cities`,
      headers: {
        'X-CSCAPI-KEY': 'T0MyS2xvbmV2WmlTcVVRbU9Sc2F2bGxLZW9HdzR4SU00RjdMOHBMMA=='
      }
    };
    
    await axios(config)
    .then(function (response) {
      console.log(response.data)
      var count = Object.keys(response.data).length;
  let cityArray =[];
  for (let i = 0; i < count; i++) {
    cityArray.push({
      value: response.data[i].id,
      label: response.data[i].name,
    })
    
  }
  setCityValue(cityArray);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });


  }

  const handleDescription = (text) => {
    setProfile({ ...profile, description: text });
  };

  const handleFirstName = (text) => {
    setProfile({ ...profile, firstName: text });
  };

  const handleUsername = (text) => {
    setProfile({ ...profile, username: text });
  };

  const handleLastName = (text) => {
    setProfile({ ...profile, lastName: text });
  };

  const handleEmail = (text) => {
    setProfile({ ...profile, email: text });
  };

  const handleGender = (value) => {
    setProfile({ ...profile, gender: value });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      const selectedImageBase64 = await convertImageToBase64(selectedImageUri);
  
      setImage(selectedImageUri);
      setImageConfirmed(selectedImageBase64); // Reset image confirmation when a new image is selected

    }
  };

  
  const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };


  const permission=async ()=>{
    if (Platform.OS !== 'web') {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission Denied');
      }
    }
  }

useEffect(() => {
  permission();
  GetProfileData();
    GetCountryData();
  }, []);

  const renderImage = (imageurl) => {
    if (imageurl === "" || imageurl === undefined) {
      return (
        <Image
        source={require("../../assets/Images/person.png")}
        resizeMode="cover"
        style={{
          width: 110,
          height: 110,
          borderRadius: 80,
        }}
      />
      )
    } else {
      const decodedString = convertBase64ToString(imageurl)
      return (
        <Image
        source={{uri: decodedString}}
        resizeMode="cover"
        style={{
          width: 110,
          height: 110,
          borderRadius: 80,
        }}
      />
      )
    }
  }

  const handleSubmit =async ()=>{
    const userData = JSON.parse(await AsyncStorage.getItem("userData"))
    const headers = {
      Authorization: `Bearer ${userData.token}`, // Include the token in the Authorization header
    }

    profile.image = imageConfirmed;
    try {
      const res = await axios.patch(PROFILE+profile.profileId +"/profile",{
        ...profile,
      }, { headers })
      if (res.data) {
        Alert.alert("Success", "Your Profile has been updated")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className="w-full h-full bg-white">
      <View className=" bg-yellow-300 h-2/6 p-5 pt-14">
        <Wrap justify="between">
          <AntDesign name="back" size={24} color="white" onPress={handleback} />
          <Text className="center pl-9 font-bold text-lg text-white">Edit Profile</Text>
          <Button className="text-lg text-white" onPress={handleSubmit}>Save</Button>
        </Wrap>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
           {image ? (
             <Image
             source={{uri: image}}
             resizeMode="cover"
             style={{
               width: 110,
               height: 110,
               borderRadius: 80,
             }}
             />
        ) : (
          renderImage(profile.image)
        )}
          {/* {image && <Image source={{uri: image}} />} */}
          {/* <TouchableOpacity onPress={pickImage}>
         
          <TouchableOpacity onPress={pickImage}>
          <Avatar
            icon={
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={18}
                color="black"
              />
            }
            style={{
              position: "relative",
              backgroundColor: "white",
              width: 35,
              height: 35,
              left: 25,
              bottom: 22,
            }}
         />
            </TouchableOpacity>
        
            </TouchableOpacity> */}
           
        </View>
      </View>
      <View className="grid-rows-3  ">
        <ScrollView className="p-6 gap-5 " style={{height:'80%'}}>
          <View>
        <TextInput
          className="bg-white "
          label="Username"
          name="username"
          value={profile.username}
          underlineColor="#dcdcdc"
          onChangeText={handleUsername}
        />
        </View>
        <View>
        <TextInput
          className="bg-white"
          label="Email"
          name="email"
          value={profile.email}
          underlineColor="#dcdcdc"
          onChangeText={handleEmail}
        />
        </View>
        <View>
        <TextInput
          className="bg-white"
          label="First Name"
          name="firstName"
          value={profile.firstName}
          underlineColor="#dcdcdc"
          onChangeText={handleFirstName}
        />
        </View>
        <View>
        <TextInput
          className="bg-white"
          label="Last Name"
          name="lastName"
          value={profile.lastName}
          underlineColor="#dcdcdc"
          onChangeText={handleLastName}
        />
        </View>
        <View>
        <Wrap justify="start" style={{borderBottomColor:"#dcdcdc", borderBottomWidth:1}} >
        <Text className="pt-3">Gender:</Text>
        <RadioButton.Group  value={profile.gender} onValueChange={(value) => handleGender(value)} name="gender">
          <Wrap justify="start">
      <RadioButton.Item label="Male" value="male" />
      <RadioButton.Item label="Female" value="female" />
      </Wrap>
    </RadioButton.Group>
        </Wrap>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap:14 }}>

   
<Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }, {width:'100%'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={countryValue}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Country' : '...'}
          searchPlaceholder="Search..."
          value={profile.country}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCountry(item.value);
            handleState(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />

<Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }, {width:'100%'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={stateValue}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select State' : '...'}
          searchPlaceholder="Search..."
          value={profile.state}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setState(item.value);
            handleCity(profile.country,item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />

<Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }, {width:'100%'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={cityValue}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select City' : '...'}
          searchPlaceholder="Search..."
          value={profile.city}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCity(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />


        </View>
        <View className="mb-36">
        <TextInput 
        editable
        multiline
        numberOfLines={3}
        placeholder="Write about yourself ..."
        maxLength={40}
        onChangeText={ handleDescription}
        value={profile.description}
        style={{padding: 10}}
      />
      </View>
         </ScrollView>
      </View>
    </View>
  )
}
export default editProfile

function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

});
