import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
} from "react-native"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import React, { useState } from "react"
import styles from "../style/loginstyle"
import { AntDesign } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LOGIN } from "../utils/appRoutes"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// State interface
const State = {
  password: "",
  username: "",
  showPassword: false,
}

const FirstRoute = () => {
  const router = useRouter()

  const initialValues = {
    username: "",
    password: "",
  }
  const [username, setUsername] = useState("sapnaBaniya")
  const [password, setPassword] = useState("Admin@123")

  const handleLogin = async (event) => {
    initialValues.username = username
    initialValues.password = password

    try {
      const res = await axios.post(LOGIN, {
        ...initialValues,
      })
      await AsyncStorage.setItem("userData", JSON.stringify(res.data))
      router.push(`./dashboard/Home`)
    } catch (error) {
      console.log("Error:", error)
      // Handle the error here (e.g., display an error message to the user)
    }
    // window.location.reload()
  }

  return (
    <View style={styles.firstroute}>
      <View style={styles.ipcontainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          name="username"
          id="username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder="Password"
          name="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity>
          <Text style={{ textAlign: "center" }}>Forgot your Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.arrowmain} onPress={handleLogin}>
        {/* <Link href='./dashboard/Home'> */}
        <TouchableOpacity style={styles.arrowcontainer} onPress={handleLogin}>
          <AntDesign name="arrowright" size={30} color="black" />
        </TouchableOpacity>
        {/* </Link> */}
      </View>
    </View>
  )
}

const SecondRoute = () => {
  const router = useRouter()

  return (
    <View style={styles.secondroute}>
      <View style={styles.ipcontainer}>
        <TextInput style={styles.input} placeholder="First name" />
        <TextInput style={styles.input} placeholder="Last name" />
        <TextInput style={styles.input} placeholder="Email" />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder="Password"
        />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder="Confirm Password"
        />
        <Text style={{ textAlign: "center" }}>
          By Creating an account, you agree to accept our Terms and Conditions
        </Text>
      </View>
      <View style={styles.arrowmain}>
        <TouchableOpacity style={styles.arrowcontainer}>
          <AntDesign name="arrowright" size={40} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
})

const Login = () => {
  const [index, setIndex] = React.useState(0)
  const layout = useWindowDimensions()

  const [routes] = React.useState([
    { key: "first", title: "Sign in" },
    { key: "second", title: "Sign up" },
  ])

  const handleSignuptext = () => {
    setIndex(1)
  }

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Text style={styles.welcometext}>Welcome Back</Text>
        <Text style={styles.text}>Sign in to continue</Text>
        <View style={styles.signin}>
          <TabView
            style={{ borderRadius: 25 }}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={{ backgroundColor: "white" }}
                labelStyle={{
                  color: "#FACE51",
                  fontWeight: "500",
                  textTransform: "none",
                }}
              />
            )}
          />
        </View>
      </View>
      <View style={styles.signup}>
        <Text style={styles.text2}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignuptext}>
          <Text style={styles.signuptext}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login
