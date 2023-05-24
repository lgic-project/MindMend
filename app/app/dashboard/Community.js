import { View, Text, useWindowDimensions } from 'react-native'
import * as React from 'react'
import styles from '../../style/communitystyles';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';

const FirstRoute=()=>(
  <View style={{flex:1, backgroundColor:"#FAFAFA"}}></View>
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
        <Text style={styles.groups}>Groups</Text>
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