import { View, Text, TextInput, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import styles from '../../style/inboxstyle'
import { AntDesign } from '@expo/vector-icons';
import InboxCard from '../../components/Inbox/InboxCard';
const Inbox = () => {
  return (
    <View style={styles.container} >

      <View style={styles.smallcontainer}>
        {/* heading container */}
        <View style={styles.titlecontainer}>
          <Text style={styles.titletext}>
            Message
            </Text>
          </View>
      </View>
      <View style={styles.largecontainer}>
          {/* Search Container */}
        <View style={styles.searchcontainer}>
        <TextInput placeholder='Search' style={styles.search} />
        <View style={styles.imagecontainer}>
          <Image source={require('../../assets/Images/bot.png')} resizeMode='contain' style={styles.image} />
        </View>
        </View>
        {/* Chat Card */}
        <View>
        <InboxCard/>
        </View>
      </View>
    </View>
  )
}

export default Inbox