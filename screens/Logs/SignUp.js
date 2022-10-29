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
import { signup } from '../../Redux/actions/auth';

import BouncyCheckbox from "react-native-bouncy-checkbox";

import { AntDesign, MaterialIcons, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', userName: '', isPermission: false };

export default function SignUp({ navigation }) {
    const [form, setForm] = useState(initialState);
    const [isChecked, setIsChecked] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConPassword, setShowConPassword] = useState(false)

    const dispatch = useDispatch();

    useEffect(() => {
        setIsValid(Object.values(form).every(value => value !== "") && form.isPermission === true)
    }, [form])

    const handleOnChange = (name, text) => {
        switch (name) {
            case "firstName":
                (text.length > 2) ? setForm({ ...form, [name]: text }) : setForm({ ...form, [name]: "" })
                break

            case "lastName":
                (text.length > 2) ? setForm({ ...form, [name]: text }) : setForm({ ...form, [name]: "" })
                break

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

            case "confirmPassword":
                (form.password === text) ? setForm({ ...form, [name]: text }) : setForm({ ...form, [name]: "" })
                break

            case "isPermission":
                setForm({ ...form, [name]: text })
                setIsChecked(!isChecked)
                break

            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('====================================');
        console.log(form);
        console.log('====================================');

        dispatch(signup(form, navigation));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.logoView}>
                    <Image style={styles.logo} source={require('../../assets/images/favicon.png')} />
                </View>

                <View style={styles.inputID}>
                    <TouchableOpacity style={styles.validation} onPress={() => Alert.alert(
                        'Validation',
                        'Minimum 3 characters',
                        [
                            { text: "OK" }
                        ])}>
                        <AntDesign name="idcard" size={25} color="black" style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.name}
                        placeholder='First Name'
                        maxLength={40}
                        keyboardType="ascii-capable"
                        onChangeText={text => handleOnChange('firstName', text)} />
                    <TextInput
                        style={styles.name}
                        placeholder='Last Name'
                        keyboardType="ascii-capable"
                        onChangeText={text => handleOnChange('lastName', text)} />
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
                        onChangeText={text => handleOnChange('confirmPassword', text)} />
                    <TouchableOpacity onPress={() => setShowConPassword(!showConPassword)} >
                        {showConPassword ? <Ionicons name="eye-off-outline" size={24} color="black" />
                            : <Ionicons name="eye-outline" size={24} color="black" />}
                    </TouchableOpacity>
                </View>

                <View style={styles.textLink}>
                    <BouncyCheckbox
                        size={20}
                        fillColor="blue"
                        unfillColor="#FFFFFF"
                        text="I accept the Terms & Privacy Policy"
                        textStyle={{ textDecorationLine: "none", }}
                        iconStyle={{ borderColor: "blue" }}
                        style={styles.checkBox}
                        // innerIconStyle={{ borderWidth: 2 }}
                        // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                        onPress={() => handleOnChange('isPermission', !isChecked)}
                    />
                    <TouchableOpacity onPress={() => navigation.push("TermsConditions")} >
                        <Text style={styles.link}>Read it</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.logButton}>
                    <Button title="Sign Up" onPress={handleSubmit} disabled={!isValid} />
                </View>

                <View style={styles.textLink}>
                    <Text>
                        Do you have an account?
                        <TouchableOpacity onPress={() => navigation.goBack("Login")} >
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </KeyboardAvoidingView >
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
        height: 100
    },
    logo: {
        height: 70,
        width: 70
    },
    inputID: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        backgroundColor: "white",
        height: 45,
        borderRadius: 10,
        marginBottom: 10,
    },
    validation: {
        borderRadius: 50
    },
    name: {
        width: "45%",
        // paddingStart: 10,
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
    checkBox: {
        marginBottom: 10
    },
    logButton: {
        width: "90%",
        // borderRadius: 50,
    },
    textLink: {
        marginVertical: 15,
        flexDirection: 'row'
    },
    link: {
        width: 60,
        fontSize: 13,
        textDecorationLine: 'underline',
        color: 'blue',
        fontWeight: 'bold',
        textAlign: 'center',
        top: 3,
    }
})