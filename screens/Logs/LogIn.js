import React, { useState, useEffect, useContext } from 'react'
import {
    Alert,
    Button,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'

import { Context } from "../../context/UserContext";

import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../../Redux/actions/auth';
import { CLEAR_ERROR } from "../../Redux/constants/constantsTypes.js"

import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';

const initialState = { email: '', password: '', userName: '' };

export default function LogIn({ navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state)

    const [form, setForm] = useState(initialState);
    const [isValid, setIsValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [userToken, setUserToken] = useState(null)
    // const [userId, setUserId] = useState(null)

    // console.log('login user token ', userToken)
    // console.log('login user Id ', userId)
    // console.log("Login.js userInfo", userInfo)
    console.log("Login.js userInfo", userInfo?.auth?.authData?.result)

    setUserContext(userInfo?.auth?.authData?.result)

    useEffect(() => {
        setIsValid(Object.values(form).every(value => value !== ""))
    }, [form])

    useEffect(() => {
        getItem()
    }, [userContext])

    async function getItem() {
        setUserToken(JSON.parse(await SecureStore.getItemAsync('storageData')).token)
    }

    const handleOnChange = (name, text) => {
        userInfo?.auth.auth_msg && dispatch({ type: CLEAR_ERROR })
        switch (name) {
            case "userName":
                // Minimum 4 characters, maximum 20 characters, at least on letter
                var re = /^(?=.*[A-Za-z])[A-Za-z\d]{4,20}$/
                re.test(text) ? setForm({ ...form, [name]: text }) : setForm({ ...form, [name]: "" })
                break

            case "email":
                // aaa@bbb.com
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                re.test(text) ? setForm({ ...form, [name]: text }) : setForm({ ...form, [name]: "" })
                break

            case "password":
                //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
                var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                re.test(text) ? setForm({ ...form, [name]: text }) : setForm({ ...form, [name]: "" })
                break

            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signin(form))
    };

    const forgetPassword = () => {
        dispatch({ type: CLEAR_ERROR })
        navigation.navigate('Auth', { screen: 'ForgetPass' })
    }

    if (userToken) {
        navigation.navigate('Main', { screen: 'MyDrawer', params: { screen: 'Home' } })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >

                <View style={styles.logoView}>
                    <Image style={styles.logo} source={require('../../assets/images/favicon.png')} />
                    {/* TODO add my Logo here */}
                </View>

                <View style={styles.inputLogo}>
                    <TouchableOpacity style={styles.validation} onPress={() => Alert.alert(
                        'Validation',
                        'Minimum 4 characters, maximum 20 characters, at least on letter',
                        [
                            { text: "OK" }
                        ])}>
                        <Feather name="user" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder='User Name'
                        keyboardType="ascii-capable"
                        defaultValue='Shlepe'
                        autoCorrect={false}
                        onChangeText={text => handleOnChange('userName', text)} />
                </View>

                <View style={styles.inputLogo}>
                    <TouchableOpacity style={styles.validation} onPress={() => Alert.alert(
                        'Validation',
                        'aaa@bbb.com',
                        [
                            { text: "OK" }
                        ])}>
                        <MaterialIcons name="alternate-email" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        keyboardType="email-address"
                        defaultValue='solyattie13@gmail.co'
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={text => handleOnChange('email', text)} />
                </View>

                <View style={styles.inputLogo}>
                    <TouchableOpacity style={styles.validation} onPress={() => Alert.alert(
                        'Validation',
                        'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:',
                        [
                            { text: "OK" }
                        ])}>
                        <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry={!showPassword}
                        defaultValue='Soly198'
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={text => handleOnChange('password', text)} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                        {showPassword ? <Ionicons name="eye-off-outline" size={24} color="black" />
                            : <Ionicons name="eye-outline" size={24} color="black" />}
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30, color: 'red', marginVertical: 10 }}>
                    {userInfo?.auth.auth_msg &&
                        <Text style={{ color: 'red', fontWeight: '500', fontSize: 16 }}>{userInfo.auth.auth_msg}</Text>
                    }
                </View>

                <View style={styles.logButton}>
                    <Button title="Login" disabled={!isValid} onPress={handleSubmit} />
                </View>

                <View style={styles.textLink}>
                    <Text>
                        Don't have an account?
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Auth', { screen: 'SignUp' })
                            dispatch({ type: CLEAR_ERROR })
                        }}>
                            <Text style={styles.link}>Sign Up</Text>
                        </TouchableOpacity>
                    </Text>
                </View>

                <View style={styles.textLink}>
                    <TouchableOpacity onPress={forgetPassword} >
                        <Text style={[styles.link, styles.link2]}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    logoView: {
        height: 100,
        marginTop: 100
    },
    logo: {
        height: 70,
        width: 70
    },
    inputLogo: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: "90%",
        backgroundColor: "white",
        height: 45,
        borderRadius: 10,
        marginBottom: 10,
    },
    input: {
        width: "80%",
    },
    logButton: {
        width: "90%",
    },
    textLink: {
        marginVertical: 15,
    },
    link: {
        width: 60,
        fontSize: 13,
        textDecorationLine: 'underline',
        color: 'blue',
        fontWeight: 'bold',
        textAlign: 'center',
        top: 3,
    },
    link2: {
        width: 150,
    }
})