import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native"
import React from "react"
import { AntDesign } from "@expo/vector-icons"
import styles from "../../style/discoverstyles"
import { useRouter } from "expo-router"

const Discover = () => {
  const router = useRouter()
  const handleWorkout = () => {
    router.push(`workout/WorkoutList`)
  }

  const handleDoctor = () => {
    router.push(`doctor/doctorList`)
  }

  const handleHistory = () => {
    router.push(`chart`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.smallcontainer}>
        {/* heading container */}
        <View style={styles.titlecontainer}>
          <Text style={styles.titletext}>Discover</Text>
        </View>
      </View>
      <View style={styles.largecontainer}>
        <ScrollView>
          {/* card container */}
          <View style={styles.cardcontainer}>
            {/* card1 */}
            <View style={styles.cardmain}>
              <View style={styles.card}>
                <Image
                  source={require("../../assets/Images/gym.png")}
                  style={[styles.img, styles.imgodd]}
                />
                <View style={styles.blankview}></View>
                {/* text container */}
                <View style={styles.textcontainer}>
                  <Text style={[styles.title, styles.title1]}>
                    Health and fitness Stats
                  </Text>
                  <Text style={styles.description}>
                    Look for best exercise, weight loss and more
                  </Text>
                  <TouchableOpacity
                    style={[styles.buttonodd, styles.button1]}
                    onPress={handleWorkout}
                  >
                    <Text style={{ color: "white", fontSize: 15 }}>
                      See details
                    </Text>
                    <AntDesign name="arrowright" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* card1 end */}

            {/* card2 */}
            <View style={styles.cardmain}>
              <View style={styles.card}>
                {/* text container */}
                <View style={styles.textcontainer}>
                  <Text style={[styles.title, styles.title2]}>
                    Health Care and Doctor
                  </Text>
                  <Text style={styles.description}>
                    Know the best doctors near you
                  </Text>
                  <TouchableOpacity
                    style={[styles.buttoneven, styles.button2]}
                    onPress={handleDoctor}
                  >
                    <Text style={{ color: "white", fontSize: 15 }}>
                      See details
                    </Text>
                    <AntDesign name="arrowright" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Image
                  source={require("../../assets/Images/what-is-healthcare-707998.webp")}
                  style={[styles.img, styles.imgeven]}
                />
                <View style={styles.blankview}></View>
              </View>
            </View>
            {/* card2 end */}
            {/* card3 */}
            <View style={styles.cardmain}>
              <View style={styles.card}>
                <Image
                  source={require("../../assets/Images/istockphoto-1319849784-612x612.jpg")}
                  style={[styles.img, styles.imgodd]}
                />
                <View style={styles.blankview}></View>
                {/* text container */}
                <View style={styles.textcontainer3}>
                  <Text style={styles.title3}>History</Text>
                  <Text style={styles.description}>
                    Retrieve Your Progress and interaction to our app
                  </Text>
                  <TouchableOpacity
                    style={[styles.buttonodd, styles.button3]}
                    onPress={handleHistory}
                  >
                    <Text style={{ color: "white", fontSize: 15 }}>
                      See details
                    </Text>
                    <AntDesign name="arrowright" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* card3 end */}
            {/* card4 */}

            {/* card4 end */}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default Discover
