import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({

    container:{ 
        flex: 1, 
        backgroundColor: "white", 
        paddingTop: verticalScale(30), 
        paddingHorizontal: 5 
    },
    headsection:{ 
        display: "flex", 
        paddingVertical: verticalScale(20), 
        justifyContent: "center", 
        alignItems: "center" 
    },
    headingtext:{
        fontSize:20, 
        fontWeight:"500"
    },
    scrollview:{ 
        width: "100%", 
        height: "80%", 
        backgroundColor: "#fafafa" 
    },
    cardcontainer:{ 
        flex: 1, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        paddingTop: 5, 
        gap:10
    },
    cardmain:{ 
        width: "100%", 
        height: verticalScale(160), 
        backgroundColor: "#fafafa", 
        display:"flex", 
        justifyContent:"center",
        alignItems:"center",
    },
    card:{ 
        width: "90%", 
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