import React, { useState, useCallback, useEffect, useContext } from 'react';

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

import { useDispatch, useSelector } from 'react-redux';
import { sendToSharedFood } from '../../Redux/actions/auth';


import * as SecureStore from 'expo-secure-store';
import Banner from '../../components/Banner';

const initialValue = {
    fromUserName: "",
    fromEmail: "",
    subject: "",
    title: "",
    message: "",
}

import GlobalStyles from '../../GlobalStyles';
import { useFonts } from 'expo-font';
import {
    Roboto_400Regular,
    Lato_400Regular,
    Montserrat_400Regular,
    Oswald_400Regular,
    SourceCodePro_400Regular,
    Slabo27px_400Regular,
    Poppins_400Regular,
    Lora_400Regular,
    Rubik_400Regular,
    PTSans_400Regular,
    Karla_400Regular
} from '@expo-google-fonts/dev';
import GlobalFontStyles from '../../GlobalFontStyles';
import trans from '../../Language'

import { Context } from '../../context/UserContext';
var theme = ""
var language = ""
var fontStyle = ""

export default function ContactUs({ navigation }) {
    const [user, setUser] = useState()
    const [contactUsForm, setContactUsForm] = useState(initialValue)
    // const [language, setLanguage] = useState("en")
    // const [theme, setTheme] = useState("stylesLight")
    // const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Lato_400Regular,
        Montserrat_400Regular,
        Oswald_400Regular,
        SourceCodePro_400Regular,
        Slabo27px_400Regular,
        Poppins_400Regular,
        Lora_400Regular,
        Rubik_400Regular,
        PTSans_400Regular,
        Karla_400Regular
    })

    const redux = useSelector((state) => state)
    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])

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
            <View style={[styles.container, { backgroundColor: GlobalStyles[theme]?.background }]}>

                {/* <Banner title={trans[language]?.CONTACT_US} /> */}

                <Text style={{ marginVertical: 10, fontSize: 16, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{trans[language]?.PLEASE_CONTACT_US}</Text>
                <Text style={{ marginVertical: 10, fontSize: 16, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{trans[language]?.WE_ARE_HERE}</Text>

                <View style={[styles.viewInput, { backgroundColor: GlobalStyles[theme]?.paperColor }]}>
                    {/* <Text style={{ width: "20%", }}>From:</Text> */}
                    <TextInput
                        value={user?.userUserName}
                        style={[styles.input, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }]}
                        placeholder={user?.userUserName}
                        placeholderTextColor={GlobalStyles[theme]?.fontColor}
                        onChangeText={text => handleOnChange('fromUserName', text)} />
                </View>

                <View style={[styles.viewInput, { backgroundColor: GlobalStyles[theme]?.paperColor }]}>
                    {/* <Text style={{ width: "20%", }}>E-mail:</Text> */}
                    <TextInput
                        value={user?.userEmail}
                        style={[styles.input, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }]}
                        placeholder={user?.userEmail}
                        placeholderTextColor={GlobalStyles[theme]?.fontColor}
                        onChangeText={text => handleOnChange('fromEmail', text)} />
                </View>

                <View style={[styles.viewInput, { backgroundColor: GlobalStyles[theme]?.paperColor }]}>
                    {/* <Text style={{ width: "20%", }}>Subject:</Text> */}
                    <TextInput
                        value={contactUsForm.subject}
                        style={[styles.input, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }]}
                        placeholder={trans[language]?.SUBJECT}
                        placeholderTextColor={GlobalStyles[theme]?.fontColor}
                        onChangeText={text => handleOnChange('subject', text)} />
                </View>

                <View style={[styles.viewInput, { backgroundColor: GlobalStyles[theme]?.paperColor }]}>
                    {/* <Text style={{ width: "20%", }}>Title:</Text> */}
                    <TextInput
                        value={contactUsForm.title}
                        style={[styles.input, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }]}
                        placeholder={trans[language]?.TITLE + ":"}
                        placeholderTextColor={GlobalStyles[theme]?.fontColor}
                        onChangeText={text => handleOnChange('title', text)} />
                </View>

                <View style={[styles.viewInput, { backgroundColor: GlobalStyles[theme]?.paperColor, minHeight: 150, alignItems: 'flex-start' }]}>
                    {/* <Text style={{ width: "20%", paddingTop: 10 }}>Message:</Text> */}
                    <TextInput
                        value={contactUsForm.message}
                        style={[styles.input, { minHeight: 150, textAlignVertical: 'top', paddingTop: 10 },, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }]}
                        placeholder={trans[language]?.MESSAGE}
                        placeholderTextColor={GlobalStyles[theme]?.fontColor}
                        multiline
                        numberOfLines={5}
                        onChangeText={text => handleOnChange('message', text)} />
                </View>

                <TouchableOpacity
                    style={[{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: 30,
                        borderRadius: 10,
                        borderStyle: 'solid',
                        borderWidth: 0.5,
                    }, { 
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.buttonColor }]}
                    onPress={() => sendContactUs()}>
                    <Text style={{ color: 'white', fontSize: 16, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.SEND_MAIL}</Text>
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
        height: 40,
        alignItems: 'center',
        marginVertical: 5,
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 10
    }
})