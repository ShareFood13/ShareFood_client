import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Alert,
    Image,
    TouchableWithoutFeedback,
    Platform,
    Keyboard
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';

import { useDispatch } from 'react-redux';
import { signin } from '../../Redux/actions/auth';
import { LOGOUT } from "../../Redux/constants/constantsTypes.js"

import AsyncStorage from '@react-native-async-storage/async-storage';

import decode from "jwt-decode"

import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const initialState = { email: '', password: '', userName: '' };

export default function LogIn({ navigation }) {
    const [form, setForm] = useState(initialState);
    const [isValid, setIsValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser] = useState()

    const dispatch = useDispatch();

    // const { logIn } = React.useContext(AuthContext);

    // console.log('====================================');
    // console.log("login30", user);
    // console.log('====================================');

    useEffect(() => {
        setIsValid(Object.values(form).every(value => value !== ""))
    }, [form])

    const handleOnChange = (name, text) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setUser(JSON.parse(await AsyncStorage.getItem('profile')))
        dispatch(signin(form, navigation));
    };

    const forgetPassword = () => {
        navigation.navigate('ForgetPass')
    }

    // const token = user?.token

    // if (token) {
    //     const decodedToken = decode(token)
    //     // console.log('====================================');
    //     // console.log("decodedToken77", decodedToken);
    //     // console.log('====================================');
    //     if (decodedToken.id === user.result._id) {
    //         navigation.navigate("Home3")
    //     }
    // }

    const logOutfun = () => {
        dispatch({ type: LOGOUT })
        setUser(null)
        // navigation.navigate('LogIn')
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.logoView}>
                    <Image style={styles.logo} source={require('../../assets/images/favicon.png')} />
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
                        onChangeText={text => handleOnChange('email', text)} />
                </View>

                <View style={[styles.inputLogo, styles.inputMargin]}>
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
                        onChangeText={text => handleOnChange('password', text)} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                        {showPassword ? <Ionicons name="eye-off-outline" size={24} color="black" />
                            : <Ionicons name="eye-outline" size={24} color="black" />}
                    </TouchableOpacity>
                </View>


                <View style={styles.logButton}>
                    <Button title="Login" disabled={!isValid} onPress={handleSubmit} />
                </View>
                <View style={styles.textLink}>
                    <Text>
                        Don't have an account?
                        <TouchableOpacity onPress={() => navigation.push("SignUp")} >
                            <Text style={styles.link}>Sign Up</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
                <View style={styles.textLink}>
                    <TouchableOpacity onPress={forgetPassword} >
                        <Text style={[styles.link, styles.link2]}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={logOutfun} >
                    <Text >LOG OUT</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoView: {
        height: 100,
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
        // paddingStart: 10,
    },
    inputMargin: {
        marginBottom: 50
    },
    logButton: {
        width: "90%",
        // borderRadius: 50,
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