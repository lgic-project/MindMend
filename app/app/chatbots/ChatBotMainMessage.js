import styles from "../../style/chatbotstyles"
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Text,
} from "react-native"
import React, { useState } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"

import {
  TextInput,
  Button,
  Divider,
  VStack,
  Wrap,
} from "@react-native-material/core"
export default ChatBotMessage = ({ response }) => {
  return (
    <View style={styles.chatbotmain}>
      <Text
        variant="h5"
        style={{
          fontWeight: "600",
          paddingVertical: 5,
          textAlign: "center",
        }}
      >
        Suggestions for you
      </Text>
      <View style={styles.divider} />
      <VStack m={4} spacing={2}>
        {response.map((column, index) => (
          <Text style={styles.suggestionsText}>
            <MaterialCommunityIcons
              name="arrow-right-bold-circle"
              size={18}
              color="black"
            />{" "}
            {column}
          </Text>
        ))}
      </VStack>
    </View>
  )
}
