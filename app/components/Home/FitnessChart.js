import axios from "axios"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native"
import CircularProgress from "react-native-circular-progress-indicator"
import { Wrap, Button, Spacer } from "@react-native-material/core"
import { Text } from "react-native-paper"

import React, { useState, useEffect } from "react"
import styles from "../../style/homestyles"
import { useRouter } from "expo-router"
import { LineChart, PieChart } from "react-native-chart-kit"

export default FitnessChart = () => {
  router = useRouter()
  const handleHistory = () => {
    router.push(`chart`)
  }
  return (
    <View>
      <Wrap style={{ marginTop: 9, marginBottom: -9, marginLeft: 7 }}>
        <Text className=" font-semibold mt-5 ml-7 text-base">
          Progress Chart
        </Text>
        <Spacer />
        <Button
          style={{ marginRight: 13, marginBottom: 2 }}
          onPress={handleHistory}
          variant="text"
          title="View All"
        />
      </Wrap>

      <View style={styles.fitnesscontainer}>
        <View style={styles.fitnesscard}>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 2,
              fontWeight: "500",
              fontSize: 13,
            }}
          >
            User Interaction
          </Text>
          <View style={{ flex: 1, alignItems: "center" }}>
            <LineChart
              data={{
                labels: ["January", "February", "March", "April"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={Dimensions.get("window").width - 250} // from react-native
              height={70}
              yAxisLabel={""}
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 20,
              }}
            />
          </View>
        </View>
        <View style={styles.fitnesscard}>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 2,
              fontWeight: "500",
              fontSize: 13,
            }}
          >
            Mood Track
          </Text>
          <View style={{ flex: 1, alignItems: "center" }}>
            <PieChart
              data={[
                {
                  name: "Happy",
                  population: 10,
                  color: "rgba(131, 167, 234, 1)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10,
                },
                {
                  name: "Normal",
                  population: 120,
                  color: "#F00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10,
                },

                {
                  name: "Sad",
                  population: 10,
                  color: "rgb(0, 0, 255)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10,
                },
              ]}
              width={Dimensions.get("window").width - 220}
              height={70}
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 20,
                },
              }}
              style={{
                marginRight: 15,
                borderRadius: 16,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute //for the absolute number remove if you want percentage
            />
          </View>
        </View>
      </View>
    </View>
  )
}
