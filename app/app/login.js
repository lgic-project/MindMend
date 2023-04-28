import { View, Text } from 'react-native'
import React from 'react'
import styles from '../style/loginstyle'
const Login = () => {
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <Text style={styles.welcometext}>Welcome Back</Text>
                <Text style={styles.text}>Sign in to continue</Text>
                <View style={styles.signin}>

                </View>
            </View>
            <View style={styles.signup}>
                <Text style={styles.text2} >Don't have an account?</Text>
                <Text style={styles.signuptext}>Sign up</Text>
            </View>
        </View>
    )
}

export default Login