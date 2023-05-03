import React from 'react'
import { Tabs } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { moderateScale, verticalScale } from 'react-native-size-matters'
import { Ionicons } from '@expo/vector-icons';

const Layout = () => {
  return (
    <Tabs screenOptions={{
        headerShown:false ,
        title:"",
        
        tabBarStyle:{
            width:"100%",
            padding:moderateScale(8),
            height:verticalScale(60),
            shadowOpacity:0,         
        },
        tabBarActiveTintColor:"#FACE51",
        tabBarInactiveTintColor:"gray"
        
        
        
    }}>
        <Tabs.Screen name="Home"
        options={{
          tabBarIcon:({color})=> <AntDesign name="home" size={28} color={color} />,
         
          
          
      }}
        />
      <Tabs.Screen
        name="Discover"
        options={{
          tabBarIcon:({color})=><Ionicons name="compass-outline" size={35} color={color} />
          
        }}
      />
      <Tabs.Screen
        name="Community"
        options={{
          tabBarIcon:({color})=><Ionicons name="ios-person-add-outline" size={28} color={color} />
        
        }}
      />
      <Tabs.Screen
        name="Inbox"
        options={{
          tabBarIcon:({color})=><AntDesign name="message1" size={28} color={color}/>
            
        }}
      />
    </Tabs>
  )
}

export default Layout