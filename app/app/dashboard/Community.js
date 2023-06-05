import { View, Text, useWindowDimensions,ScrollView, Image } from 'react-native'
import * as React from 'react'
import styles from '../../style/communitystyles';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';

const FirstRoute=()=>(
  <ScrollView style={{flex:1, backgroundColor:"#FAFAFA", paddingTop:20}}>
    <View style={{flex:1, alignItems:"center", gap:15}} >
      <View style={{width:"90%", height:350, backgroundColor:"white", borderWidth:0.2, borderRadius:10, borderColor:"#ACA6A6", padding:10, display:"flex", gap:5}} >
        <View style={{width:"100%", height:"20%", backgroundColor:"#FAFAFA", padding:5, gap:5}}>
          <View style={{display:"flex", flexDirection:"row", gap:10}}>
            <Image source={require('../../assets/Images/myprofile.png')} style={{ width:35, height:35, borderRadius:50 }} />
          <Text style={{ alignSelf:"center", fontSize:17}}>Mahima Poudel</Text>
          </View>
          <Text style={{fontSize:13}}>Help Needed</Text>
        </View>
        <View style={{width:"100%", height:"60%"}} >
          <Image source={require('../../assets/Images/gym.png')} resizeMode='contain' style={{width:"100%", height:"100%"}} />
        </View>
        <View style={{width:"100%", height:"20%", backgroundColor:"#FAFAFA", display:"flex", flexDirection:"row", gap:10}} >
          <View style={{ width:"30%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
          <AntDesign name="like2" size={24} color="black" />
          </View>
          <View style={{ width:"30%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
          <FontAwesome name="comment-o" size={24} color="black" />
          </View>
          <View style={{ width:"30%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
          <FontAwesome name="share" size={24} color="black" />
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
);

const SecondRoute = ()=>(
  <View style={{flex:1, backgroundColor:"#FAFAFA"}} ></View>
);

const ThirdRoute = () =>(
  <View style={{flex:1, backgroundColor:"#FAFAFA"}} ></View>
)

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third:ThirdRoute,
});

const Community = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key:'first', title:'Feed'},
    {key:'second', title:'Friends'},
    {key:'third', title:'Groups'},

  ])

  return (
    <View style={styles.container} >
      <View style={styles.firstmain}>
        <View style={styles.firstview}>
        <Text style={styles.groups}>Community</Text>
        </View>
      </View>
     <View style={{flex:1}}>
     
      <TabView 
      style={{marginTop:-20}}
        navigationState={{index,routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width:layout.width}}
        renderTabBar={props => <View style={styles.tabmain}>
          <TabBar {...props} style={styles.tabbar}
           labelStyle= {{color:"gray", fontWeight:"500", fontSize:13}}
           indicatorStyle={{height:0}}
           activeColor='#FACE51'
           />
          <View style={styles.add}>
          <Ionicons name="person-add" size={25} color="#FACE51" />
          </View>
        </View>}
        />

     </View>

    </View>
  )
}

export default Community