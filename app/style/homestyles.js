import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FACE51",
        paddingTop:35
    },
    heading:{
        height:70, 
        width:"100%", 
        backgroundColor:"white", 
        paddingHorizontal:20, 
        paddingVertical:5, 
        display:"flex", 
        flexDirection:"row", 
        justifyContent:"space-between",
        alignItems:"center"
    }
});
export default styles