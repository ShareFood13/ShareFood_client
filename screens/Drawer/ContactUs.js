import React, { useState, useCallback, useEffect } from 'react';

import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Pressable,
    Modal,
    ScrollView,
    Image,
    Dimensions,
    Alert,
    StatusBar,
    RefreshControl
} from 'react-native'

import { MaterialIcons, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { useDispatch } from 'react-redux';
import { sendToSharedFood } from '../../Redux/actions/auth';

import * as SecureStore from 'expo-secure-store';

const initialValue = {
    fromUserName: "",
    fromEmail: "",
    subject: "",
    title: "",
    message: "",
}

export default function ContactUs({ navigation }) {
    const [userId, setUserId] = useState()
    const [contactUsForm, setContactUsForm] = useState(initialValue)

    const dispatch = useDispatch();

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    const handleOnChange = (name, text) => {
        setContactUsForm({ ...contactUsForm, [name]: text, creatorId: userId })
    }

    const sendContactUs = () => {
        dispatch(sendToSharedFood(contactUsForm))
        setContactUsForm(initialValue)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={{ marginVertical: 10 }}>Please Contact Us for any reason at all!!!</Text>
                <Text style={{ marginVertical: 10 }}>We are here for You!!!</Text>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>From:</Text> */}
                    <TextInput
                        value={user?.result.userName}
                        style={styles.input}
                        placeholder={user?.result.userName}
                        onChangeText={text => handleOnChange('fromUserName', text)} />
                </View>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>E-mail:</Text> */}
                    <TextInput
                        value={user?.result.email}
                        style={styles.input}
                        placeholder={user?.result.email}
                        onChangeText={text => handleOnChange('fromEmail', text)} />
                </View>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>Subject:</Text> */}
                    <TextInput
                        value={contactUsForm.subject}
                        style={styles.input}
                        placeholder="Subject"
                        onChangeText={text => handleOnChange('subject', text)} />
                </View>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>Title:</Text> */}
                    <TextInput
                        value={contactUsForm.title}
                        style={styles.input}
                        placeholder="Title"
                        onChangeText={text => handleOnChange('title', text)} />
                </View>
                <View style={[styles.viewInput, { minHeight: 150, alignItems: 'flex-start' }]}>
                    {/* <Text style={{ width: "20%", paddingTop: 10 }}>Message:</Text> */}
                    <TextInput
                        value={contactUsForm.message}
                        style={[styles.input, { minHeight: 150, textAlignVertical: 'top', paddingTop: 10 }]}
                        placeholder="Message"
                        multiline
                        numberOfLines={5}
                        onChangeText={text => handleOnChange('message', text)} />
                </View>
                <TouchableOpacity
                    style={styles.genericButton}
                    onPress={() => sendContactUs()}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Send Mail</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    genericButton: {
        marginVertical: 30,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#66ccff',

    },
    input: {
        width: "100%",
        height: '100%',
        paddingLeft: 15,
        textAlignVertical: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    viewInput: {
        flexDirection: 'row',
        width: "90%",
        height: 35,
        alignItems: 'center',
        marginVertical: 5
    }
})