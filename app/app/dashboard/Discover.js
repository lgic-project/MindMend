import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import styles from '../../style/discoverstyles';

const Discover = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headsection} >
        <Text style={styles.headingtext}>Discover</Text>
      </View>
      <ScrollView style={styles.scrollview}>
        {/* card container */}
        <View style={styles.cardcontainer}>
          {/* card1 */}
          <View style={styles.cardmain}>
            <View style={styles.card}>
              <Image source={require('../../assets/Images/gym.png')} style={[styles.img, styles.imgodd]} />
              <View style={styles.blankview}>
              </View>
              {/* text container */}
              <View style={styles.textcontainer} >
                <Text style={[styles.title,styles.title1]}>Health and fitness Stats</Text>
                <Text style={styles.description}>Track your sleep, exercise, weight and more</Text>
                <TouchableOpacity style={[styles.buttonodd,styles.button1]}>
                  <Text style={{ color:"white", fontSize:15 }}>See details</Text>
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
              <View style={styles.textcontainer} >
                <Text style={[styles.title, styles.title2]}>Guided Programs</Text>
                <Text style={styles.description}>Hit your goal with structured plan</Text>
                <TouchableOpacity style={[styles.buttoneven,styles.button2]}>
                  <Text style={{ color:"white", fontSize:15 }}>See details</Text>
                  <AntDesign name="arrowright" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Image source={require('../../assets/Images/typo.png')} style={[styles.img, styles.imgeven]} />
              <View style={styles.blankview}>
              </View>
            </View>
          </View>
          {/* card2 end */}
          {/* card3 */}
          <View style={styles.cardmain}>
            <View style={styles.card}>
              <Image source={require('../../assets/Images/para.jpg')} style={[styles.img, styles.imgodd]} />
              <View style={styles.blankview}>
              </View>
              {/* text container */}
              <View style={styles.textcontainer3} >
                <Text style={styles.title3}>Challenges and Adventures</Text>
                <Text style={styles.description}>Get motivated by competing with friends
                </Text>
                <TouchableOpacity style={[styles.buttonodd,styles.button3]}>
                  <Text style={{ color:"white", fontSize:15 }}>See details</Text>
                  <AntDesign name="arrowright" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* card3 end */}
          {/* card4 */}
          <View style={styles.cardmain}>
            <View style={styles.card}>
              {/* text container */}
              <View style={styles.textcontainer} >
                <Text style={[styles.title, styles.title4]}>Workout</Text>
                <Text style={styles.description}>Workout more often to stay healthy</Text>
                <TouchableOpacity style={[styles.buttoneven,styles.button4]}>
                  <Text style={{ color:"white", fontSize:15 }}>See details</Text>
                  <AntDesign name="arrowright" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Image source={require('../../assets/Images/workout.jpg')} style={[styles.img, styles.imgeven]} />
              <View style={styles.blankview}>
              </View>
            </View>
          </View>
          {/* card4 end */}



        </View>
      </ScrollView>
    </View>
  )
}

export default Discover