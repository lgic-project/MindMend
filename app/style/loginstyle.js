import { StyleSheet } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: verticalScale(40),
    backgroundColor: "#FAFAFA",
    gap: 10,
  },
  background: {
    height: "35%",
    backgroundColor: "#FACE51",
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    paddingTop: 40,
  },
  welcometext: {
    paddingTop: verticalScale(20),
    paddingLeft: moderateScale(20),
    fontSize: 20,
    fontWeight: "900",
  },
  text: {
    paddingLeft: moderateScale(20),
    fontSize: 15,
    fontWeight: "400",
  },
  signin: {
    height: 600,
    // backgroundColor:"gray",
    marginHorizontal: 22,
    marginTop: 20,
    borderRadius: 25,
  },
  signup: {
    position: "absolute",
    bottom: 25,
    left: 90,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  signuptext: {
    textDecorationLine: "underline",
    color: "#FACE51",
    fontWeight: "500",
  },
  text2: {
    fontSize: 14,
    fontWeight: "300",
  },
  firstroute: {
    height: 250,
    backgroundColor: "white",
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    padding: 20,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    paddingLeft: 20,
    paddingVertical: 7,
    borderRadius: 30,
  },
  ipcontainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  signupcontainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  arrowmain: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    position: "absolute",
    bottom: -40,
    right: 120,
    borderRadius: 50,
    elevation: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowcontainer: {
    backgroundColor: "#FACE51",
    width: 80,
    height: 80,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  secondroute: {
    height: verticalScale(420),
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
})

export default styles
