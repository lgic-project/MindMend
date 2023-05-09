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
        paddingHorizontal:moderateScale(80)
    },
    largecontainer:{
        height:"90%",
        backgroundColor:"white",
        borderTopStartRadius: moderateScale(50),
        borderTopEndRadius: moderateScale(50),
        paddingHorizontal:10
    },
    searchcontainer:{
        display:"flex", 
        flexDirection:"row",
        marginTop:20, 
        justifyContent:"center", 
        gap:10 
    },
    search:{
        borderWidth:1, 
        borderColor:"#FACE51" ,
        borderRadius:50, 
        width:"80%", 
        paddingLeft:20
    },
    image:{
        flex:1, 
        width:35, 
        height:40
    },
    imagecontainer:{
            width:"11%", 
            height:40, 
            borderRadius:50
        },
    titletext:{
        fontWeight:"400", 
        fontSize:20 
    },
    chatcontainer:{
        display:"flex",
        flexDirection:"row",
        padding:0,
        width:"100%",
        paddingVertical:10
    },
    iconatiner:{
        padding:5,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        position:"relative"

    },
    online:{
        width:moderateScale(16),
        height: verticalScale(14),
        backgroundColor:"white",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50,
        position:"absolute",
        bottom:9,
        right:8
    },
    onlinegreen:{
        width:moderateScale(10),
        height: verticalScale(9),
        backgroundColor:"green",
        borderRadius:50
    },
    textconatiner:{
        paddingLeft:moderateScale(10),
        flex:1
        
    },
    ctext1:{
        color:"gray",
        fontWeight:"400",
        fontSize:17

    },
    ctext2:{
        color:"white",
        color:"#B4B5BA",
        fontSize:13
    }
})
export default styles