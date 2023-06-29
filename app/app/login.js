import { View, Text, useWindowDimensions, TextInput, TouchableOpacity } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import * as React from 'react';
import styles from '../style/loginstyle'
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const FirstRoute = () => {
    const router = useRouter();
    return (
        <View style={styles.firstroute}>
            <View style={styles.ipcontainer}>
                <TextInput style={styles.input} placeholder='Email' />
                <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' />
                <TouchableOpacity><Text style={{ textAlign: "center" }}>Forgot your Password?</Text></TouchableOpacity>
            </View>
            <View style={styles.arrowmain}>
                {/* <Link href='./dashboard/Home'> */}
                <TouchableOpacity style={styles.arrowcontainer} onPress={() => router.push(`./dashboard/Home`)}>
                    <AntDesign name="arrowright" size={30} color="black" />
                </TouchableOpacity>
                {/* </Link> */}
            </View>
        </View>
    )
};



const SecondRoute = () => {

    return (
        <View style={styles.secondroute} >
            <View style={styles.ipcontainer}>
                <TextInput style={styles.input} placeholder='First name' />
                <TextInput style={styles.input} placeholder='Last name' />
                <TextInput style={styles.input} placeholder='Email' />
                <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' />
                <TextInput secureTextEntry={true} style={styles.input} placeholder='Confirm Password' />
                <Text style={{ textAlign: "center" }}>By Creating an account, you agree to accept our Terms and Conditions</Text>
            </View>
            <View style={styles.arrowmain}>
                <TouchableOpacity style={styles.arrowcontainer}  >
                    <AntDesign name="arrowright" size={40} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
};

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});



const Login = () => {
    const [index, setIndex] = React.useState(0);
    const layout = useWindowDimensions();

    const [routes] = React.useState([
        { key: 'first', title: 'Sign in' },
        { key: 'second', title: 'Sign up' },
    ]);

    const handleSignuptext = () => {
        setIndex(1);
    }


    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <Text style={styles.welcometext}>Welcome Back</Text>
                <Text style={styles.text}>Sign in to continue</Text>
                <View style={styles.signin}>

                    <TabView
                        style={{ borderRadius: 25 }}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={props => <TabBar {...props} style={{ backgroundColor: 'white' }} labelStyle={{ color: "#FACE51", fontWeight: "500", textTransform: "none" }} />}
                    />

                </View>
            </View>
            <View style={styles.signup}>
                <Text style={styles.text2} >Don't have an account?</Text>
                <TouchableOpacity onPress={handleSignuptext} ><Text style={styles.signuptext}>Sign up</Text></TouchableOpacity>
            </View>
        </View>
    )
}

export default Login
