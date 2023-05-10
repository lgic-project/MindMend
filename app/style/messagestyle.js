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
});

export default styles