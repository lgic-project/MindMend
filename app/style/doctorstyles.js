import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: verticalScale (35),
        backgroundColor:"#FAFAFA" 
    },
        smallcontainer:{
            height:"40%",
            display:"flex",
            flexDirection:"row",
            paddingHorizontal:10,
            paddingTop:10,
            justifyContent:"center",
            alignItems:"center"
            
        },
        
        largecontainer:{
            height:"60%",
            backgroundColor:"white",
            borderTopStartRadius: moderateScale(50),
            borderTopEndRadius: moderateScale(50),
            paddingHorizontal:10,
            elevation:3
        },
})

export default styles