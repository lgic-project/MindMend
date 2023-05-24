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
        titletext:{
            fontWeight:"400", 
            fontSize:20,
            color:"white"
        },
        titlecontainer:{
            width:"100%",
            height:"50%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        },
        largecontainer:{
            height:"90%",
            backgroundColor:"white",
            borderTopStartRadius: moderateScale(50),
            borderTopEndRadius: moderateScale(50),
            paddingHorizontal:10,
            paddingTop:20
        },
    cardcontainer:{ 
        flex: 1, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        paddingTop: 5, 
        gap:10,
        paddingBottom:20
    },
    cardmain:{ 
        width: "100%", 
        height: verticalScale(160), 
        display:"flex", 
        justifyContent:"center",
        alignItems:"center",
        paddingLeft:5,
        paddingRight:5
    },
    card:{ 
        width: "95%", 
        height: verticalScale(110), 
        backgroundColor: "white", 
        borderRadius: 15, 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row", 
        paddingLeft: 10, 
        paddingVertical: 5, 
        gap: 10, 
        elevation:1 
    },
    img:{ 
        width:"35%", 
        height:"85%", 
        borderRadius: 15, 
        position:"absolute", 
    },
    imgodd:{
        top:-18, 
        left:-10 
    },
    imgeven:{  
        top:-18, 
        right:-10 
    },
    blankview:{
        width: "30%", 
        height: "100%"
    },
    textcontainer:{ 
        width: "65%", 
        height: "90%", 
        paddingLeft: 10, 
        paddingVertical: 5, 
        borderRadius: 10, 
        display: "flex", 
        gap: 5 
    },
    title:{ 
        fontSize: 18, 
        fontWeight: "600",  
    },
    title1:{
        color: "#FACE51"
    },
    title2:{
        color: "#8D85F1"
    },
    title3:{
        color:"#99EC98",
        fontSize: 16, 
        fontWeight: "600", 
    },
    description:{ 
        fontSize: 15, 
        fontWeight: "400" 
    },
    buttonodd:{ 
        width: moderateScale(170), 
        paddingVertical:verticalScale(10), 
        position: "absolute", 
        bottom: -30, 
        right: 10, 
        borderRadius:25, 
        display:"flex", 
        justifyContent:"center", 
        alignItems:"center", 
        flexDirection:"row", 
        gap:15 
    },
    buttoneven:{ 
        width: moderateScale(170), 
        paddingVertical:verticalScale(10),
        borderRadius:25, 
        display:"flex", 
        justifyContent:"center", 
        alignItems:"center", 
        flexDirection:"row", 
        gap:15,
        position: "absolute", 
        bottom: -30, 
        left: 10, 
    },
    button1:{
        backgroundColor: "#FACE51", 
    },
    button2:{
        backgroundColor: "#8D85F1", 
    },
    button3:{
        backgroundColor:"#99EC98"
    },
    button4:{
        backgroundColor:"#F38596"
    },
    textcontainer3:{ 
        width: "65%", 
        height: "90%", 
        paddingLeft: 10, 
        paddingVertical: 5, 
        borderRadius: 10, 
        display: "flex", 
        gap: 5 
    },
    title4:{
        color:"#F38596"
    }
    


});

export default styles