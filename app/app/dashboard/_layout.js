import React, { useEffect, useRef } from 'react'
import {TouchableOpacity,View,StyleSheet} from 'react-native'
import { Tabs } from 'expo-router'
import { moderateScale, verticalScale } from 'react-native-size-matters'
import * as Animatable from 'react-native-animatable';
import Icon, { Icons } from '../../components/Shared/Icon';

const animate1 = { 0: { scale: .5, translateY: 7 }, .92: { translateY: -34 }, 1: { scale: 1.2, translateY: -24 } }
const animate2 = { 0: { scale: 1.2, translateY: -24 }, 1: { scale: 1, translateY: 7 } }

const circle1 = { 0: { scale: 0 }, 0.3: { scale: .2 }, 0.5: { scale: .5 }, 0.8: { scale: .7 }, 1: { scale: 1 } }
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }

const TabButton = (props) => {
  const { label, onPress, accessibilityState,icon } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={300}
        style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View
            ref={circleRef}
            duration={300}
            style={styles.circle} />
          <Icon type={icon.type} name={icon.icon} color={focused ? "white" : "#FACE51"} />
        </View>
        <Animatable.Text
          ref={textRef}
          style={styles.text}>
          {label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  )
}
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
            backgroundColor:"white"      
        },
    }}>
        <Tabs.Screen name="Home"
        options={{
          tabBarButton:(props)=><TabButton {...props} icon={{type:Icons.AntDesign,icon:"home"}} label="Home"/>
      }}
        />
      <Tabs.Screen
        name="Discover"
        options={{
          tabBarButton:(props)=><TabButton {...props} icon={{type:Icons.Ionicons,icon:"compass-outline"}} label="Discover"/>
          
        }}
      />
      <Tabs.Screen
        name="Community"
        options={{
          tabBarButton:(props)=><TabButton {...props} icon={{type:Icons.Ionicons,icon:"ios-person-add-outline"}} label="Community"/>
        
        }}
      />
      <Tabs.Screen
        name="Inbox"
        options={{
          tabBarButton:(props)=><TabButton {...props} icon={{type:Icons.AntDesign,icon:"message1"}} label="Inbox"/>
            
        }}
      />
    </Tabs>
  )
}

export default Layout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    // elevation:1
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FACE51",
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    color: "#FACE51",
  }
})