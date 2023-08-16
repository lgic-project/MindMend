import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: verticalScale (35),
        backgroundColor: "#FACE51"
    },
    smallcontainer: {
        height: "35%",
        display: "flex",
        flexDirection: "row",

    },
    buttoncontainer: {
        display: "flex",
        justifyContent: "center",
        padding: 5

    },
    largecontainer: {
        height: "71%",
        backgroundColor: "#E5E0E0",
        borderTopStartRadius: moderateScale(50),
        borderTopEndRadius: moderateScale(50),
        // paddingHorizontal:10,
        marginTop: verticalScale(-40),
        paddingTop: verticalScale(0)
    },
    bgcontainer: {
        width: "100%",
        display: "flex",
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    camcontainer: {
        marginTop: 10,
        width: 40,
        height: 40,
        backgroundColor: "#FACE51",
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    profileinfo: {
        width: "100%",
        height: "20%",
        backgroundColor: "white",
        borderTopStartRadius: 50,
        borderTopEndRadius: 50,
        paddingTop: 20,
        paddingLeft: 20,
        display: "flex",
        flexDirection: "row",
        gap: 20
    },
    profilecam: {
        width: 25,
        height: 25,
        backgroundColor: "#FACE51",
        borderRadius: 50,
        position: "absolute",
        bottom: 20,
        left: 80,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    profiletext: {
        display: "flex",
        gap: 10,
        paddingTop: 15
    },
    name: {
        // textAlign:"center", 
        fontSize: 18
    },
    location: {
        display: "flex",
        flexDirection: "row",
        gap: 2
    },
    scrollview: {
        width: "100%",
        height: "80%",
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 15
    },
    card: {
        width: "100%",
        height: 238,
        backgroundColor: "white",
        borderRadius: 25,
        elevation: 1,
        marginBottom: 10,
    },
    row: {
        display: "flex",
        width: "100%",
        height: 60,
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E0E0"
    }
})
export default styles