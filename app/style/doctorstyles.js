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
        titlesection:{ 
            width: "100%", 
            height: "20%", 
            marginTop: 10, 
            borderBottomWidth: 1, 
            borderBottomColor: "gray", 
            paddingTop: 15, 
            display: "flex", 
            gap: 15 
        },
        titlefirst:{ 
            width: "100%", 
            display: "flex", 
            justifyContent: "space-between", 
            paddingHorizontal: 5, 
            flexDirection: "row", 
            paddingLeft: 20 
        },
        titlesecond:{ 
            width: "100%", 
            display: "flex", 
            justifyContent: "space-between", 
            paddingHorizontal: 5, 
            flexDirection: "row", 
            paddingLeft: 20 
        },
        textspecial:{ 
            color: "gray", 
            fontSize: 15, 
            fontWeight: "300" 
        },
        underlarge:{ 
            width: "100%", 
            height: "80%", 
            paddingHorizontal:15, 
            display:"flex", 
            gap:20, 
            paddingTop:15 
        },
        aboutsection:{
            display:"flex", 
            gap:5
        },
        boxcontainer:{ 
            display: "flex", 
            justifyContent: "space-between", 
            flexDirection: "row", 
            width: "100%", 
            height: "15%" 
        },
        box:{ 
            width: "30%", 
            height: "100%", 
            borderWidth: 0.5, 
            borderRadius: 5, 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center" 
        },
        absolutebutton:{ 
            width: 360, 
            height: "20%", 
            position: "absolute", 
            bottom: 20, 
            left: 5, 
            right: 0 
        },
        centerbtn:{ 
            flex: 1, 
            justifyContent: "center", 
            alignItems: "center" 
        },
        btn:{ 
            width: "100%", 
            height: "100%", 
            backgroundColor: "#FACE51", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            borderRadius: 20 
        }
})

export default styles