import React, { useState, useEffect, useCallback } from 'react'
import { useIsFocused } from '@react-navigation/native';

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
    RefreshControl,
    ImageBackground,
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo } from '../../Redux/actions/auth'

import { createMyMail, getMyMails, getSendedMails, deleteMyMail, mailView } from '../../Redux/actions/mymails';

import Constants from 'expo-constants';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SelectList } from 'react-native-dropdown-select-list';
import PopupModal from '../../components/PopupModal';

import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';
import Banner from '../../components/Banner';

import GlobalStyles from '../../GlobalStyles';

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

const otherUsersList = []
export default function MyMails({ navigation }) {
    const myRefs = React.useRef([]);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [popupModal, setPopupModal] = useState(false)
    const [userInfo, setUserInfo] = useState()
    const [allSelected, setAllSelected] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [mailForm, setMailForm] = useState(initialMailForm);
    const [mailToShow, setMailtoShow] = useState('');
    const [selected, setSelected] = useState('');
    const [listToDelete, setListToDelete] = useState([])
    const [checkboxState, setCheckboxState] = useState([])
    const [myMails, setMyMails] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [theme, setTheme] = useState("stylesLight")

    console.log("MyMails GlobalStyles", GlobalStyles)
    console.log("MyMails GlobalStyles", GlobalStyles[theme])

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        navigation.addListener('focus', () => setListToDelete([]))
    }, [])

    const redux = useSelector(state => state)
    console.log("redux.auth.authData.result", redux.auth.authData.result.userName, redux.auth.authData.result._id)
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
        console.log("MyMails redux.auth.authData.result._id", redux.auth.authData.result._id)
        dispatch(getMyMails(redux.auth.authData.result._id))
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
        listToDelete.map(item => myRefs.current[item].setNativeProps({ style: { backgroundColor: GlobalStyles[theme].buttonColor, opacity: 1 } }))
    }, [listToDelete])

    const deleteMails = () => {
        dispatch(deleteMyMail(redux.auth.authData.result?._id, listToDelete))
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
    };

    const showMail = (mail) => {
        setMailtoShow(mail);
        setModalVisible2(true);
        dispatch(mailView(mail._id))
    };

    const sendMailFunc = () => {
        if (mailForm.reciverName === "") {
            Alert.alert('Please add the recipient!!!')
        } else {
            dispatch(createMyMail(mailForm))
            dispatch(getMyMails(redux.auth.authData.result._id))
            setMailForm(initialMailForm)
            setModalVisible(!modalVisible);
            onRefresh()
        }
        // userInfo._id === mailForm.reciverId
        //     ? myMail2.unshift(mailForm)
        //     : console.log('null');
    };

    return (
        <KeyboardAvoidingView
            // style={styles.container}
            style={[styles.container, { backgroundColor: GlobalStyles[theme].background }]}

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
                <Banner title="My Mails" />

                {/* <View
                    style={{
                        flexDirection: 'row',
                        width: 330,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginBottom: 20
                    }}> */}
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            // width: 150,
                            paddingHorizontal: 20,
                            paddingVertical: 15,
                            // height: 50,
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: 10,
                            backgroundColor: GlobalStyles[theme].buttonColor
                        }}>
                        <Feather name="edit-3" size={24} color="black" />
                        <Text style={{ marginLeft: 15, color: 'white', fontWeight: "500", fontSize: 16 }}>Compose</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={deleteMails}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity> */}

                {/* </View> */}

                <View style={{ 
                    justifyContent: 'center', 
                    flexDirection: 'row', 
                    height: 40, 
                    width: '100%', 
                    borderColor: "black", 
                    borderBottomWidth: 1, 
                    borderStyle: 'solid', 
                    alignItems: 'center' ,
                    marginTop: 10,
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
                    <TouchableOpacity onPress={deleteMails} style={{ width: '10%', justifyContent: 'center',alignItems: 'center' }}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', width: windowWidth * 0.85, height: '100%' }}>
                        <Text style={{ width: '20%', paddingLeft: 10, fontWeight: '500' }}>From:</Text>
                        <Text style={{ marginLeft: 10, width: '50%', paddingLeft: 10, fontWeight: '500' }}>Subject:</Text>
                        <Text style={{  paddingLeft: 10, fontWeight: '500' }}>Date:</Text>
                        <TouchableOpacity onPress={() => Alert.alert(
                            `Don't forget to read your e-mails.`,
                            `E-mails will be automatically deleted\nafter 30 days!`,
                        )}>
                            <FontAwesome name="question-circle-o" size={25} color="black" style={{ width: 40, textAlign: 'center' }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <ScrollView style={{ flex: 1, borderColor: "black", borderBottomWidth: 0.5, borderStyle: 'solid', }}>
                        {myMails?.map(mail =>
                            mail.isDeleted === false && (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, borderStyle: 'solid', borderColor: "black", borderBottomWidth: 0.5, width: '100%' }} key={uuid.v4()}>
                                    <TouchableOpacity onPress={() => addToDelList(mail._id)} style={{ width: '10%',justifyContent: 'center',alignItems: 'center'}}>
                                        <View
                                            style={{ width: 25, height: 25, borderRadius: 20, borderWidth: 2, borderColor: GlobalStyles[theme].buttonColor, alignItems: 'center', justifyContent: 'center'}}>
                                            <Entypo name="check" size={25} ref={el => myRefs.current[mail._id] = el} color="white" style={{ width: 25, height: 25, textAlign: 'center', opacity: 0, borderRadius: 20, borderWidth: 1, borderColor: GlobalStyles[theme].buttonColor }} />
                                        </View>
                                    </TouchableOpacity>
                                    <Pressable onPress={() => showMail(mail)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', width: windowWidth * 0.85, height: '100%' }}>
                                        <Text style={[{ marginLeft: 10, width: '20%' }, mail?.isOpen ? { fontWeight: '400' } : { fontWeight: '700' }]}>{mail.senderName}</Text>
                                        <Text style={[{ marginLeft: 10, width: '50%' }, mail?.isOpen ? { fontWeight: '400' } : { fontWeight: '700' }]}>{mail.subject}</Text>
                                        <Text style={[mail?.isOpen ? { fontWeight: '400' } : { fontWeight: '700' }]}>{mail.date.split('T')[0]}</Text>
                                    </Pressable>
                                </View>
                            )
                        )}
                    </ScrollView>
                </View >

                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Mail sended.');
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}
                                    style={{
                                        width: "120%",
                                        alignItems: 'flex-end',
                                        marginTop: 0,
                                        marginRight: 0,
                                        marginBottom: 0,
                                        // borderColor: 'black',
                                        // borderWidth: 1
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="black" />
                                </TouchableOpacity>
                                <SelectList
                                    onSelect={() => onChange('reciverName', selected)}
                                    setSelected={setSelected}
                                    // placeholder="To:"
                                    placeholder={mailForm.reciverName ? mailForm.reciverName : "To:"}

                                    maxHeight="150"
                                    data={otherUsersList}
                                    search={true}
                                    // fontFamily="lato"
                                    save="value"
                                    boxStyles={{
                                        width: 300,
                                        borderWidth: 0,
                                        borderBottomWidth: 2,
                                        borderStyle: 'solid',
                                        borderColor: 'black',
                                    }}
                                    dropdownItemStyles={{
                                        width: 250,
                                        marginBottom: 10,
                                    }}
                                    dropdownStyles={{
                                        width: windowWidth * 0.75,
                                        alignSelf: 'center',
                                        backgroundColor: 'white',
                                        position: 'absolute',
                                        elevation: 10,
                                        zIndex: 10,
                                        top: 40
                                    }}
                                    dropdownTextStyles={{
                                        // backgroundColor: 'red'
                                    }}
                                // arrowicon={
                                //   <FontAwesome name="chevron-down" size={12} color={'black'} />
                                // }
                                // searchicon={
                                //   <FontAwesome name="search" size={12} color={'black'} />
                                // }
                                />

                                <TextInput
                                    placeholder="Subject:"
                                    style={{
                                        width: 300,
                                        borderBottomWidth: 2,
                                        borderStyle: 'solid',
                                        borderColor: 'black',
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        // marginTop: 50,
                                        height: 50,
                                        paddingLeft: 10,
                                    }}
                                    onChangeText={(text) => onChange('subject', text)}
                                    value={mailForm.subject}
                                />
                                <TextInput
                                    placeholder="Message:"
                                    style={{
                                        width: '100%',
                                        // borderWidth: 1,
                                        // borderStyle: 'solid',
                                        // borderColor: 'black',
                                        borderRadius: 15,
                                        marginBottom: 10,
                                        // paddingLeft: 10,
                                        textAlignVertical: 'top',
                                        height: 250,
                                    }}
                                    onChangeText={(text) => onChange('message', text)}
                                    value={mailForm.message}
                                    multiline
                                    numberOfLines={4}
                                />
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <Pressable
                                        style={[styles.button, { backgroundColor: GlobalStyles[theme].noColor }]}
                                        onPress={() => setMailForm(initialMailForm)}>
                                        <Text style={styles.textStyle}>Clear Mail</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, { backgroundColor: GlobalStyles[theme].yesColor }]}
                                        onPress={() => sendMailFunc()}>
                                        <Text style={styles.textStyle}>Send Mail</Text>
                                    </Pressable>
                                </View>
                                {/* <View style={{ flexDirection: 'row' }}>

                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => console.log(mailForm)}>
                                    <Text style={styles.textStyle}>Mail Form</Text>
                                </Pressable>
                            </View> */}

                            </View>
                        </View>
                    </Modal>
                </View>

                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible2}
                        onRequestClose={() => {
                            Alert.alert('Mail sended.');
                            setModalVisible(!modalVisible2);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView, { alignItems: 'flex-start' }]}>
                                <Text>From: {mailToShow.userName}</Text>
                                <Text>Subject: {mailToShow.subject}</Text>
                                <Text>Message: {mailToShow.message}</Text>
                            </View>
                            <Pressable
                                style={[styles.button,{marginTop: 20 ,backgroundColor: GlobalStyles[theme].buttonColor}]}
                                onPress={() => {
                                    setModalVisible2(!modalVisible2)
                                    dispatch(getMyMails(redux.auth.authData.result._id))
                                }}>
                                <Text style={styles.textStyle}>Close Mail</Text>
                            </Pressable>
                        </View>
                    </Modal>
                </View>

                <PopupModal message={redux?.myMail?.message} popupModal={popupModal} />

            </ScrollView >
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ecf0f1',
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 35,
        paddingBottom: 35,
        paddingTop: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 500,
        width: 350,
    },
    button: {
        borderRadius: 20,
        elevation: 2,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    textStyle: {
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        // backgroundColor: 'grey',
        width: '100%',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
    },
});