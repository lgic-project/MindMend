import { View, Text, useWindowDimensions } from 'react-native'
import * as React from 'react'
import styles from '../../style/communitystyles';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const FirstRoute=()=>(
  <View style={{flex:1, backgroundColor:"green"}}></View>
);

const SecondRoute = ()=>(
  <View style={{flex:1, backgroundColor:"blue"}} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const Community = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key:'first', title:'First'},
    {key:'second', title:'Second'},

  ])

  return (
    <View style={styles.container} >
      <View style={styles.firstmain}>
        <View style={styles.firstview}>
        <Text>Groups</Text>
        </View>
      </View>
     <View style={{flex:1}}>
     
      <TabView 
        navigationState={{index,routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width:layout.width}}
        renderTabBar={props => <TabBar {...props} style={{backgroundColor: 'red', width:200, borderRadius:50}} labelStyle= {{color:"#FACE51", fontWeight:"500", textTransform:"none"}} />}
        />

     </View>

    </View>
  )
}

export default Community