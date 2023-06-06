import React, { useState, useEffect, useCallback } from 'react'
import { useIsFocused } from '@react-navigation/native';

import {
    View,
    Text,
    StyleSheet,
    TextInput,
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
    RefreshControl,
    ImageBackground,
    FlatList
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';
import { createMyMail, getMyMails, getSendedMails, deleteMyMail, mailView } from '../../Redux/actions/mymails';

import PopupModal from '../../components/PopupModal';

import { getUserInfo } from '../../Redux/actions/auth'
import Banner from '../../components/Banner';
import Constants from 'expo-constants';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SelectList } from 'react-native-dropdown-select-list';

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
import GlobalStyles from '../../GlobalStyles';
import GlobalFontStyles from '../../GlobalFontStyles';
import trans from '../../Language'

const initialMailForm = {
    senderId: '',
    senderName: '',
    reciverId: '',
    reciverName: '',
    subject: '',
    message: '',
    isDeleted: false,
    isOpen: false
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { Context } from '../../context/UserContext';
import { useContext } from 'react';
var theme = ""
var language = ""
var fontStyle = ""

const otherUsersList = []
export default function MyMails({ navigation }) {
    const myRefs = React.useRef([]);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [popupModal, setPopupModal] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalAlert, setModalAlert] = useState(false);
    const [modalAlert1, setModalAlert1] = useState(false);
    const [searchResult, setSearchResult] = useState([])
    const [mailForm, setMailForm] = useState(initialMailForm);
    const [mailToShow, setMailtoShow] = useState('');
    const [listToDelete, setListToDelete] = useState([])
    const [myMails, setMyMails] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const [userInfo, setUserInfo] = useState()
    const [allSelected, setAllSelected] = useState(false);

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

    const [selected, setSelected] = useState('');
    const [checkboxState, setCheckboxState] = useState([])

    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])

    useEffect(() => {
        navigation.addListener('focus', () => setListToDelete([]))
    }, [])

    const redux = useSelector(state => state)
    // console.log("redux.auth.authData.result", redux?.auth?.authData?.result?.userName, redux?.auth?.authData?.result?._id)
    // useEffect(() => {
    //     setMyMails(redux?.myMail?.myMails)
    // }, [redux])

    useEffect(() => {
        redux?.other?.otherUsers.map(user => redux?.auth?.authData?.result?.profile?.following?.includes(user._id) &&
            otherUsersList.push({ key: user._id, _id: user._id, value: user.userName }))
    }, [])

    useEffect(() => {
        setMyMails(redux?.myMail?.myMails)
        if (redux?.myMail?.message) {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
            }, 2500)
        }
    }, [redux, isFocused])

    // useEffect(() => {
    //     // getItem()
    //     // console.log("params", route.params.fromNewRecipe)
    //     setUserId(redux.auth.authData.result._id)
    // }, [])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserInfo(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        console.log("MyMails redux?.auth?.authData?.result?._id", redux?.auth?.authData?.result?._id)
        dispatch(getMyMails(redux?.auth?.authData?.result?._id))
        wait(3000).then(() => setRefreshing(false))
    }, []);

    // useEffect(() => {
    //     (userInfo && userInfo?.userId !== undefined) && dispatch(getMyMails(userInfo?.userId))
    // }, [userInfo, isFocused])

    const addToDelList = (_id) => {

        if (!listToDelete.includes(_id)) {
            setListToDelete([...listToDelete, _id])
        } else {
            var newListToDelete = []
            newListToDelete = listToDelete.filter((item) => item !== _id);
            setListToDelete(newListToDelete)
        }
    };

    useEffect(() => {
        listToDelete.map(item => myRefs.current[item]?.setNativeProps({ style: { backgroundColor: GlobalStyles[theme]?.buttonColor, opacity: 1 } }))
    }, [listToDelete])

    const deleteMails = () => {
        dispatch(deleteMyMail(redux?.auth?.authData?.result?._id, listToDelete))
    };

    const selectAllMails = (isChecked) => {
        setAllSelected(isChecked);
        if (isChecked) {
            var newListToDelete = []
            myMails.map(mail => !listToDelete.includes(mail._id) && newListToDelete.push(mail._id))
            setListToDelete([...listToDelete, ...newListToDelete])
        } else {
            setListToDelete([])
        }
    };

    const onChange = (name, text) => {
        if (name === 'reciverName') {
            otherUsersList.map((friend) =>
                friend.value === text
                    ? setMailForm({
                        ...mailForm,
                        reciverName: friend.value,
                        reciverId: friend._id,
                        senderId: redux?.auth?.authData?.result?._id,
                        senderName: redux?.auth?.authData?.result?.userName,
                    })
                    : console.log('null')
            );
        } else {
            setMailForm({
                ...mailForm,
                [name]: text,
                senderId: redux?.auth?.authData?.result?._id,
                senderName: redux?.auth?.authData?.result?.userName,
            });
        }
        setModalVisible3(false)
        setSearchResult([])
    };

    const showMail = (mail) => {
        setMailtoShow(mail);
        setModalVisible2(true);
        dispatch(mailView(mail._id))
    };

    const sendMailFunc = () => {
        if (mailForm.reciverName === "") {
            setModalAlert1(true)
        } else {
            dispatch(createMyMail(mailForm))
            dispatch(getMyMails(redux?.auth?.authData?.result._id))
            setMailForm(initialMailForm)
            setModalVisible(!modalVisible);
            onRefresh()
        }
        // userInfo._id === mailForm.reciverId
        //     ? myMail2.unshift(mailForm)
        //     : console.log('null');
    };

    const modalSearch = (text) => {
        console.log(text)
        setSearchResult(otherUsersList.filter(item => item.value.toLowerCase().includes(text.toLowerCase())))
    }

    return (
        <KeyboardAvoidingView
            style={
                [{
                    flex: 1,
                    padding: 10,
                }, { backgroundColor: GlobalStyles[theme]?.background }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }>

                {/* <Banner title={trans[language]?.MY_MAILS} /> */}

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        padding: 20,
                        borderWidth: 0.5,
                        borderStyle: 'solid',
                        borderRadius: 10,
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.buttonColor,
                    }}>
                    <Feather name="edit-3" size={24} color="black" />
                    <Text style={{
                        marginLeft: 15,
                        fontSize: 16,
                        color: GlobalStyles[theme]?.fontColor,
                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                    }}>
                        {trans[language]?.COMPOSE}
                    </Text>
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row',
                    height: 40,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderStyle: 'solid',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderColor: GlobalStyles[theme]?.borderColor,
                    backgroundColor: GlobalStyles[theme]?.paperColor,
                }}>
                    {/* <BouncyCheckbox
                    size={25}
                    fillColor="cyan"
                    unfillColor="#FFFFFF"
                    // text="select all"
                    iconStyle={{ borderColor: 'red' }}
                    innerIconStyle={{ borderWidth: 2 }}
                    // textStyle={{ fontFamily: 'JosefinSans-Regular' }}
                    onPress={(isChecked) => {
                        selectAllMails(isChecked);
                    }}
                    style={{ width: '10%', justifyContent: 'center' }}
                /> */}
                    <TouchableOpacity onPress={deleteMails} style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="delete" size={24} color={GlobalStyles[theme]?.fontColor} />
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        height: '100%',
                        width: windowWidth * 0.85,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}>
                        <Text style={{
                            width: '20%',
                            paddingLeft: 10,
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                        }}>
                            {trans[language]?.FROM}:
                        </Text>
                        <Text style={{
                            width: '50%',
                            paddingLeft: 10,
                            marginLeft: 10,
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                        }}>
                            {trans[language]?.SUBJECT}
                        </Text>
                        <Text style={{
                            paddingLeft: 10,
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                        }}>
                            {trans[language]?.DATE}:
                        </Text>
                        <TouchableOpacity onPress={() => setModalAlert(true)}>
                            <FontAwesome name="question-circle-o" size={25} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <ScrollView style={{ flex: 1, borderColor: "black", borderBottomWidth: 0.5, borderStyle: 'solid', }}>
                        {myMails?.map((mail, index) =>
                            mail.isDeleted === false && (
                                <View style={[{
                                    flexDirection: 'row',
                                    height: 50,
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderStyle: 'solid',
                                    borderColor: "black",
                                    borderBottomWidth: 0.5,
                                    backgroundColor: GlobalStyles[theme]?.paperColor,
                                },
                                (index === myMails?.length - 1) &&
                                {
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                    borderBottomWidth: 0,
                                },
                                ]} key={uuid.v4()}>
                                    <TouchableOpacity onPress={() => addToDelList(mail._id)} style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                                        <View
                                            style={{ width: 25, height: 25, borderRadius: 20, borderWidth: 2, borderColor: GlobalStyles[theme]?.buttonColor, alignItems: 'center', justifyContent: 'center' }}>
                                            <Entypo name="check" size={25} ref={el => myRefs.current[mail._id] = el} color="white" style={{ width: 25, height: 25, textAlign: 'center', opacity: 0, borderRadius: 20, borderWidth: 1, borderColor: GlobalStyles[theme]?.buttonColor }} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => showMail(mail)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', width: windowWidth * 0.85, height: '100%' }}>
                                        <Text style={[{
                                            marginLeft: 10,
                                            width: '20%',
                                            color: GlobalStyles[theme]?.fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                        },
                                        mail?.isOpen ? { fontWeight: '400' } : { fontWeight: '700' }]}>
                                            {mail.senderName}
                                        </Text>
                                        <Text style={[{
                                            marginLeft: 10,
                                            width: '50%',
                                            color: GlobalStyles[theme]?.fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                        },
                                        mail?.isOpen ? { fontWeight: '400' } : { fontWeight: '700' }]}>
                                            {/* // TODO  check how long can be the subject string , to add hidden + ... or scrollView Horizontal*/}
                                            {mail.subject}
                                        </Text>
                                        <Text style={[{
                                            color: GlobalStyles[theme]?.fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                        },
                                        mail?.isOpen ? { fontWeight: '400' } : { fontWeight: '700' }]}>
                                            {mail.date.split('T')[0]}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                    </ScrollView>
                </View >

                <PopupModal message={redux?.myMail?.message} popupModal={popupModal} />

                {/* // Read Mail Modal //  */}
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={modalVisible2}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: GlobalStyles[theme]?.background,
                        // marginTop: 22,
                    }}>
                        <View style={[{
                            borderRadius: 10,
                            padding: 20,
                            paddingTop: 50,
                            alignItems: 'center',
                            // shadowColor: 'white',
                            // shadowOffset: {
                            //     width: 0,
                            //     height: 2,
                            // },
                            // shadowOpacity: 0.25,
                            // shadowRadius: 4,
                            elevation: 5,
                            height: 500,
                            width: 350,
                            borderWidth: 0.5,
                            alignItems: 'flex-start',
                        },
                        {
                            backgroundColor: GlobalStyles[theme]?.background,
                            borderColor: GlobalStyles[theme]?.borderColor,
                        }
                        ]}>
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
                                    setModalVisible2(!modalVisible2)
                                    dispatch(getMyMails(redux?.auth?.authData?.result?._id))
                                }}>
                                <EvilIcons name="close-o" size={30} color="red" />
                            </TouchableOpacity>

                            <View style={{
                                flexDirection: 'row',
                                height: 40,
                                width: '100%',
                                borderRadius: 10,
                                paddingLeft: 10,
                                marginBottom: 10,
                                backgroundColor: GlobalStyles[theme]?.paperColor,
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    textAlignVertical: 'center',
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {trans[language]?.FROM}:
                                </Text>
                                <Text style={{
                                    paddingLeft: 40,
                                    fontSize: 14,
                                    textAlignVertical: 'center',
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {mailToShow.senderName}
                                </Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                height: 40,
                                width: '100%',
                                borderRadius: 10,
                                paddingLeft: 10,
                                marginBottom: 10,
                                backgroundColor: GlobalStyles[theme]?.paperColor,
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    textAlignVertical: 'center',
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {trans[language]?.SUBJECT}
                                </Text>
                                <Text style={{
                                    paddingLeft: 24,
                                    fontSize: 14,
                                    textAlignVertical: 'center',
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {mailToShow.subject}
                                </Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                height: 40,
                                width: '100%',
                                borderRadius: 10,
                                paddingLeft: 10,
                                marginBottom: 10,
                                backgroundColor: GlobalStyles[theme]?.paperColor,
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    textAlignVertical: 'center',
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {trans[language]?.MESSAGE}
                                </Text>
                                <Text style={{
                                    paddingLeft: 15,
                                    fontSize: 14,
                                    textAlignVertical: 'center',
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {mailToShow.message}
                                </Text>
                            </View>
                        </View>
                        {/* TODO add button to answer the mail, will open the compose mail with the sender fix */}
                        {/* button or icon with arrow */}
                        <TouchableOpacity
                            style={[{
                                borderRadius: 10,
                                elevation: 2,
                                paddingHorizontal: 20,
                                marginTop: 20,
                                paddingVertical: 10
                            }, { backgroundColor: GlobalStyles[theme]?.buttonColor }]}
                            onPress={() => {
                                setModalVisible2(!modalVisible2)
                                setModalVisible(true)
                                mailForm.reciverName
                                setMailForm({...mailForm, reciverName: mailToShow.senderName, reciverId: mailToShow.senderId})
                            }}>
                            <Text style={[{
                                textAlign: 'center',
                            }, {
                                borderColor: GlobalStyles[theme]?.borderColor,
                                color: GlobalStyles[theme]?.fontColor,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                            }]}>
                                {trans[language]?.RESPOND_MAIL}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {/* </View> */}

                {/* // Compose Mail Modal //  */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                // onRequestClose={() => {
                //     Alert.alert(trans[language]?.MAIL_SENT);
                //     setModalVisible(!modalVisible);
                // }}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={[{
                            height: 500,
                            width: 350,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 35,
                            paddingBottom: 35,
                            paddingTop: 10,
                            borderRadius: 10,
                            borderWidth: 0.5,
                            elevation: 5,
                        }, {
                            borderColor: GlobalStyles[theme]?.borderColor,
                            backgroundColor: GlobalStyles[theme]?.background
                        }]}>

                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}
                                style={{
                                    width: "120%",
                                    alignItems: 'flex-end',
                                    marginTop: 10,
                                    marginRight: 10,
                                    marginBottom: 0,
                                    // borderColor: 'black',
                                    // borderWidth: 1
                                }}>
                                <EvilIcons name="close-o" size={30} color="red" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModalVisible3(true)}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    borderRadius: 10,
                                    backgroundColor: GlobalStyles[theme]?.paperColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                <Text style={{
                                    textAlign: 'left',
                                    paddingLeft: 15,
                                    textAlignVertical: 'center',
                                    height: "100%",
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                    color: GlobalStyles[theme]?.fontColor,
                                }}>
                                    {mailForm.reciverName ? mailForm.reciverName : trans[language]?.TO + ":"}
                                </Text>
                            </TouchableOpacity>

                            <TextInput
                                placeholder={trans[language]?.SUBJECT}
                                placeholderTextColor={GlobalStyles[theme]?.fontColor}
                                style={{
                                    width: "100%",
                                    height: 40,
                                    // borderBottomWidth: 2,
                                    borderStyle: 'solid',
                                    // borderColor: 'black',
                                    borderRadius: 10,
                                    marginVertical: 10,
                                    paddingLeft: 15,
                                    color: GlobalStyles[theme]?.fontColor,
                                    backgroundColor: GlobalStyles[theme]?.paperColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}
                                onChangeText={(text) => onChange('subject', text)}
                                value={mailForm.subject}
                            />

                            <TextInput
                                placeholder={trans[language]?.MESSAGE}
                                placeholderTextColor={GlobalStyles[theme]?.fontColor}
                                style={{
                                    width: "100%",
                                    height: 250,
                                    borderRadius: 10,
                                    marginBottom: 20,
                                    textAlignVertical: 'top',
                                    paddingTop: 5,
                                    paddingLeft: 15,
                                    color: GlobalStyles[theme]?.fontColor,
                                    backgroundColor: GlobalStyles[theme]?.paperColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                    // borderWidth: 1,
                                    // borderStyle: 'solid',
                                    // borderColor: 'black',
                                    // paddingLeft: 10,
                                }}
                                onChangeText={(text) => onChange('message', text)}
                                value={mailForm.message}
                                multiline
                                numberOfLines={4}
                            />

                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    style={[{
                                        borderRadius: 10,
                                        elevation: 2,
                                        paddingHorizontal: 20,
                                        paddingVertical: 10
                                    }, {
                                        borderWidth: 0.5,
                                        borderColor: GlobalStyles[theme]?.borderColor,
                                        backgroundColor: GlobalStyles[theme]?.noColor
                                    }]}
                                    onPress={() => setMailForm(initialMailForm)}>
                                    <Text style={[{
                                        color: 'white',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                    }, {
                                        color: GlobalStyles[theme]?.fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                    }]}>
                                        {trans[language]?.CLEAR_MAIL}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[{
                                        borderRadius: 10,
                                        elevation: 2,
                                        paddingHorizontal: 20,
                                        paddingVertical: 10
                                    }, {
                                        borderWidth: 0.5,
                                        borderColor: GlobalStyles[theme]?.borderColor,
                                        backgroundColor: GlobalStyles[theme]?.yesColor
                                    }]}
                                    onPress={() => sendMailFunc()}>
                                    <Text style={[{
                                        textAlign: 'center',
                                    }, {
                                        color: GlobalStyles[theme]?.fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                    }]}>
                                        {trans[language]?.SEND_MAIL}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* // user to mail Modal // */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible3}>

                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <View style={[{
                            borderRadius: 10,
                            // maxHeight: 400,
                            padding: 20,
                            paddingTop: 50,
                            alignItems: "center",
                            elevation: 5,
                            borderWidth: 0.5,
                            height: 500,
                            width: 350,
                        }, {
                            borderColor: GlobalStyles[theme]?.borderColor,
                            backgroundColor: GlobalStyles[theme]?.background
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
                                    setModalVisible3(false)
                                    setSearchResult([])
                                }}>
                                <EvilIcons name="close-o" size={30} color="red" />
                            </TouchableOpacity>
                            <TextInput
                                style={{
                                    width: 300,
                                    height: 40,
                                    paddingLeft: 10,
                                    marginBottom: 5,
                                    borderRadius: 10,
                                    borderWidth: 0.5,
                                    borderColor: GlobalStyles[theme]?.borderColor,
                                    backgroundColor: GlobalStyles[theme]?.paperColor,
                                }}
                                placeholder={trans[language]?.SEARCH}
                                placeholderTextColor={GlobalStyles[theme]?.fontColor}
                                onChangeText={(text) => modalSearch(text)}
                            />
                            <FlatList
                                data={searchResult?.length !== 0 ? searchResult : otherUsersList}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <TouchableOpacity
                                    style={[{
                                        width: 300,
                                        paddingHorizontal: 20,
                                        paddingVertical: 10,
                                        marginVertical: 5,
                                        borderRadius: 10,
                                        borderWidth: 0.5,
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
                                        onPress={() => onChange('reciverName', item.value)}
                                    >
                                        {item.value}
                                    </Text>
                                </TouchableOpacity>
                                }
                                keyExtractor={item => item.key + item.value + Math.random()}
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
                            width: 300,
                            maxHeight: 400,
                            alignItems: "flex-start",
                            padding: 30,
                            paddingBottom: 45,
                            borderWidth: 0.5,
                            borderRadius: 10,
                            elevation: 5,
                        }, {
                            borderColor: GlobalStyles[theme]?.borderColor,
                            backgroundColor: GlobalStyles[theme]?.paperColor
                        }]}>
                            <Text style={{
                                fontSize: 16,
                                marginBottom: 10,
                                color: GlobalStyles[theme]?.fontColor,
                            }}>
                                {trans[language]?.DONT_FORGET}
                            </Text><Text style={{
                                fontSize: 16,
                                color: GlobalStyles[theme]?.fontColor,
                            }}>
                                {trans[language]?.EMAIL_WILL_DEL}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    width: "100%",
                                    alignItems: 'flex-end',
                                    marginBottom: 20,
                                    marginRight: 20,
                                    bottom: 0,
                                    right: 0,
                                }}
                                onPress={() => { setModalAlert(false) }}>
                                <Text style={{ color: GlobalStyles[theme]?.buttonColor, fontSize: 16 }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* // ADD Recipient Alert// */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalAlert1}>

                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <View style={[{
                            width: 300,
                            maxHeight: 400,
                            alignItems: "flex-start",
                            padding: 30,
                            paddingBottom: 45,
                            borderWidth: 0.5,
                            borderRadius: 10,
                            elevation: 5,
                        }, {
                            borderColor: GlobalStyles[theme]?.borderColor,
                            backgroundColor: GlobalStyles[theme]?.paperColor
                        }]}>
                            <Text style={{
                                fontSize: 16,
                                marginBottom: 10,
                                color: GlobalStyles[theme]?.fontColor,
                            }}>
                                {trans[language]?.PLEASE_ADD_THE_RECIPIENT}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    width: "100%",
                                    alignItems: 'flex-end',
                                    marginBottom: 20,
                                    marginRight: 20,
                                    bottom: 0,
                                    right: 0,
                                }}
                                onPress={() => { setModalAlert1(false) }}>
                                <Text style={{ color: GlobalStyles[theme]?.buttonColor, fontSize: 16 }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView >
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({});