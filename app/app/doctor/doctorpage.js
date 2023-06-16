import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import styles from '../../style/doctorstyles';
import StarRating from 'react-native-star-rating-widget';
import { useRouter } from 'expo-router';
import { DOCTOR_CATEGORY } from '../../utils/appRoutes';
const SeeMoreText = ({ initialNumberOfLines, content }) => {
    const [showFullText, setShowFullText] = useState(false);

    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
    };

    return (
        <TouchableOpacity onPress={toggleShowFullText}>
            <Text numberOfLines={showFullText ? undefined : initialNumberOfLines}>
                {content}
            </Text>
            {!showFullText && <Text style={{ fontWeight: "500", color: "blue" }}>See More</Text>}
        </TouchableOpacity>
    );
};

const doctorpage = () => {
    const [rating, setRating] = useState(5);
    const router = useRouter();
    const handleback = () =>{
        router.push(`../dashboard/Home`)
    }
    return (

        <View style={styles.container} >

            <View style={styles.smallcontainer}>
                {/* heading container */}
                <TouchableOpacity style={{ position: "absolute", top: 15, left: 15 }} onPress={handleback} >
                    <AntDesign name="left" size={18} color="black" />
                </TouchableOpacity>
                <ImageBackground source={require('../../assets/Images/doc.png')} resizeMode='cover' style={{ width: "70%", height: "100%", marginLeft: 50 }} />
            </View>
            {/* large container */}
            <View style={styles.largecontainer}>
                <View style={styles.titlesection}>
                    <View style={styles.titlefirst}>
                        <Text style={{ fontSize: 20, fontWeight: "700" }}>Dr. Lorem ipsum</Text>
                        <StarRating
                            rating={rating}
                            onChange={setRating}
                            starSize={20}
                        />
                    </View>
                    <View style={styles.titlesecond}>
                        <Text style={styles.textspecial}>Lorem ipsum specialist</Text>
                        <Text style={styles.textspecial}>See all reviews</Text>
                    </View>
                </View>
                {/* large section */}
                <View style={styles.underlarge}>
                    <View style={styles.aboutsection}>
                        <Text style={{ fontSize: 15, fontWeight: "700" }}>About</Text>
                        <ScrollView>
                            <SeeMoreText
                                initialNumberOfLines={3}
                                content="Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Sed vitae
                                ligula vel justo malesuada dapibus.
                                Integer nec efficitur nulla. Suspendisse potenti.
                                Donec at bibendum risus. Sed consectetur tristique
                                tortor, in interdum ligula feugiat at."
                            />
                        </ScrollView>
                    </View>
                    <View style={{ display: "flex", gap: 5 }}>
                        <Text style={{ fontSize: 15, fontWeight: "700" }}>Working Hours</Text>
                        <Text>Monday-Friday: 09:00 AM - 05:00 PM</Text>
                    </View>
                    <View style={styles.boxcontainer}>
                        <TouchableOpacity style={styles.box}>
                            <Text>10K</Text>
                            <Text>Patients</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.box}>
                            <Text>5 Years</Text>
                            <Text>Experience</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.box}>
                            <Text>5.0</Text>
                            <Text>Avg Rating</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.absolutebutton}>
                        <View style={styles.centerbtn}>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={{ fontSize: 20, fontWeight: "500", color: "white" }}>Make an Appointment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default doctorpage