// https://mailtrap.io/blog/sending-emails-with-nodemailer/

import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    TouchableOpacity,
    Image
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';

import { MaterialIcons, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import { sendPassword, changePassword } from '../../Redux/actions/auth';
import { LOGOUT, AUTH_ERROR, CLEAR_ERROR } from "../../Redux/constants/constantsTypes.js"

const initialState = { email: '', userName: '' };
const initialState2 = { email: '', code: '', password: '', confirmPassword: '' }

export default function ForgetPass({ navigation }) {
    const [form, setForm] = useState(initialState);
    const [form2, setForm2] = useState(initialState2);
    const [isValid, setIsValid] = useState(false)
    const [isValid2, setIsValid2] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConPassword, setShowConPassword] = useState(false)
    const [receivePassword, setReceivePassword] = useState(null)

    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state)

    useEffect(() => {
        setIsValid(Object.values(form).every(value => value !== ""))
        setIsValid2(Object.values(form2).every(value => value !== ""))
    }, [form, form2])

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
                if (re.test(text)) {
                    setForm({ ...form, [name]: text })
                    setForm2({ ...form2, [name]: text })
                } else {
                    setForm({ ...form, [name]: "" })
                    setForm2({ ...form2, [name]: "" })
                }
                break

            case "code":
                text === receivePassword ? setForm2({ ...form2, [name]: text }) : setForm2({ ...form2, [name]: "" })
                break

            case "password":
                //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
                var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                re.test(text) ? setForm2({ ...form2, [name]: text }) : setForm2({ ...form2, [name]: "" })
                break

            case "confirmPassword":
                (form2.password === text) ? setForm2({ ...form2, [name]: text }) : setForm2({ ...form2, [name]: "" })
                break
            default:
                break;
        }
    }

    useEffect(() => {
        if (userInfo?.auth?.authData?.message) {
            alert(userInfo?.auth?.authData?.message)
            setReceivePassword(userInfo?.auth?.authData?.password)
            // dispatch({ type: CLEAR_ERROR })
        }
    }, [userInfo])

    const sendPass = async (e) => {
        e.preventDefault();
        dispatch(sendPassword(form));
    };

    const resetPassword = () => {
        dispatch(changePassword(form2, navigation));
        // alert(`Reset Password`)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <KeyboardAvoidingView style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >

                    <View style={styles.logoView}>
                        <Image style={styles.logo} source={require('../../assets/logo.png')} />
                    </View>

                    <Text style={{ fontSize: 16, marginVertical: 15 }}>Forgot Password?</Text>

                    {!receivePassword ? <>
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
                                keyboardType="ascii-capable"
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={text => handleOnChange('email', text)} />
                        </View >

                        <View style={{ height: 30, color: 'red', marginVertical: 10 }}>
                            {userInfo?.auth.auth_msg &&
                                <Text style={{ color: 'red', fontWeight: '500', fontSize: 16 }}>{userInfo.auth.auth_msg}</Text>
                            }
                        </View>

                        <View style={styles.logButton}>
                            <Button title="Send my Password" disabled={!isValid} onPress={sendPass} />
                        </View>


                    </>
                        : <>
                            <View style={styles.inputLogo}>

                                <MaterialIcons name="alternate-email" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                <TextInput
                                    style={styles.input}
                                    placeholder='E-mail'
                                    keyboardType="ascii-capable"
                                    defaultValue={form.email}
                                    onChangeText={text => handleOnChange('email', text)}
                                />
                            </View >

                            <View style={[styles.inputLogo, styles.inputMargin]}>
                                <TouchableOpacity style={styles.validation} onPress={() => Alert.alert(
                                    'Code',
                                    'Enter the code you received in your email.',
                                    [
                                        { text: "OK" }
                                    ])}>
                                    <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Code'
                                    defaultValue={receivePassword}
                                    onChangeText={text => handleOnChange('code', text)}
                                />
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
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={text => handleOnChange('password', text)} />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                                    {showPassword ? <Ionicons name="eye-off-outline" size={24} color="black" />
                                        : <Ionicons name="eye-outline" size={24} color="black" />}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputLogo}>
                                <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                <TextInput
                                    style={styles.input}
                                    placeholder='Confrim Password'
                                    secureTextEntry={!showConPassword}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={text => handleOnChange('confirmPassword', text)} />
                                <TouchableOpacity onPress={() => setShowConPassword(!showConPassword)} >
                                    {showConPassword ? <Ionicons name="eye-off-outline" size={24} color="black" />
                                        : <Ionicons name="eye-outline" size={24} color="black" />}
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: 30, color: 'red', marginVertical: 10 }}>
                                {userInfo?.auth.auth_msg &&
                                    <Text style={{ color: 'red', fontWeight: '500', fontSize: 16 }}>{userInfo.auth.auth_msg}</Text>
                                }
                            </View>

                            <View style={styles.logButton}>
                                <Button title="Reset Password" disabled={!isValid2} onPress={resetPassword} />
                            </View>

                        </>}


                    <View style={styles.textLink}>
                        <TouchableOpacity onPress={() => {
                            dispatch({ type: CLEAR_ERROR })
                            navigation.navigate('LogIn')
                        }} >
                            <Text style={[styles.link]}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

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
        // paddingStart: 10,
    },
    link: {
        width: 80,
        fontSize: 13,
        textDecorationLine: 'underline',
        color: 'blue',
        fontWeight: 'bold',
        textAlign: 'center',
        top: 3,
    },
    logButton: {
        width: "90%",
        // borderRadius: 50,
    },
})