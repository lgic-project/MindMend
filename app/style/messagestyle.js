import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: verticalScale (35),
        backgroundColor:"#FACE51" 
    },
        smallcontainer:{
            height:"10%",
            display:"flex",
            flexDirection:"row",
            paddingHorizontal:10,
            paddingTop:10,
            
        },
        buttoncontainer:{
            
            width:"15%",
            display:"flex",
            justifyContent:"center",
            paddingLeft:5,
            height:"50%"
        },
        titlecontainer:{
            width:"85%",
            height:"50%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            paddingRight:moderateScale(70)
        },
        largecontainer:{
            height:"90%",
            backgroundColor:"white",
            borderTopStartRadius: moderateScale(50),
            borderTopEndRadius: moderateScale(50),
            position:"relative"
        },
        messagesection:{
            width:"100%", 
            height:"10%", 
            position:"absolute", 
            bottom:5, 
            display:"flex", 
            justifyContent:"center", 
            alignItems:"center", 
            flexDirection:"row", 
            backgroundColor:"#F5F0F0", 
            gap:10 
        },
        textinput:{
            backgroundColor:"white", 
            paddingVertical:5, 
            paddingLeft:10, 
            width:"70%", 
            borderRadius:25, 
            elevation:1, 
            borderWidth:1, 
            borderColor:"#FACE51",
            // marginBottom:5
        },
        msgbutton:{
            width:"10%", 
            height:"60%", 
            backgroundColor:"#FACE51", 
            borderRadius:50, 
            display:"flex", 
            justifyContent:"center", 
            alignItems:"center", 
            paddingRight:4,
            elevation:1
        }
});

export default styles