import axios from "axios"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native"
import CircularProgress from "react-native-circular-progress-indicator"

import React, { useState, useEffect } from "react"
import styles from "../../style/homestyles"
import { useRouter } from "expo-router"

export default FitnessChart = () => {
  return (
    <View style={styles.fitnesscontainer}>
      <View style={styles.fitnesscard}>
        <Text
          style={{
            paddingLeft: 10,
            paddingTop: 2,
            fontWeight: "500",
            fontSize: 16,
          }}
        >
          Walk
        </Text>
        <View style={{ flex: 1, alignItems: "center" }}>
          <CircularProgress
            value={7500}
            maxValue={20000}
            radius={40}
            duration={2000}
            progressValueColor={"gray"}
            activeStrokeColor={"#F07B7B"}
            inActiveStrokeColor={"#F0D7D7"}
            title={"Steps"}
            titleColor={"black"}
            titleStyle={{ fontWeight: "bold" }}
          />
        </View>
      </View>
      <View style={styles.fitnesscard}></View>
    </View>
  )
}
