import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container:{
        flex:1, 
        paddingTop: verticalScale(40),
    },
    background:{
        height:"40%", 
        backgroundColor:"#FACE51", 
        borderRadius:25
    },
    welcometext:{
        paddingTop: verticalScale(20), 
        paddingLeft:moderateScale(20),
        fontSize:20,
        fontWeight:"900"
    },
    text:{
        paddingLeft:moderateScale(20),
        fontSize:15,
        fontWeight:"400"
    },
    signin:{
        height:350, 
        backgroundColor:"gray", 
        marginHorizontal:22, 
        marginTop:20, 
        borderRadius:25
    },
    signup:{
        position:"absolute", 
        bottom:25, 
        left:90,
        display:"flex",
        flexDirection:"row",
        gap:10
    },
    signuptext:{
        textDecorationLine:"underline",
        color:"#FACE51",
        fontWeight:"500"
    },
    text2:{
        fontSize:14,
        fontWeight:"300"
    }
})

export default styles