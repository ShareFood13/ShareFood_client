import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Pressable,
    Modal,
    ScrollView,
    Image,
    Dimensions,
    Alert,
    FlatList,
    RefreshControl,
    ImageBackground
} from 'react-native'
import Banner from '../../components/Banner'
import SwitchButton from '../../components/SwitchButton';
import PopupModal from '../../components/PopupModal';

import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Context } from "../../context/UserContext";
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';


import { Entypo, EvilIcons, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, FontAwesome } from '@expo/vector-icons';

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
import trans from '../../Language'
import GlobalFontStyles from '../../GlobalFontStyles';
import GlobalTextStyles from '../../GlobalTextStyles';
import GlobalStyles from '../../GlobalStyles';
import { saveSettings } from '../../Redux/actions/auth';

const initialSettings = {
    language: { key: 1, label: "English", value: "en", image: "🇺🇸" }, //["en","pt","es","it","fr", "he"]
    system: "Metric",  // ["metric", "imperial"]
    theme: "Light", //["stylesLight", "stylesDark"]
    recipesStatus: "Public", // [Public,Private]
    mealsStatus: "Public", // [Public,Private]
    eventsStatus: "Public", // [Public,Private]
    globalStatus: "Public", // [Public,Private]
    showAbout: "Public",  // [true,false]
    notifications: "true",  // [true,false]
    security: "true",  // [true,false]
    ads: "true",  // [true,false]
    fontStyle: "Montserrat",
    myBookPag: "Default", // [default, custom] custom -> customFilter: []
    customFilter: [],
}

const languages = [
    { key: 1, label: "English", value: "en", image: "🇺🇸" },
    { key: 2, label: "Português", value: "pt", image: "🇧🇷" },
    { key: 3, label: "Español", value: "es", image: "🇪🇸" },
    { key: 4, label: "Italiano", value: "it", image: "🇮🇹" },
    { key: 5, label: "Français", value: "fr", image: "🇫🇷" },
    { key: 6, label: "עברית", value: "he", image: "🇮🇱" },
]

var theme = ""
var language = ""
var fontStyle = ""

