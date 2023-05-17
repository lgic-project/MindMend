import { View, Text, TouchableOpacity, ImageBackground, Image, ScrollView, } from 'react-native'
import React from 'react'
import styles from '../../style/profilestyle'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
const profilepage = () => {
    const data = [
        { title: "Personal", icon: <Ionicons name="person" size={20} color="#98E8B1" /> },
        { title: "Badges and Trophies", icon: <MaterialCommunityIcons name="trophy" size={20} color="#E89898" /> },
        { title: "Groups", icon: <MaterialIcons name="group" size={20} color="#8793E8" /> },
        { title: "Guided Programs", icon: <MaterialIcons name="group" size={20} color="yellow" /> },
    ]
    return (
        <View style={styles.container} >

            <View style={styles.smallcontainer}>
                {/* heading container */}
                <ImageBackground
                    source={require('../../assets/Images/myprofile.png')} style={{ width: "100%", height: "100%" }}
                    resizeMode='cover'
                    blurRadius={3}
                >
                    <View style={styles.bgcontainer}>
                        <TouchableOpacity style={styles.buttoncontainer}>
                            <AntDesign name="left" size={18} color="black" />
                        </TouchableOpacity>
                        <View style={styles.camcontainer}>
                            <Entypo name="camera" size={24} color="white" />
                        </View>
                    </View>
                </ImageBackground>
            </View>
            {/* Profile info container section */}
            <View style={styles.largecontainer}>
                <View style={styles.profileinfo}>
                    <Image source={require('../../assets/Images/myprofile.png')} resizeMode='contain' style={{ width: 80, height: 80, borderRadius: 50 }} />
                    <View style={styles.profilecam}>
                        <Entypo name="camera" size={15} color="white" />
                    </View>
                    <View style={styles.profiletext}>
                        <Text style={styles.name}>Mahima Poudel</Text>
                        <View style={styles.location}>
                            <Entypo name="location-pin" size={20} color="#634BF9" />
                            <Text>Pokhara, Nepal</Text>
                        </View>
                    </View>
                </View>
                {/* ScrollView */}
                <ScrollView style={styles.scrollview}>
                    
                    <View style={styles.card}>
                        {/* Content */}
                        
                        {/* flatlist */}
                        <FlatList
                        scrollEnabled={false}
                        // add it when there comes virtualized list error
                            data={data}
                            renderItem={({ item }) => (

                                <TouchableOpacity style={styles.row}>
                                    <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                        {item.icon}
                                        <Text style={{ fontSize: 16 }}>{item.title}</Text>
                                    </View>
                                    <AntDesign name="right" size={20} color="black" />
                                </TouchableOpacity>
                            )}

                        />
                        {/* end */}

                        {/* </TouchableOpacity> */}
                    </View>
                    <View style={styles.card}></View>
                    </ScrollView>
                {/* </ScrollView> */}
            </View>
        </View>
    )
}

export default profilepage