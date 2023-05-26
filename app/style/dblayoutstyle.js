import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBar: {
      height: 70,
      position: 'absolute',
      bottom: 16,
      right: 16,
      left: 16,
      borderRadius: 16,
    },
    btn: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 4,
      borderColor: "white",
      backgroundColor: "white",
      justifyContent: 'center',
      alignItems: 'center',
      // elevation:1
    },
    circle: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#FACE51",
      borderRadius: 25,
    },
    text: {
      fontSize: 10,
      textAlign: 'center',
      color: "#FACE51",
    }
  })

  export default styles