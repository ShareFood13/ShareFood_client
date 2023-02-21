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

import { createMyMail, getMyMails, getSendedMails, deleteMyMail } from '../../Redux/actions/mymails';

import Constants from 'expo-constants';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SelectList } from 'react-native-dropdown-select-list';
import PopupModal from '../../components/PopupModal';

import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';

const initialMailForm = {
    // mailId: '',
    senderId: '',
    senderName: '',
    reciverId: '',
    reciverName: '',
    subject: '',
    message: '',
    // date: '2012-12-29',
    isDeleted: false,
};

const otherUsersList = []
export default function MyMails({ navigation }) {

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [popupModal, setPopupModal] = useState(false)
    const [userInfo, setUserInfo] = useState()
    const [allSelected, setAllSelected] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [mailForm, setMailForm] = useState(initialMailForm);
    const [mailToShow, setMailtoShow] = useState('');
    const [selected, setSelected] = React.useState('');
    const [listToDelete, setListToDelete] = useState([])


    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;


    const redux = useSelector(state => state)
    const myMails = redux?.myMail?.myMails
    // const myMails = useSelector((state) => state.myMail.myMails)

    // console.log('MyMails redux', redux)

    useEffect(() => {
        redux?.other?.otherUsers.map(user => !redux?.auth?.authData?.result?.profile?.following?.includes(user._id) &&
            otherUsersList.push({ key: user._id, _id: user._id, value: user.userName }))
    }, [])

    useEffect(() => {
        if (redux?.myMail?.message) {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
            }, 2500)
        }
    }, [redux])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserInfo(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    useEffect(() => {
        userInfo && dispatch(getMyMails(userInfo?.userId))
    }, [userInfo])

    const addToDelList = (_id, isChecked) => {
        console.log(_id, isChecked)
        if (isChecked) {
            !listToDelete.includes(_id) && setListToDelete([...listToDelete, _id])
            // listToDelete.unshift(_id);
        } else {
            var newListToDelete = []
            newListToDelete = listToDelete.filter((item) => item !== _id);
            setListToDelete(newListToDelete)
        }
    };
    useEffect(() => {
        listToDelete.length === myMails.length ? setAllSelected(true) : setAllSelected(false)
    }, [listToDelete])


    const deleteMails = () => {
        // console.log(listToDelete)
        // dispatch(deleteMyMail(userInfo?.result._id, listToDelete))
        // myMail2.map((mail) =>
        //     listToDelete.map((item) =>
        //         item === mail.mailId ? (mail.isDeleted = true) : null
        //     )
        // )
    };

    const selectAllMails = (isChecked) => {
        // console.log(isChecked)
        setAllSelected(isChecked);
        if (isChecked) {
            var newListToDelete = []
            myMails.map(mail => !listToDelete.includes(mail._id) && newListToDelete.push(mail._id))
            setListToDelete([...listToDelete, ...newListToDelete])
        } else {
            setListToDelete([])
        }
    };

    console.log({ listToDelete })

    const onChange = (name, text) => {
        if (name === 'reciverName') {
            otherUsersList.map((friend) =>
                friend.value === text
                    ? setMailForm({
                        ...mailForm,
                        reciverName: friend.value,
                        reciverId: friend._id,
                        senderId: userInfo?.userId,
                        senderName: userInfo?.userUserName,
                    })
                    : console.log('null')
            );
        } else {
            setMailForm({
                ...mailForm,
                [name]: text,
                senderId: userInfo?.userId,
                senderName: userInfo?.userUserName,
            });
        }
    };

    const showMail = (mail) => {
        setMailtoShow(mail);
        setModalVisible2(true);
    };

    const sendMailFunc = () => {
        dispatch(createMyMail(mailForm))
        dispatch(getMyMails(userInfo?.userId))
        setModalVisible(!modalVisible);
        // userInfo._id === mailForm.reciverId
        //     ? myMail2.unshift(mailForm)
        //     : console.log('null');
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    width: 350,
                    justifyContent: 'space-between',
                }}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 150, height: 50, borderWidth: 1, borderStyle: 'solid', borderColor: 'black', borderRadius: 10, backgroundColor: 'cyan', marginBottom: 20 }}>
                    <Feather name="edit-3" size={24} color="black" />
                    <Text style={{ marginLeft: 15 }}>Compose</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={deleteMails}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={{ justifyContent: 'center', flexDirection: 'row', height: 50, width: windowWidth, borderColor: "black", borderBottomWidth: 1, borderStyle: 'solid' }}>
                <BouncyCheckbox
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
                    isChecked={allSelected}//
                    style={{ width: '10%', justifyContent: 'center' }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', width: windowWidth * 0.85, height: '100%' }}>
                    <Text style={{ width: '20%' }}>From:</Text>
                    <Text style={{ marginLeft: 10, width: '50%' }}>Subject:</Text>
                    <Text>Date:</Text>
                </View>
            </View>

            <View style={{ justifyContent: 'center' }}>
                <ScrollView style={{ height: 500, borderColor: "black", borderBottomWidth: 0.5, borderStyle: 'solid' }}>
                    {myMails?.map(
                        (mail) =>
                            mail.isDeleted === false && (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, borderStyle: 'solid', borderColor: "black", borderBottomWidth: 0.5 }} key={uuid.v4()}>
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor="cyan"
                                        unfillColor="#FFFFFF"
                                        iconStyle={{ borderColor: 'cyan' }}
                                        innerIconStyle={{ borderWidth: 2 }}
                                        // textStyle={{ fontFamily: 'JosefinSans-Regular' }}
                                        onPress={(isChecked) => {
                                            addToDelList(mail._id, isChecked);
                                        }}
                                        isChecked={allSelected}
                                        disableText={true}
                                        style={{ width: '10%', justifyContent: 'center' }}
                                    />
                                    <Pressable onPress={() => showMail(mail)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center', width: windowWidth * 0.85, height: '100%' }}>
                                        <Text style={{ marginLeft: 10, width: '20%' }}>{mail.senderName}</Text>
                                        <Text style={{ marginLeft: 10, width: '50%' }}>{mail.subject}</Text>
                                        <Text>{mail.date.split('T')[0]}</Text>
                                    </Pressable>
                                </View>
                            )
                    )}
                </ScrollView>
            </View>

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
                            <SelectList
                                onSelect={() => onChange('reciverName', selected)}
                                setSelected={setSelected}
                                placeholder="To:"
                                maxHeight="150"
                                data={otherUsersList}
                                search={true}
                                // fontFamily="lato"
                                save="value"
                                boxStyles={{
                                    width: 300,
                                    borderWidth: 0,
                                    borderBottomWidth: 2,
                                    // marginBottom: 10,
                                    borderStyle: 'solid',
                                    borderColor: 'black',

                                    // position: 'absolute',
                                    // left: -150
                                }}
                                dropdownItemStyles={{
                                    width: 250,
                                    marginBottom: 10,
                                }}
                                dropdownStyles={{
                                    // position: 'absolute',
                                    // marginTop: 50,
                                    // width: 300,
                                    // backgroundColor: 'red',

                                    // position: 'absolute',
                                    // marginTop: 50,
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
                            <View style={{ flexDirection: 'row' }}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => sendMailFunc()}>
                                    <Text style={styles.textStyle}>Send Mail</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setMailForm(initialMailForm)}>
                                    <Text style={styles.textStyle}>Clear Mail</Text>
                                </Pressable>
                            </View>
                            <View style={{ flexDirection: 'row' }}>

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
                            </View>

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
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible2(!modalVisible2)}>
                            <Text style={styles.textStyle}>Close Mail</Text>
                        </Pressable>
                    </View>
                </Modal>
            </View>

            <PopupModal message={redux?.myMail?.message} popupModal={popupModal} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
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
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
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