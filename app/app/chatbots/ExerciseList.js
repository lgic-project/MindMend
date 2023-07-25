import styles from "../../style/chatbotstyles"
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  ScrollView,
  Text,
} from "react-native"
import React, { useState } from "react"
import {
  TextInput,
  Button,
  Divider,
  VStack,
  Wrap,
} from "@react-native-material/core"
import { Buffer } from "buffer"

export default ExerciseList = ({ response }) => {
  const renderExerciseCard = (value) => {
    if (value.encodedImage === "" || value.encodedImage === undefined) {
      return (
        <ImageBackground
          style={{ flex: 1 }}
          imageStyle={{ borderRadius: 10 }}
          source={require("../../assets/Images/shutterstock-163579436-yoga-alexander-y-1485955962.jpg")}
          resizeMode="cover"
        >
          <Text style={styles.doc1text}>{value.title}</Text>
        </ImageBackground>
      )
    }
    const decodedString = convertBase64ToString(value.encodedImage)
    // Use the decoded string in your JSX code
    return (
      <ImageBackground
        style={{ flex: 1 }}
        imageStyle={{ borderRadius: 10 }}
        source={{ uri: decodedString }}
        resizeMode="cover"
      >
        <Text style={styles.doc1text}>{value.title}</Text>
      </ImageBackground>
    )
  }

  return (
    <View style={styles.excontainer}>
      <Text style={{ fontSize: 16 }}>Exercise List</Text>

      {/* <View style={styles.doccard}> */}

      <View style={[styles.excard, { width: "100%" }]}>
        <ScrollView horizontal contentContainerStyle={{ alignItems: "center" }}>
          {response.map((column, index) => (
            <TouchableOpacity style={[styles.doc1view, { width: 200 }]}>
              {renderExerciseCard(column)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
function convertBase64ToString(base64) {
  const bytes = Buffer.from(base64, "base64")
  const decodedString = bytes.toString("utf8")
  return decodedString
}
