import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import React, { useEffect, useState } from "react"
import styles from "../style/loginstyle"
import { AntDesign } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LOGIN, REGISTER } from "../utils/appRoutes"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { auth, database } from "../utils/firebase"
import { collection, addDoc, setDoc, doc } from "firebase/firestore"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

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
      signInWithEmailAndPassword(auth, res.data.email, initialValues.password)
        .then(async (user) => {
          await AsyncStorage.setItem(
            "firebaseUserId",
            JSON.stringify(user.user.uid)
          )
        })
        .catch((err) => console.log(err))
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

  const initialValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    confirmPassword: "",
    roleName: "",
  }
  const [formValues, setFormValues] = useState(initialValues)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [index, setIndex] = React.useState(0)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const validate = (values) => {
    let errors = {}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    if (!values.email) {
      errors.email = "Email is required"
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format"
    }
    if (!values.password) {
      errors.password = "Password is required"
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters"
    }
    if (!values.firstName) {
      errors.firstName = "First Name is required"
    }
    if (!values.lastName) {
      errors.lastName = "Last Name is required"
    }
    if (!values.username) {
      errors.username = "Username is required"
    }
    if (values.password != values.confirmPassword) {
      errors.confirmPassword = "Confirm password doesnot match password"
    }
    return errors
  }

  const SignUpSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Firstname is too Short!")
      .max(50, " Firstname is too Long!")
      .required("Firstname is required"),

    lastName: Yup.string()
      .min(2, "Firstname is too Short!")
      .max(50, "Firstname is too Long!")
      .required("Lastname is required"),

    email: Yup.string().email().required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .min(4, "Password is too short - should be 4 chars minimum"),

    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .min(4, "Confirm Password is too short - should be 4 chars minimum")
      .oneOf([Yup.ref("password")], "Your passwords do not match."),
  })

  const handleRegister = async (values) => {
    setFormErrors(validate(values))
    setIsSubmitting(true)

    values.roleName = "user"

    try {
      const res = await axios.post(REGISTER, {
        ...values,
      })
      if (res) {
        ToastAndroid.show(res.data.message, ToastAndroid.LONG)

        let data = {
          name: values.firstName + " " + values.lastName,
          email: values.email,
          password: values.password,
          img: "https://www.pngwing.com/en/free-png-zlrqq",
        }
        console.log(data)
        try {
          createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          ).then(async (user) => {
            const collectionRef = collection(database, "users")
            await setDoc(doc(collectionRef), {
              name: data.name,
              email: data.email,
              uid: user.user.uid,
              password: data.password,
              img: data.img,
            })
          })
        } catch (err) {
          console.log("Firebase error:", err)
        }
        setIndex(1)
      }
    } catch (error) {
      console.log("Error:", error)
      // Handle the error here (e.g., display an error message to the user)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpSchema}
      onSubmit={(values) => {
        handleRegister(values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
        dirty,
      }) => {
        // const { errors, touched, isValid, dirty } = values
        return (
          <View style={styles.secondroute}>
            <View style={styles.ipcontainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                name="firstName"
                id="firstName"
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
                className={
                  errors.firstName && touched.firstName ? "input-error" : null
                }
              />
              {touched.firstName && errors.firstName && (
                <Text
                  style={{ fontSize: 12, color: "#FF0D10", marginLeft: 10 }}
                >
                  {errors.firstName}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Last name"
                name="lastName"
                id="lastName"
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
                className={
                  errors.lastName && touched.lastName ? "input-error" : null
                }
              />
              {touched.lastName && errors.lastName && (
                <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                  {errors.lastName}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="User Name"
                name="username"
                id="username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                className={
                  errors.username && touched.username ? "input-error" : null
                }
              />
              {touched.username && errors.username && (
                <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                  {errors.username}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email"
                name="email"
                id="email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                className={errors.email && touched.email ? "input-error" : null}
              />
              {touched.email && errors.email && (
                <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                  {errors.email}
                </Text>
              )}
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="Password"
                name="password"
                id="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                className={
                  errors.password && touched.password ? "input-error" : null
                }
              />
              {touched.password && errors.password && (
                <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                  {errors.password}
                </Text>
              )}

              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "input-error"
                    : null
                }
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                  {errors.confirmPassword}
                </Text>
              )}
              <Text style={{ textAlign: "center" }}>
                By Creating an account, you agree to accept our Terms and
                Conditions
              </Text>
            </View>
            <View style={styles.arrowmain}>
              <TouchableOpacity
                style={styles.arrowcontainer}
                onPress={handleSubmit}
                className={!(dirty && isValid) ? "disabled-btn" : ""}
                disabled={!(dirty && isValid)}
              >
                <AntDesign name="arrowright" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )
      }}
    </Formik>
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
