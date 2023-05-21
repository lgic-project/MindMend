import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "yellow"
    },
    firstmain:{
        width:"100%",
        height:"20%",
        backgroundColor:"green",

    },
    firstview:{
        width:"100%",
        height:"100%",
        backgroundColor:"#FACE51",
        borderBottomStartRadius:30,
        borderBottomEndRadius:30,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    cataddmain:{ 
        width:"100%", 
        height:70,
        position:"absolute", 
        bottom:0, 
    },
    catadd:{ 
        flex:1, 
        justifyContent:"center", 
        alignItems:"center",
        flexDirection:"row",
        gap:10
    },
    category:{ 
        width:"60%", 
        height:"80%", 
        backgroundColor:"white",
        borderRadius:50,
        elevation:1
    },
    add:{
        width:"15%",
        height:"80%",
        backgroundColor:"white",
        borderRadius:50,
    }

});

export default styles