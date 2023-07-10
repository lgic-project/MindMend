import { StyleSheet } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(35),
    backgroundColor: "#FACE51",
  },
  smallcontainer: {
    height: "17%",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
  },
  largecontainer: {
    position: "relative",
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingBottom: 100,
  },
  heading: {
    height: 120,
    width: "100%",
    // backgroundColor:"#face51",
    paddingHorizontal: moderateScale(20),
    paddingVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moodcontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    marginTop: 10,
    height: 89,
    // backgroundColor:"red",
  },
  fitnesscontainer: {
    width: "100%",
    height: 110,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: moderateScale(20),
    gap: 10,
    marginTop: verticalScale(10),
    // backgroundColor:"red"
  },
  fitnesscard: {
    width: "50%",
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 3,
  },
  lookingfor: {
    width: "100%",
    height: 130,
    paddingHorizontal: moderateScale(20),
    display: "flex",
    gap: 10,
    marginTop: verticalScale(15),
  },
  lookingcard: {
    width: "25%",
    height: "100%",
    backgroundColor: "white",
    elevation: 3,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  doccardContent: {
    paddingRight: 10,
  },
  lookingcontainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  lookingimage: {
    width: moderateScale(40),
    height: verticalScale(35),
  },
  lTcontainer: {
    display: "flex",
    gap: -2,
  },
  lookingtext: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  carousel: {
    marginTop: 10,
  },
  carouselContentContainer: {
    paddingLeft: 100,
    paddingHorizontal: 10,
    // Adjust the horizontal padding
  },
  slide: {
    marginHorizontal: -80, // Adjust the margin to remove the gap between cards
  },
  doccontainer: {
    width: "100%",
    height: 190,
    paddingHorizontal: 15,
    display: "flex",
    gap: 10,
    paddingBottom: 5,
    marginTop: 32,
  },
  doccard: {
    flex: 1,
    flexDirection: "row",
  },
  doc1view: {
    width: "48%",
    height: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    marginRight: 10,
    // padding:1
  },
  doc1text: {
    paddingLeft: moderateScale(10),
    paddingTop: verticalScale(10),
    width: "60%",
    fontSize: 15,
    color: "white",
    fontWeight: "700",
    elevation: 3,
  },
  doc1img: {
    width: "45%",
    height: "90%",
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  doc2view: {
    width: "45%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 3,

    // padding:1
  },
  doc2text: {
    paddingLeft: 10,
    paddingTop: 10,
    width: "60%",
    fontSize: 15,
    color: "white",
    fontWeight: "700",
  },
  doc2img: {
    width: "70%",
    height: "85%",
    position: "absolute",
    bottom: 0,
    right: -10,
  },
  emojibutton: {
    width: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  emojiview: {
    width: "65%",
    height: "55%",
    borderRadius: 50,
    backgroundColor: "#FED9DD",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    borderWidth: 1,
    borderColor: "red",
  },
  notselected: {
    textAlign: "center",
  },
  selectedtext: {
    color: "red",
  },
  scrollView: {
    flex: 1,
  },
})
export default styles
