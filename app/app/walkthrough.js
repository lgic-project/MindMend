import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import Onboarding from 'react-native-onboarding-swiper';
// npm i react-native-onboarding-swiper for implementing walkthrough screen
const Walkthrough = () => {
    const router = useRouter();
    const Skip = ({...props}) => (
        <TouchableOpacity
        {...props}
        >
        <Text style={{fontSize:16, marginHorizontal:20, color:"white"}}>Skip</Text>
        </TouchableOpacity>
    );
    const Next = ({...props}) => (
        <TouchableOpacity
        {...props}
        >
        <Text style={{fontSize:16, marginHorizontal:20, color:"white"}}>Next</Text>
        </TouchableOpacity>
    )

  return (
    <View 
    style={{flex:1}}
    >
      <Onboarding
      NextButtonComponent={Next}
      SkipButtonComponent={Skip}
      // pushing to login page after skip or done button is clicked
      onSkip={() => router.push(`login`)}
      onDone={() => router.push(`login`)}
    pages={[
        // array of multiple walkthrough screens
    {
    backgroundColor: '#FCD66C',
    image: <View style={{paddingTop:100}}>
        <Image source={require('../assets/Images/walk1.png')} />
    </View>,
    title: '',
    subtitle: '',
    },
    {
    backgroundColor: '#FCD66C',
    image: <View style={{paddingTop:200,}}>
        <Image source={require('../assets/Images/walk3.png')} />
    </View>,
    title: '',
    subtitle: '',
    },
    {
    backgroundColor: '#FCD66C',
    image: <View style={{paddingTop:200, }}>
        <Image source={require('../assets/Images/walk2.png')} />
    </View>,
    title: '',
    subtitle: '',
    },
    ]}
/>
    </View>
  )
}

export default Walkthrough;