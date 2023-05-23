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
import Banner from '../../components/Banner';
import GlobalStyles from '../../GlobalStyles';

const initialValue = {
    fromUserName: "",
    fromEmail: "",
    subject: "",
    title: "",
    message: "",
}

export default function ContactUs({ navigation }) {
    const [user, setUser] = useState()
    const [contactUsForm, setContactUsForm] = useState(initialValue)
    const [theme, setTheme] = useState('stylesLight')

    const dispatch = useDispatch();

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUser(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    const handleOnChange = (name, text) => {
        setContactUsForm({ ...contactUsForm, [name]: text, creatorId: user.userId })
    }

    const sendContactUs = () => {
        dispatch(sendToSharedFood(contactUsForm))
        setContactUsForm(initialValue)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: GlobalStyles[theme].background }]}>
                <Banner title="Constact Us" />
                <Text style={{ marginVertical: 10, fontSize: 16, fontWeight: '500' }}>Please Contact Us for any reason at all!!!</Text>
                <Text style={{ marginVertical: 10, fontSize: 16, fontWeight: '500' }}>We are here for You!!!</Text>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>From:</Text> */}
                    <TextInput
                        value={user?.userUserName}
                        style={[styles.input, { backgroundColor: GlobalStyles[theme].paperColor }]}
                        placeholder={user?.userUserName}
                        onChangeText={text => handleOnChange('fromUserName', text)} />
                </View>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>E-mail:</Text> */}
                    <TextInput
                        value={user?.userEmail}
                        style={[styles.input, { backgroundColor: GlobalStyles[theme].paperColor }]}
                        placeholder={user?.userEmail}
                        onChangeText={text => handleOnChange('fromEmail', text)} />
                </View>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>Subject:</Text> */}
                    <TextInput
                        value={contactUsForm.subject}
                        style={[styles.input, { backgroundColor: GlobalStyles[theme].paperColor }]}
                        placeholder="Subject"
                        onChangeText={text => handleOnChange('subject', text)} />
                </View>
                <View style={styles.viewInput}>
                    {/* <Text style={{ width: "20%", }}>Title:</Text> */}
                    <TextInput
                        value={contactUsForm.title}
                        style={[styles.input, { backgroundColor: GlobalStyles[theme].paperColor }]}
                        placeholder="Title"
                        onChangeText={text => handleOnChange('title', text)} />
                </View>
                <View style={[styles.viewInput, { minHeight: 150, alignItems: 'flex-start' }]}>
                    {/* <Text style={{ width: "20%", paddingTop: 10 }}>Message:</Text> */}
                    <TextInput
                        value={contactUsForm.message}
                        style={[styles.input, { backgroundColor: GlobalStyles[theme].paperColor, minHeight: 150, textAlignVertical: 'top', paddingTop: 10 }]}
                        placeholder="Message"
                        multiline
                        numberOfLines={5}
                        onChangeText={text => handleOnChange('message', text)} />
                </View>
                <TouchableOpacity
                    style={[styles.genericButton, { backgroundColor: GlobalStyles[theme].buttonColor }]}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    },
    genericButton: {
        marginVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 0.5,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    input: {
        width: "100%",
        height: '100%',
        paddingLeft: 15,
        textAlignVertical: 'center',
        // backgroundColor: 'white',
        borderRadius: 10,
    },
    viewInput: {
        // flexDirection: 'row',
        width: "100%",
        height: 35,
        alignItems: 'center',
        marginVertical: 5
    }
})