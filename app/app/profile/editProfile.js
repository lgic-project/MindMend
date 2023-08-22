import { Avatar, ListItem, Wrap } from "@react-native-material/core"
import React,{useEffect, useMemo, useState} from "react"

import { Text, View, Image, ScrollView, FlatList, StyleSheet, TouchableOpacity } from "react-native"

import { AntDesign } from "@expo/vector-icons"

import { Button } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TextInput, RadioButton } from "react-native-paper"
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios'


const editProfile = () => {
  const [value, setValue] = useState(null);
  const [countryValue, setCountryValue] = useState([]);
  const [stateValue, setStateValue] = useState([]);
  const [cityValue, setCityValue] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

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

useEffect(() => {
    GetCountryData();
  }, []);

  return (
    <View className="w-full h-full bg-white">
      <View className=" bg-yellow-300 h-2/6 p-5 pt-14">
        <Wrap justify="between">
          <AntDesign name="back" size={24} color="black" />
          <Text className="center pl-9 font-bold text-lg">Edit Profile</Text>
          <Button className="text-lg text-white">Save</Button>
        </Wrap>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Image
            source={require("../../assets/Images/person.png")}
            resizeMode="contain"
            style={{
              width: 110,
              height: 110,
              borderRadius: 80,
            }}
          />
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
        </View>
      </View>
      <View className="grid-rows-3  ">
        <ScrollView className="p-6 gap-5 " style={{height:'80%'}}>
          <View>
        <TextInput
          className="bg-white "
          label="Username"
          value="Sapna"
          underlineColor="#dcdcdc"
        />
        </View>
        <View>
        <TextInput
          className="bg-white"
          label="Email"
          value="sapna@gmail.com"
          underlineColor="#dcdcdc"
        />
        </View>
        <View>
        <TextInput
          className="bg-white"
          label="First Name"
          value="Sapna"
          underlineColor="#dcdcdc"
        />
        </View>
        <View>
        <TextInput
          className="bg-white"
          label="Last Name"
          value="Baniya"
          underlineColor="#dcdcdc"
        />
        </View>
        <View>
        <Wrap justify="start" style={{borderBottomColor:"#dcdcdc", borderBottomWidth:1}} >
        <Text className="pt-3">Gender:</Text>
        <RadioButton.Group  value="first">
          <Wrap justify="start">
      <RadioButton.Item label="Male" value="first" />
      <RadioButton.Item label="Female" value="second" />
      </Wrap>
    </RadioButton.Group>
        </Wrap>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap:14 }}>

        {/* <SelectDropdown dropdownStyle={{height:300, width:'80%'}} buttonStyle={{width:'90%'}} 
  data={allData}
  onSelect={(selectedItem, index) => {
    handleSelect(selectedItem,index+1);
  }}
 defaultButtonText="Select a Country .."
  buttonTextAfterSelection={(selectedItem, index) => {
    // text represented after item is selected
    // if data array is an array of objects then return selectedItem.property to render after item is selected
    return selectedItem
  }}
  rowTextForSelection={(item, index) => {
    // text represented for each item in dropdown
    // if data array is an array of objects then return item.property to represent item in dropdown
    return item
  }}
/>

<SelectDropdown dropdownStyle={{height:300, width:'80%'}} disabled buttonStyle={{width:'90%'}} 
  data={allData}
  onSelect={(selectedItem, index) => {
    console.log(selectedItem, index+1)
  }}
 defaultButtonText="Select a State .."
  buttonTextAfterSelection={(selectedItem, index) => {
    // text represented after item is selected
    // if data array is an array of objects then return selectedItem.property to render after item is selected
    return selectedItem
  }}
  rowTextForSelection={(item, index) => {
    // text represented for each item in dropdown
    // if data array is an array of objects then return item.property to represent item in dropdown
    return item
  }}
/>

<SelectDropdown dropdownStyle={{height:300, width:'80%'}} buttonStyle={{width:'90%'}} disabled
  data={allData}
  onSelect={(selectedItem, index) => {
    console.log(selectedItem, index+1)
  }}
 defaultButtonText="Select a City .."
  buttonTextAfterSelection={(selectedItem, index) => {
    // text represented after item is selected
    // if data array is an array of objects then return selectedItem.property to render after item is selected
    return selectedItem
  }}
  rowTextForSelection={(item, index) => {
    // text represented for each item in dropdown
    // if data array is an array of objects then return item.property to represent item in dropdown
    return item
  }}
/> */}
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
          value={country}
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
          value={state}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setState(item.value);
            handleCity(country,item.value);
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
          value={city}
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
        onChangeText={text => onChangeText(text)}
        value=''
        style={{padding: 10}}
      />
      </View>
         </ScrollView>
      </View>
    </View>
  )
}
export default editProfile


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
