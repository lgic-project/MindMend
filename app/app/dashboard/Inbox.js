import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"
import React, { useLayoutEffect, useState } from "react"
import styles from "../../style/inboxstyle"
import { AntDesign } from "@expo/vector-icons"
import InboxCard from "../../components/Inbox/InboxCard"
import Chat from "../../components/Message/Chat"

const Inbox = () => {
  return (
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        {/* heading container */}
        <View style={styles.titlecontainer}>
          <Text style={styles.titletext}>Message</Text>
        </View>
      </View>
      <View style={styles.largecontainer}>
        {/* Search Container */}
        <View style={styles.searchcontainer}>
          <TextInput placeholder="Search" style={styles.search} />
          <TouchableOpacity style={styles.imagecontainer}>
            <AntDesign name="search1" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* Chat Card */}
        <View>
          <InboxCard />
        </View>
      </View>
    </View>
  )
}

export default Inbox
