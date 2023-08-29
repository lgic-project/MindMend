import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA"
    },
    firstmain: {
        width: "100%",
        height: "20%",
        backgroundColor: "#FAFAFA",

    },
    heading: {
        width: "100%",
        height: verticalScale(60),
        paddingHorizontal: moderateScale(10),
        backgroundColor: "#FACE51",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    groups: {
        fontSize: 20,
        fontWeight: "400",
        color: "white"
    },
    firstview: {
        width: "100%",
        height: "100%",
        backgroundColor: "#FACE51",
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    tabmain: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10
    },
    tabbar: {
        backgroundColor: 'white',
        width: 250,
        borderRadius: 50
    },
    add: {
        width: 45,
        height: 45,
        backgroundColor: "white",
        borderRadius: 50,
        elevation: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    // first route news feed
    pagescrollcontainer: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        paddingTop: 20
    },
    pagecontainer: {
        flex: 1,
        alignItems: "center",
        gap: 15,
        paddingBottom: 25
    },
    newsfeed: {
        width: "90%",
        height: 350,
        backgroundColor: "white",
        borderWidth: 0.2,
        borderRadius: 10,
        borderColor: "#ACA6A6",
        padding: 10,
        display: "flex",
        gap: 5
    },
    feedheading: {
        width: "100%",
        height: "20%",
        padding: 5,
        gap: 5
    },
    imgtxt: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems:"center"
    },
    iconcontainer: {
        width: "100%",
        height: "20%",
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    icon: {
        width: "30%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    // friends page
    scrollfriend: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        paddingTop: 20,
        paddingHorizontal: 10
    },
    friend: {
        width: "100%",
        height: 70,
        backgroundColor: "white",
        borderRadius: 25,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },
    imgtext: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    frndimg: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    // groups section
    Scrollgroup: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        paddingTop: 20,
        paddingHorizontal: 10
    },
    groupheading: {
        marginBottom: 15,
        fontSize: 18,
        fontWeight: "600",
        color: "#face51"
    },
    groupheading1: {
        marginBottom: 15,
        fontSize: 18,
        fontWeight: "600",
        color: "#face51",
        paddingTop: 10
    },
    group: {
        width: "100%",
        height: 90,
        backgroundColor: "white",
        borderRadius: 25,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10
    },
    block: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    groupimg: {
        width: 90,
        height: 75,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25
    },
    groupinfo: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 10,
        gap: 5
    },
    infoheading: {
        fontSize: 17,
        color: "gray",
        fontWeight: "600"
    },
    groupdetails: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    member: {
        color: "gray",
        fontSize: 14
    }

});

export default styles