import { View, Text, Image, TouchableOpacity, FlatList, ImageBackground, ScrollView } from 'react-native'
import React,{useState, useEffect} from 'react'
import styles from '../../style/homestyles'
import { useRouter } from 'expo-router';
import CircularProgress from 'react-native-circular-progress-indicator';
const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  // const [showView, setShowView] = useState(true);
  const router = useRouter();
  const handleprofile = () => {
    router.push(`profile`)
  }
  const handledoc = ()=>{
    router.push(`doctor`)
  }
  // useEffect(() => {
  //   if (selectedItem) {
  //     setTimeout(() => {
  //       setShowView(false);
  //     }, 3000);
  //   }
  // }, [selectedItem]);
  const images = [
    { id: 1, title: "Very Good", src: require('../../assets/Images/verygood.png') },
    { id: 2, title: "Good", src: require('../../assets/Images/good.png') },
    { id: 3, title: "Neutral", src: require('../../assets/Images/neutral.png') },
    { id: 4, title: "Sad", src: require('../../assets/Images/sad.png') },
    { id: 5, title: "Very Sad", src: require('../../assets/Images/verysad.png') },
  ]
  const handlePress = (id) => {
    setSelectedItem(id === selectedItem ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View>
          <Text style={{ fontSize: 22, color: "gray" }}>Hi Mahima</Text>
          <Text style={{fontSize:18, fontWeight:"400"}}>How are you this morning?</Text>
        </View>
        <TouchableOpacity onPress={handleprofile}>
          <Image source={require('../../assets/Images/myprofile.png')} resizeMode='contain' style={{ width: 45, height: 45, borderRadius: 50 }} />
        </TouchableOpacity>
      </View>
      {/* Emoji Mood Section */}
      {/* {showView &&
      ( */}
      <View style={styles.moodcontainer}>
        {images.map(image => (
          <View style={styles.emojibutton} key={image.id} >
            <TouchableOpacity style={[styles.emojiview, image.id === selectedItem && styles.selected]} onPress={() => handlePress(image.id)}>
            <Image source={image.src} resizeMode="contain" style={{ width: "90%", height: '90%' }} />
            </TouchableOpacity>
            <Text style={[styles.notselected,image.id === selectedItem && styles.selectedtext]} >{image.title}</Text>
          </View>
        ))}
      </View>
       {/* )} */}
      {/* fitness */}
      <View style={styles.fitnesscontainer}>
        <View style={styles.fitnesscard}>
          <Text style={{paddingLeft:10, paddingTop:2, fontWeight:"500" ,fontSize:16}}>Walk</Text>
          <View style={{width:"100%", display:"flex",  alignItems:"center"}}>
            <CircularProgress
              value={7500}
              maxValue={20000}
              radius={45}
              duration={2000}
              progressValueColor={'gray'}
              activeStrokeColor={'#F07B7B'}
              inActiveStrokeColor={'#F0D7D7'}
              title={'Steps'}
              titleColor={'black'}
              titleStyle={{ fontWeight: 'bold' }}
            />
          </View>
        </View>
        <View style={styles.fitnesscard}></View>
      </View>
      {/* Looking for section */}
      <View style={styles.lookingfor}>
        <Text style={{ fontSize: 16 }}>What are you looking for?</Text>
        <View style={styles.lookingcontainer}>
          <View style={styles.lookingcard}>
            <Image source={require('../../assets/Images/medical-report.png')} resizeMode='contain' style={styles.lookingimage}/>
            <View style={styles.lTcontainer}>
            <Text style={styles.lookingtext}>General</Text>
            <Text style={styles.lookingtext}>Check-Up</Text>
            </View>
          </View>
          <View style={styles.lookingcard}>
            <Image source={require('../../assets/Images/chat.png')} resizeMode='contain' style={styles.lookingimage} />
            <View style={styles.lTcontainer}>
            <Text style={styles.lookingtext}>Chat with</Text>
            <Text style={styles.lookingtext}>Doctor</Text>
            </View>
          </View>
          <View style={styles.lookingcard}>
          <Image source={require('../../assets/Images/newspaper.png')} resizeMode='contain' style={{width:40, height:40}} />
            <View style={styles.lTcontainer}>
            <Text style={styles.lookingtext}>Health</Text>
            <Text style={styles.lookingtext}>News</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Doctor Section */}
      <View style={styles.doccontainer}>
        <Text style={{ fontSize: 16 }}>Top Rated Doctors</Text>
        <View style={styles.doccard}>
          <TouchableOpacity style={styles.doc1view} onPress={handledoc} >
            <ImageBackground source={require('../../assets/Images/bubbley.jpg')} style={{flex:1}} imageStyle={{borderRadius:10}} resizeMode='cover' blurRadius={3} >
            <Text style={styles.doc1text}>Dr. Lorem Ipsum</Text>
              <Image source={require('../../assets/Images/doc.png')} style={styles.doc1img}/>

            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doc2view} onPress={handledoc}>
          <ImageBackground source={require('../../assets/Images/bubblay.jpg')} style={{flex:1}} imageStyle={{borderRadius:10}} resizeMode='cover' blurRadius={3} >
          <Text style={styles.doc2text}>Dr. Lorem Ipsum</Text>
              <Image source={require('../../assets/Images/doc1.png')} style={styles.doc2img}/>
              </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Home