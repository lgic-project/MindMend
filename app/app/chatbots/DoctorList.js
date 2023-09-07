import styles from "../../style/chatbotstyles"
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  ScrollView,
  Text,
} from "react-native"
import { Buffer } from "buffer"

import React, { useState } from "react"
import {
  TextInput,
  Button,
  Divider,
  VStack,
  Wrap,
} from "@react-native-material/core"
// import { ScrollView } from "react-native-gesture-handler"

export default DoctorList = ({ response }) => {
  const renderDoctorCard = (value) => {
    const decodedString = convertBase64ToString(value.encodedImage)
    // Use the decoded string in your JSX code
    return (
      <ImageBackground
        style={{ flex: 1 }}
        imageStyle={{ borderRadius: 10 }}
        source={{ uri: decodedString }}
        resizeMode="cover"
      >
        <Text style={styles.doc1text}>{value.doctorName}</Text>
      </ImageBackground>
    )
  }
  return (
    <View style={styles.doccontainer}>
      <Text style={{ fontSize: 16 }}>Doctors List</Text>

      {/* <View style={styles.doccard}> */}

      <View style={[styles.doccard, { width: "100%" }]}>
        <ScrollView horizontal contentContainerStyle={{ alignItems: "center" }}>
          {response.map((column, index) => (
            <TouchableOpacity key={index} style={[styles.doc1view, { width: 200 }]}>
              {renderDoctorCard(column)}
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
