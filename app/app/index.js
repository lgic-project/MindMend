import { View, Text } from "react-native";
import Walkthrough from "./walkthrough";
export default function Home() {
  return (
    <View style={{ flex:1,
        paddingTop:40,
         }}>
    <Walkthrough/>
    </View>
  );
}