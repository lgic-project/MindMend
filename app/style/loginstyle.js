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
        height:530, 
        // backgroundColor:"gray", 
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
    },
    firstroute:{
        height:240,  
        backgroundColor: 'white', 
        borderBottomStartRadius:25, 
        borderBottomEndRadius:25,
        padding:20
    },
    input:{
        borderWidth:1, 
        borderColor:"#BDBDBD", 
        paddingLeft:20, 
        paddingVertical:5, 
        borderRadius:30
    },
    ipcontainer:{
        display:"flex",
        flexDirection:"column",
        gap:20
    },
    arrowmain:{
        width:100, 
        height:100, 
        backgroundColor:"white", 
        position:"absolute", 
        bottom:-40, 
        right:120, 
        borderRadius:50,
        elevation:2,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    arrowcontainer:{
        backgroundColor:"#FACE51",
        width:75,
        height:75,
        borderRadius:50,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    secondroute:{
        height:430,  
        backgroundColor: 'white',
        padding:20,
        borderBottomStartRadius:25, 
        borderBottomEndRadius:25,

    }
})

export default styles