import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA"
    },
    firstmain:{
        width:"100%",
        height:"20%",
        backgroundColor:"#FAFAFA",

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
    tabmain:{
        display:"flex", 
        alignItems:"center", 
        justifyContent:"center", 
        flexDirection:"row", 
        gap:10
    },
    tabbar:{
        backgroundColor: 'white', 
        width:250, 
        borderRadius:50
    },
    add:{
        width:45, 
        height:45, 
        backgroundColor:"white", 
        borderRadius:50, 
        elevation:1, 
        display:"flex", 
        justifyContent:"center", 
        alignItems:"center"
    }

});

export default styles