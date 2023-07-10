import styles from "../../style/discoverstyles"
import { Avatar, Card, Text } from "react-native-paper"
import { View, ScrollView, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import axios from "axios"
import { Buffer } from "buffer"
import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

const WorkoutDetail = () => {
  const handleback = () => {
    router.push(`../workout/WorkoutList`)
  }
  return (
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        {/* heading container */}
        <TouchableOpacity
          style={{ position: "absolute", top: 15, left: 15 }}
          onPress={handleback}
        >
          <AntDesign name="left" size={18} color="black" />
        </TouchableOpacity>
        <View style={styles.titlecontainer}>
          <Text style={styles.titletext}>Exercise Detail</Text>
        </View>
      </View>
      <View style={styles.largecontainer}>
        <View className="px-3 py-5">
          <Card className="pb-3 ">
            <Card.Cover
              className="h-64"
              source={{ uri: "https://picsum.photos/700" }}
            />
            {/* <Card.Content className="p-2 px-6">
              <Text className="font-bold text-lg">Fat burn</Text>
              <Text className=" text-sm">10 minute</Text>
            </Card.Content>
            <Card.Actions className="-mt-12">
              <Text className="border text-sm font-bold border-slate-500 p-1 px-2 rounded-full text-white bg-slate-500">
                100 Calcs
              </Text>
            </Card.Actions> */}
            {/* <View>

            </View> */}
          </Card>
        </View>
      </View>
    </View>
  )
}

export default WorkoutDetail
