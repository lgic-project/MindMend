import React, { useEffect, useRef } from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Tabs } from "expo-router"
import { moderateScale, verticalScale } from "react-native-size-matters"
import * as Animatable from "react-native-animatable"
import Icon, { Icons } from "../../components/Shared/Icon"
import styles from "../../style/dblayoutstyle"
const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  0.92: { translateY: -34 },
  1: { scale: 1.2, translateY: -24 },
}
const animate2 = {
  0: { scale: 1.2, translateY: -24 },
  1: { scale: 1, translateY: 7 },
}

const circle1 = {
  0: { scale: 0 },
  0.3: { scale: 0.2 },
  0.5: { scale: 0.5 },
  0.8: { scale: 0.7 },
  1: { scale: 1 },
}
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }

const TabButton = (props) => {
  const { label, onPress, accessibilityState, icon } = props
  const focused = accessibilityState.selected
  const viewRef = useRef(null)
  const circleRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1)
      circleRef.current.animate(circle1)
      textRef.current.transitionTo({ scale: 1 })
    } else {
      viewRef.current.animate(animate2)
      circleRef.current.animate(circle2)
      textRef.current.transitionTo({ scale: 0 })
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Animatable.View ref={viewRef} duration={300} style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View
            ref={circleRef}
            duration={300}
            style={styles.circle}
          />
          <Icon
            type={icon.type}
            name={icon.icon}
            color={focused ? "white" : "#FACE51"}
          />
        </View>
        <Animatable.Text ref={textRef} style={styles.text}>
          {label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  )
}
const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        title: "",
        tabBarStyle: {
          width: "100%",
          padding: moderateScale(8),
          height: verticalScale(60),
          shadowOpacity: 0,
          backgroundColor: "white",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon={{ type: Icons.AntDesign, icon: "home" }}
              label="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Discover"
        options={{
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon={{ type: Icons.Ionicons, icon: "compass-outline" }}
              label="Discover"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Community"
        options={{
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon={{ type: Icons.Ionicons, icon: "ios-person-add-outline" }}
              label="Community"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Inbox"
        options={{
          tabBarButton: (props) => (
            <TabButton
              {...props}
              icon={{ type: Icons.AntDesign, icon: "message1" }}
              label="Inbox"
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default Layout
