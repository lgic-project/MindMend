import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container:{
        paddingTop:verticalScale(35),
        paddingHorizontal:moderateScale(5),
        flex:1,
        backgroundColor:"white"
    },
    heading:{
        width:"100%", 
        height:verticalScale(60), 
        paddingHorizontal: moderateScale(10), 
        backgroundColor:"white", 
        display:"flex", 
        justifyContent:"space-between", 
        flexDirection:"row", 
        alignItems:"center"
    },
    headcontainer:{
        width:"100%", 
        height:"20%", 
        display:"flex", 
        flexDirection:"row", 
        gap:moderateScale(5),
    },
    imagecontainer:{
        width:"30%", 
        display:"flex", 
        alignItems:"center", 
        paddingTop:verticalScale(30)
    },
    image:{
         width:moderateScale(85), 
         height:verticalScale(80), 
         borderRadius:50 
    },
    textcontainer:{
        width:"70%", 
        paddingTop:verticalScale(10), 
        paddingHorizontal:moderateScale(5), 
        display:"flex", 
        gap:moderateScale(10)
    },
    username:{
        fontSize:20,
        color:"#343434"
    },
    headingtext:{
        color:"#5F5F5F"
    },
    addsection:{ 
        width: "100%", 
        height: verticalScale(70), 
        padding: 12, 
        display: "flex", 
        flexDirection: "row", 
        gap: 10, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    add:{ 
        width: "40%", 
        height: "90%", 
        backgroundColor: "#FFBD00", 
        display: "flex", 
        flexDirection: "row", 
        gap: 5, 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: 10, 
        elevation: 5 
    },
    addtext:{ 
        fontSize: 16, 
        color: "white" 
    },
    messenger:{ 
        width: "20%", 
        height: "90%", 
        backgroundColor: "white", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: 10, 
        elevation: 5 
    },
    downbutton:{ 
        width: "15%", 
        height: "90%", 
        backgroundColor: "white", 
        display: "flex", 
        justifyContent: 'center', 
        alignItems: "center" 
    }

});

export default styles