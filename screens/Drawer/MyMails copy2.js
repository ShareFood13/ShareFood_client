import React, { useState, useEffect, useCallback } from 'react'

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

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo } from '../../Redux/actions/auth'

import { createMyMail, getMyMails, getSendedMails, deleteMyMail } from '../../Redux/actions/mymails';

import Constants from 'expo-constants';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SelectList } from 'react-native-dropdown-select-list';

const myFriends = [
    { key: '6', _id: '6384f0638b5328bd411aa02a', value: 'Shleper' },
    { key: '1', _id: '1234', value: 'User01' },
    { key: '2', _id: '1235', value: 'User02' },
    { key: '3', _id: '1236', value: 'User03' },
    { key: '4', _id: '1237', value: 'User04' },
    { key: '5', _id: '1238', value: 'User05' },
];

const myMail = [
    {
        mailId: 'm123',
        senderId: '1234',
        senderName: 'User01',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'first mail',
        message: ' first message',
        date: '2022-12-22',
        isDeleted: false,
    }, //Date.now() .unshift(
    {
        mailId: 'm124',
        senderId: '1236',
        senderName: 'User03',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'sec mail',
        message: ' sec message',
        date: '2022-12-20',
        isDeleted: false,
    },
    {
        mailId: 'm125',
        senderId: '1237',
        senderName: 'User04',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'third mail',
        message: ' third message',
        date: '2022-12-15',
        isDeleted: false,
    },
    {
        mailId: 'm126',
        senderId: '1236',
        senderName: 'User03',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'forth mail',
        message: ' forth message',
        date: '2022-12-12',
        isDeleted: false,
    },
    {
        mailId: 'm127',
        senderId: '1235',
        senderName: 'User02',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'fifth mail',
        message: ' fifth message',
        date: '2022-12-12',
        isDeleted: false,
    },
    {
        mailId: 'm128',
        senderId: '1238',
        senderName: 'User05',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'sixth mail',
        message: ' sixth message',
        date: '2022-12-10',
        isDeleted: false,
    },
    {
        mailId: 'm129',
        senderId: '1234',
        senderName: 'User01',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'seventh mail',
        message: ' seventh message',
        date: '2022-12-02',
        isDeleted: false,
    },
    {
        mailId: 'm130',
        senderId: '1234',
        senderName: 'User01',
        reciverId: '111',
        reciverName: 'Shleper',
        subject: 'eight mail',
        message: ' eight message',
        date: '2022-12-01',
        isDeleted: false,
    },
];

const initialMailForm = {
    // mailId: '',
    senderId: '',
    senderName: '',
    reciverId: '',
    reciverName: '',
    subject: '',
    message: '',
    isDeleted: false,
};

export default function MyMails({ navigation }) {

    const dispatch = useDispatch();

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [userInfo, setUserInfo] = useState()

    useEffect(() => {
        getUser()
        userInfo?.result._id !== undefined &&
            dispatch(getMyMails(userInfo?.result._id))

    }, [])

    const getUser = async () => {
        setUserInfo(JSON.parse(await AsyncStorage.getItem('profile')))
    }

    const myMails = useSelector((state) => state.myMail.myMails)

    const [allSelected, setAllSelected] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [mailForm, setMailForm] = useState(initialMailForm);
    const [mailToShow, setMailtoShow] = useState('');
    const [selected, setSelected] = React.useState('');
    const [listToDelete, setListToDelete] = useState([])

    const addToDelList = (_id, isChecked) => {
        if (isChecked) {
            !listToDelete.includes(_id) && setListToDelete([...listToDelete, _id])
        } else {
            const newListToDelete = []
            newListToDelete = listToDelete.filter((item) => item !== _id);
            setListToDelete(newListToDelete)
        }
    };

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
        setAllSelected(isChecked);
        myMails.map(mail => listToDelete.push(mail._id))
    };

    const onChange = (name, text) => {
        if (name === 'reciverName') {
            myFriends.map((friend) =>
                friend.value === text
                    ? setMailForm({
                        ...mailForm,
                        reciverName: friend.value,
                        reciverId: friend._id,
                        senderId: userInfo?.result._id,
                        senderName: userInfo?.result.userName,
                    })
                    : console.log('null')
            );
        } else {
            setMailForm({
                ...mailForm,
                [name]: text,
                senderId: userInfo?.result._id,
                senderName: userInfo?.result.userName,
            });
        }
    };

    const showMail = (mail) => {
        setMailtoShow(mail);
        setModalVisible2(true);
    };

    const sendMailFunc = () => {
        dispatch(createMyMail(mailForm))
        dispatch(getMyMails(userInfo?.result._id))
        // setModalVisible(!modalVisible);
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
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 150, height: 50, borderWidth: 1, borderStyle: 'solid', borderColor: 'black', borderRadius: 10, backgroundColor: 'cyan' }}>
                    <Feather name="edit-3" size={24} color="black" />
                    <Text style={{ marginLeft: 15 }}>Compose</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={deleteMails}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <Text></Text>
            <Text></Text>
            <Text></Text>

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
                                data={myFriends}
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