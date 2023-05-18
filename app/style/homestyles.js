import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingTop:verticalScale(35)
    },
    heading:{
        height:(70), 
        width:"100%", 
        backgroundColor:"white", 
        paddingHorizontal:moderateScale(20), 
        paddingVertical:5, 
        display:"flex", 
        flexDirection:"row", 
        justifyContent:"space-between",
        alignItems:"center",
        elevation:0.2
    },
    moodcontainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:"center",
        alignItems:"center",
        width:"100%", 
        paddingHorizontal:5, 
        marginTop:(20),
        height:"12%"
    },
    fitnesscontainer:{
        width:"100%",
        height:"20%", 
        display:"flex", 
        flexDirection:"row",
        paddingHorizontal:moderateScale(20), 
        gap:10, 
        marginTop:verticalScale(15)
    },
    fitnesscard:{
        width:"50%", 
        height:"90%", 
        borderRadius:15, 
        backgroundColor:"white", 
        elevation:3,
    },
    lookingfor:{
        width:"100%", 
        height:"20%", 
        paddingHorizontal:moderateScale(20), 
        display:"flex", 
        gap:10, 
        marginTop:verticalScale(15)
    },
    lookingcard:{
        width:"25%", 
        height:"90%", 
        backgroundColor:"white", 
        elevation:3, 
        borderRadius:20,
        display:"flex",
        justifyContent:"center",
        alignItems:"center", 
        gap:5
    },
    lookingcontainer:{ 
        flex: 1, 
        flexDirection: "row", 
        gap: 10 
    },
    lookingimage:{
        width:moderateScale(40), 
        height:verticalScale(35)
    },
    lTcontainer:{ 
        display:"flex", 
        gap:-2 
    },
    lookingtext:{
        fontSize:13, 
        color:"green", 
        textAlign:"center"
    },
    doccontainer:{ 
        width: "100%", 
        height: "30%", 
        paddingHorizontal: 15, 
        display: "flex", 
        gap: 10, 
        paddingBottom:5 
    },
    doccard:{ 
        flex: 1, 
        flexDirection: "row", 
        gap: 10, 
    },
    doc1view:{ 
        width: "48%", 
        height: "85%", 
        backgroundColor: "white", 
        borderRadius: 10, 
        elevation: 3, 
        padding:1 
    },
    doc1text:{
        paddingLeft:moderateScale(10), 
        paddingTop:verticalScale(10), 
        width:"75%", 
        fontSize:17, 
        color:"gray"
    },
    doc1img:{
        width:"45%", 
        height:"90%", 
        position:"absolute", 
        bottom:0, 
        right:5
    },
    doc2view:{ 
        width: "50%", 
        height: "100%", 
        backgroundColor: "white", 
        borderRadius: 10, 
        elevation: 3, 
        padding:1 
    },
    doc2text:{
        paddingLeft:10, 
        paddingTop:10, 
        width:"75%", 
        fontSize:17, 
        color:"white"
    },
    doc2img:{
        width:"70%", 
        height:"85%", 
        position:"absolute", 
        bottom:0, 
        right:-10
    }
});
export default styles