export default function MySettings({ navigation }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { userContext, setUserContext } = useContext(Context)
    const [settingsForm, setSettingsForm] = useState(initialSettings)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalAlert, setModalAlert] = useState(false)
    const [userData, setUserData] = useState("")
    // const [show, setShow] = useState("Public")
    const [customFilter, setCustomFilter] = useState("")
    const [refreshing, setRefreshing] = useState(false)
    // const [theme, setTheme] = useState('stylesLight')
    // const [language, setLanguage] = useState("en")
    // const [text, setText] = useState("en")
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

    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    const redux = useSelector(state => state?.auth?.authData?.result?.settings)

    useEffect(() => {
        if (redux) {
            setSettingsForm(redux)
            theme = redux?.theme
            language = redux?.language?.value
            fontStyle = redux?.fontStyle
        }
    }, [redux])

    // To set when settings are saved
    // useEffect(() => {
    //     if (redux?.auth?.message) {
    //         setPopupModal(true)
    //         setTimeout(() => {
    //             setPopupModal(false)
    //             dispatch({ type: CLEAR_MSG })
    //             // setProfileForm(redux?.auth?.authData?.result?.profile)
    //         }, 2500)
    //     }
    // }, [redux?.auth?.message])

    ///// get SecureStorage
    useEffect(() => {
        getUser()
    }, [])
    // REFRESH FUNCTIONS //////////////////////////////////////////
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(5000).then(() => setRefreshing(false))//.then(dispatch(getUserInfo(userData?.userId)))
    }, []);

    ////
    const getUser = async () => {
        setUserData(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    const handleChange = (name, text, event) => {
        // console.log("MySettings handleChange", event.nativeEvent.key)
        if (name === "customFilter") {
            setCustomFilter(text)
            if (text.charAt(text.length - 1) === ",") { // || text.charAt(text.length - 1) === " "
                if (!settingsForm[name]?.includes(text.slice(0, text.length - 1)) && text !== " " && text !== ",")
                    setSettingsForm({ ...settingsForm, [name]: [...settingsForm[name], text.slice(0, text.length - 1)] })
                setCustomFilter("")
            }
        } else {
            setSettingsForm({ ...settingsForm, [name]: text })
        }
    }

    const handlePress = (e) => {
        var text = e._dispatchInstances._debugOwner.pendingProps.value
        if (!settingsForm.customFilter.includes(text))
            setSettingsForm({ ...settingsForm, customFilter: [...settingsForm.customFilter, text] })
        setCustomFilter("")
    }

    const removeFilter = (text) => {
        const result2 = settingsForm.customFilter.filter(item => item !== text)
        setSettingsForm({ ...settingsForm, customFilter: result2 })
    }

    const saveSettingsSubmit = () => {
        // console.log("saveSettingsSubmit",userData.userId, settingsForm)
        dispatch(saveSettings(userData.userId, settingsForm)).then(onRefresh())
        
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: GlobalStyles[theme]?.background }]}
            >

                {/* <Banner title={trans[language]?.MY_SETTINGS} /> */}

                <ScrollView style={{ width: "100%" }}>

                    {/* <Text>Language: en, he, pt, sp, </Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.LANGUAGE}:</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ width: "65%" }}>
                            <Text style={{
                                height: 30,
                                borderRadius: 10,
                                paddingLeft: 10,
                                textAlignVertical: "center",
                                textAlign: "center",
                                backgroundColor: GlobalStyles[theme]?.paperColor,
                                color: GlobalStyles[theme]?.fontColor,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                            }}>{settingsForm.language.image}   {settingsForm.language.label}   {settingsForm.language.image}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Text>System: metric or imperial</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.SYSTEM}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.METRIC} text02={trans[language]?.IMPERIAL} show={settingsForm.system} handleChange={handleChange} name={"system"} />
                        </View>
                    </View>

                    {/* <Text>Theme: Light or Dark</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.THEME}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.LIGHT} text02={trans[language]?.DARK} show={settingsForm.theme} handleChange={handleChange} name={"theme"} />
                        </View>
                    </View>

                    {/* <Text>RecipesStatus: Public or Private</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.RECIPES_STATUS}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.PUBLIC} text02={trans[language]?.PRIVATE} show={settingsForm.recipesStatus} handleChange={handleChange} name={"recipesStatus"} />
                        </View>
                    </View>

                    {/* <Text>mealsStatus: Public or Private</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.MEALS_STATUS}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.PUBLIC} text02={trans[language]?.PRIVATE} show={settingsForm.mealsStatus} handleChange={handleChange} name={"mealsStatus"} />
                        </View>
                    </View>

                    {/* <Text>eventsStatus: Public or Private</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.EVENTS_STATUS}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.PUBLIC} text02={trans[language]?.PRIVATE} show={settingsForm.eventsStatus} handleChange={handleChange} name={"eventsStatus"} />
                        </View>
                    </View>

                    {/* <Text>globalStatus: Public or Private</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.GLOBAL_STATUS}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.PUBLIC} text02={trans[language]?.PRIVATE} show={settingsForm.globalStatus} handleChange={handleChange} name={"globalStatus"} />
                        </View>
                    </View>

                    {/* <Text>showAbout: Public or Private</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.SHOW_ABOUT_ME}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.PUBLIC} text02={trans[language]?.PRIVATE} show={settingsForm.showAbout} handleChange={handleChange} name={"showAbout"} />
                        </View>
                    </View>

                    {/* <Text>notifications: [true,false]</Text> */}
                    {/* <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{
                    color: GlobalStyles[theme]?.fontColor,
                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                }}>{trans[language]?.NOTIFICATIONS}:</Text>
                <View style={{ width: "65%" }}>
                    <SwitchButton text01={trans[language]?.TRUE} text02={trans[language]?.FALSE} show={settingsForm.notifications} handleChange={handleChange} name={"notifications"} />
                </View>
            </View> */}

                    {/* <Text>security: [true,false]</Text> */}
                    {/* <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{
                    color: GlobalStyles[theme]?.fontColor,
                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                }}>{trans[language]?.SECURITY}:</Text>
                <View style={{ width: "65%" }}>
                    <SwitchButton text01={trans[language]?.TRUE} text02={trans[language]?.FALSE} show={settingsForm.security} handleChange={handleChange} name={"security"} />
                </View>
            </View> */}

                    {/* <Text>ads: [true,false]</Text> */}
                    {/* <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{
                    color: GlobalStyles[theme]?.fontColor,
                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                }}>{trans[language]?.ADS}:</Text>
                <View style={{ width: "65%" }}>
                    <SwitchButton text01={trans[language]?.TRUE} text02={trans[language]?.FALSE} show={settingsForm.ads} handleChange={handleChange} name={"ads"} />
                </View>
            </View> */}

                    {/* <Text>myBookPag: [true,false]</Text> */}
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>{trans[language]?.MY_BOOK_FILTER}:</Text>
                        <View style={{ width: "65%" }}>
                            <SwitchButton text01={trans[language]?.DEFAULT} text02={trans[language]?.CUSTOM} show={settingsForm.myBookPag} handleChange={handleChange} name={"myBookPag"} />
                        </View>
                    </View>
                    {settingsForm.myBookPag === "Custom" &&
                        <>
                            <View style={{ flexDirection: 'row', width: "100%", height: 35, justifyContent: "space-between", marginTop: 10 }}>
                                <Text style={{
                                    width: "25%",
                                    height: 35,
                                    textAlignVertical: "center",
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                }}>{trans[language]?.CUSTOM}:</Text>
                                <TouchableOpacity style={{ width: "10%", height: 30, alignSelf: 'center' }}
                                    onPress={() => setModalAlert(true)}>
                                    <MaterialCommunityIcons name="filter-plus-outline" size={24} color={GlobalStyles[theme]?.fontColor} />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder={trans[language]?.ENTER_CUSTOM_FILTER}
                                    placeholderTextColor={GlobalStyles[theme]?.fontColor}
                                    value={customFilter}
                                    style={{
                                        width: "65%",
                                        height: 35,
                                        borderRadius: 10,
                                        paddingLeft: 10,
                                        backgroundColor: GlobalStyles[theme]?.paperColor,
                                        color: GlobalStyles[theme]?.fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                    }}
                                    // onKeyPress={handlePress}
                                    onSubmitEditing={handlePress}
                                    onChangeText={text => handleChange('customFilter', text)} />
                            </View>
                            <View
                                style={{
                                    marginTop: 20,
                                    width: "100%",
                                }}>
                                {settingsForm.customFilter.map((item, index) =>
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: "row",
                                            width: "100%",
                                            height: 30,
                                            paddingHorizontal: 20,
                                            marginBottom: 10,
                                            justifyContent: "space-between",
                                            borderWidth: 0.5,
                                            borderRadius: 15,
                                            borderColor: GlobalStyles[theme]?.fontColor,
                                            backgroundColor: GlobalStyles[theme]?.paperColor,
                                        }}>
                                        <Text
                                            style={{
                                                textAlignVertical: "center",
                                                textAlign: 'center',
                                                color: GlobalStyles[theme]?.fontColor,
                                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                            }}>{item}</Text>
                                        <TouchableOpacity onPress={() => removeFilter(item)}>
                                            <Text style={{
                                                height: 30,
                                                textAlignVertical: "center",
                                                textAlign: 'center',
                                                color: GlobalStyles[theme]?.fontColor,
                                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                            }}>X</Text>
                                        </TouchableOpacity>
                                    </View>)}
                            </View>
                        </>
                    }

                    {/* <Text>Account</Text>
                    <Text>MyBook Pagination: none, default, custom</Text>

                    <Text>Location: automatico eu acho</Text> */}

                    <TouchableOpacity
                        onPress={saveSettingsSubmit}
                        style={{
                            alignSelf: 'center',
                            width: 100,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 10,
                            borderWidth: 0.5,
                            borderColor: GlobalStyles[theme]?.fontColor,
                            backgroundColor: GlobalStyles[theme]?.buttonColor,

                        }}>
                        <Text style={{ color: GlobalStyles[theme]?.fontColor, textAlign: 'center', textAlignVertical: "center" }}>
                            {trans[language]?.SAVE}
                        </Text>
                    </TouchableOpacity>

                    {/* // Languages Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme]?.borderColor,
                                backgroundColor: GlobalStyles[theme]?.paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => {
                                        setModalVisible(false)
                                        setSearchResult([])
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <FlatList
                                    data={languages}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            minWidth: 150,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme]?.borderColor,
                                            backgroundColor: GlobalStyles[theme]?.buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                            color: GlobalStyles[theme]?.fontColor
                                        }]}
                                            onPress={() => { handleChange('language', item); setModalVisible(false) }}
                                        >
                                            {item.label}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.key}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // Modal Alert// */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalAlert}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                width: 350,
                                maxHeight: 400,
                                alignItems: "flex-start",
                                padding: 30,
                                borderWidth: 0.5,
                                borderRadius: 10,
                                elevation: 5,
                            }, {
                                borderColor: GlobalStyles[theme]?.borderColor,
                                backgroundColor: GlobalStyles[theme]?.paperColor
                            }]}>
                                <View>
                                    <Text style={{
                                        fontSize: 16,
                                        marginBottom: 10,
                                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                        color: GlobalStyles[theme]?.fontColor,
                                    }}>
                                        {trans[language]?.TO_ADD_A_FILTER}
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                        color: GlobalStyles[theme]?.fontColor,
                                    }}>
                                        {trans[language]?.PRESS_CHART}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: "100%", justifyContent: "flex-end", marginTop: 20 }}>
                                    <TouchableOpacity
                                        onPress={() => setModalAlert(false)}>
                                        <Text style={{
                                            color: GlobalStyles[theme]?.buttonColor,
                                            fontSize: 16,
                                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                        }}>
                                            {trans[language]?.OK}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    }
})