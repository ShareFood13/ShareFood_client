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

import { Agenda } from 'react-native-calendars';

import { Card } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';

import { createEvent, updateEvent, fetchEvents, deleteEvent } from '../../Redux/actions/events';

import SwitchButton from '../../components/SwitchButton'
import DatePicker2 from '../../components/DatePicker';

import SpSheet from '../../components/SpSheet';
import ShowShopList from "../../screens/pages/ShopList2"


const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

const initialValue = {
    alarm: {
        isAlarm: false,
        alarmDate: "",
        alarmTime: "",
    },
    eventDate: "",
    freeText: "",
    howManyGuests: 0,
    eventName: "",
    occasion: "",
    status: "Public",
    eventTime: "",
    creatorId: "",
}

const Mycallendar = ({ navigation }) => {
    const todayDate = new Date()

    const [alarm2, setAlarm2] = useState(false)
    const [alarmDate, setAlarmDate] = useState(todayDate)
    const [date, setDate] = useState(todayDate);
    const [eventForm, setEventForm] = useState(initialValue)
    const [items, setItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false)
    const [modalFromEdit, setModalFromEdit] = useState(false)
    const [mode, setMode] = useState('date');
    const [refreshing, setRefreshing] = useState(false);
    const [show, setShow] = useState("Public")
    const [showPicker, setShowPicker] = useState(true);
    // const [showPicker2, setShowPicker2] = useState(false);
    // const [showPicker3, setShowPicker3] = useState(false);
    const [type, setType] = useState()
    const [type2, setType2] = useState()
    const [user, setUser] = useState()

    ////////////
    // const [infoPicked, setInfoPicked] = useState();
    // const [showPickedInfo, setShowPickedInfo] = useState();
    // const [eventForm, setEventForm] = useState([]);
    const [fromToForm, setFromToForm] = useState({ fromDate: "", toDate: "" })

    const infoPickerFunction = (pickerType, selectedDate, formTypeInput) => {
        // console.log(pickerType, selectedDate, formTypeInput)
        // setShowPickedInfo(selectedDate)
        // setShowPickedInfo(
        //     pickerType === 'date'
        //         ? selectedDate.toISOString().split('T')[0]
        //         : selectedDate.toLocaleTimeString('he-IL')
        // );

        const info =
            pickerType === 'date'
                ? selectedDate.toISOString().split('T')[0]
                : selectedDate.toLocaleTimeString('he-IL');

        if (formTypeInput === "fromDate" || formTypeInput === "toDate") {
            setFromToForm({ ...fromToForm, [formTypeInput]: info })

        } else if (formTypeInput.includes("alarm")) {
            setEventForm({ ...eventForm, alarm: { ...eventForm.alarm, [formTypeInput]: info } });

        } else {
            setEventForm({ ...eventForm, [formTypeInput]: info, creatorId: user });
        }

    };
    ////////////////////

    const dispatch = useDispatch();

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const result = JSON.parse(await AsyncStorage.getItem('profile'))
        setUser(result.result._id)
    }

    const eventList = useSelector((state) => state.event.events)
    console.log(eventList)
    // console.log(user)

    useEffect(() => {
        dispatch(fetchEvents(user))
    }, [user])

    useEffect(() => {
        loadItems()
    }, [eventList])

    useEffect(() => {
        setEventForm({ ...eventForm, status: show })
    }, [show])

    useEffect(() => {
        setEventForm({ ...eventForm, alarm: { ...eventForm.alarm, isAlarm: alarm2 } });
    }, [alarm2])

    const handleOnChange = (name, text) => {
        setEventForm({ ...eventForm, [name]: text })
    }

    // CRUD EVENT /////////////////////////////////////////////////
    const addNewEvent = () => {
        dispatch(createEvent(eventForm))
        setModalVisible(false)
        dispatch(fetchEvents(user))
    }

    const editEvent = (event) => {
        setEventForm({ ...event })
        setModalVisible(true)
        setModalFromEdit(true)
    }

    const updatEvent = () => {
        // console.log(eventForm);
        dispatch(updateEvent(eventForm))
        dispatch(fetchEvents(user))
        setModalFromEdit(false)
        setModalVisible(false)

    }

    const delEvent = (event) => {
        // console.log(event._id);
        dispatch(deleteEvent(event._id))
        dispatch(fetchEvents(user))
    }

    ///////////////////////////////////////////////////////////////
    // REFRESH FUNCTIONS //////////////////////////////////////////
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        loadItems()
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    /////////////////////////////////////////////////////////////////
    const closeModal = () => {
        // setEventForm(initialValue)
        setModalVisible(false)
    }

    const openShowEventDetail = (item) => {
        navigation.push('ShowEventDetail', { item: item })
    }

    const loadItems = () => {

        var date = new Date();
        var timestamp = date.getTime();
        setTimeout(() => {
            for (let i = -30; i < 30; i++) {

                // const time = day.timestamp + (i + 30) * 24 * 60 * 60 * 1000;
                const time = timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                // if (!items[strTime]) {
                items[strTime] = [];

                // eventList?.map(item => console.log(item.date === strTime))
                eventList?.map(item => (item.eventDate === strTime) &&
                    items[strTime].push({ ...item, day: strTime }))
                // }
            }
            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setItems(newItems);
        }, 3000);
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => openShowEventDetail(item)}>
                <Card>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text>{item.eventName}</Text>
                                <Text>{item.occasion}</Text>
                                <Text>{item.eventTime}</Text>
                            </View>
                            <View style={{ height: 55, alignContent: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => editEvent(item)}>
                                    <Feather name="edit-3" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => Alert.alert(
                                    'Are you sure???',
                                    'You are permantly deleting this meal from your calendar!!!',
                                    [
                                        { text: "Cancel", },
                                        { text: "Delete", onPress: () => delEvent(item) }
                                    ])}>
                                    <AntDesign name="delete" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    }

    const createShopList = () => {
        var filter = [];

        eventList.map((event) =>
            event.eventDate >= fromToForm.fromDate && event.eventDate <= fromToForm.toDate
                ? filter.push(event.recipesId[0])
                // ? console.log(event.date)
                : null
        );

        var newMyRecipes = [];
        filter.map((myEvent) => {
            myEvent.ingredients.map((ingredient) => newMyRecipes.push(ingredient));
        });
        // console.log("newMyRecipes", newMyRecipes)

        navigation.navigate('ShowShopList', { recipe: filter, showType: "events" })
    }

    return (

        < View style={styles.container} >
            < View style={{ alignItems: 'center' }} >
                <View style={{ width: '100%', marginBottom: 10 }}>
                    <Button title='Add new Event' onPress={() => setModalVisible(true)} />
                </View>

                <SpSheet text={"Create Shop List"} heightValue={370} style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text>From Date:</Text>
                        <DatePicker2
                            pickerType="date"
                            // setInfoPicked={setInfoPicked}
                            infoPickerFunction={infoPickerFunction}
                            formTypeInput="fromDate"
                        />
                        <Text>To Date:</Text>
                        <DatePicker2
                            pickerType="date"
                            // setInfoPicked={setInfoPicked}
                            infoPickerFunction={infoPickerFunction}
                            formTypeInput="toDate"
                        />
                        <TouchableOpacity
                            style={[styles.genericButton, { width: 180 }]}
                            onPress={() => createShopList()}>
                            <Text>Create Shop List</Text>
                        </TouchableOpacity>
                    </View>
                </SpSheet>
            </View>

            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                // selected={todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate()}
                // selected={date}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />}
                showClosingKnob={true}
                refreshing={true}
                renderItem={renderItem}
                renderKnob={() => {
                    return <View style={{ borderColor: "red", borderStyle: 'solid', borderWidth: 2, width: 50, marginTop: 8, height: 10, backgroundColor: 'red', borderRadius: 10 }} />;
                }}
                calendarStyle={{ maxHeight: 650, }}
            // Agenda theme
            // theme={{
            //     agendaDayTextColor: 'yellow',
            //     agendaDayNumColor: 'green',
            //     agendaTodayColor: 'red',
            //     agendaKnobColor: 'blue'
            // }}
            // Agenda container style
            // style={{ height: 350, }}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <TouchableOpacity style={{
                            width: "100%",
                            alignItems: 'flex-end',
                            marginTop: 20,
                            marginRight: 40,
                            marginBottom: 20
                        }}
                            onPress={() => closeModal()}>
                            <EvilIcons name="close-o" size={30} color="black" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.outPuts}
                            placeholder="Event Name"
                            value={eventForm.eventName}
                            onChangeText={text => handleOnChange('eventName', text)} />

                        <DatePicker2
                            pickerType="date"
                            // setInfoPicked={setInfoPicked}
                            infoPickerFunction={infoPickerFunction}
                            formTypeInput="eventDate"
                        />
                        <DatePicker2
                            pickerType="time"
                            // setInfoPicked={setInfoPicked}
                            infoPickerFunction={infoPickerFunction}
                            formTypeInput="eventTime"
                        />

                        <TextInput
                            style={styles.outPuts}
                            placeholder="Occasion"
                            value={eventForm.occasion}
                            onChangeText={text => handleOnChange('occasion', text)} />

                        <TextInput
                            style={styles.outPuts}
                            placeholder="How many guests?"
                            keyboardType='numeric'
                            value={eventForm.howManyGuests}
                            onChangeText={text => handleOnChange('howManyGuests', text)} />

                        <TextInput
                            style={styles.outPuts}
                            placeholder="Free Text"
                            value={eventForm.freeText}
                            onChangeText={text => handleOnChange('freeText', text)} />

                        <SwitchButton text01="Public" text02="Private" show={show} setShow={setShow} />

                        <Pressable onPress={() => setAlarm2(!alarm2)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 52, height: 27, borderRadius: 25, borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid', justifyContent: 'center', marginRight: 10 }}>
                                <View style={{ width: 25, height: 25, borderRadius: 25, backgroundColor: alarm2 ? "green" : 'red', alignSelf: alarm2 ? 'flex-end' : 'flex-start', borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid', marginHorizontal: 1 }} />
                            </View>
                            <Text>Set Alarm</Text>
                        </Pressable>

                        {alarm2 && <View style={{ width: "100%", alignItems: 'center' }}>
                            <DatePicker2
                                pickerType="date"
                                // setInfoPicked={setInfoPicked}
                                infoPickerFunction={infoPickerFunction}
                                formTypeInput="alarmDate"
                            />
                            <DatePicker2
                                pickerType="time"
                                // setInfoPicked={setInfoPicked}
                                infoPickerFunction={infoPickerFunction}
                                formTypeInput="alarmTime"
                            />
                        </View>
                        }

                        {!modalFromEdit ?
                            <TouchableOpacity
                                style={styles.genericButton}
                                onPress={() => addNewEvent()}>
                                <Text style={{ color: 'white', fontWeight: '700' }}>Save</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity
                                style={styles.genericButton}
                                onPress={() => updatEvent()}>
                                <Text style={{ color: 'white', fontWeight: '700' }}>Update</Text>
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </Modal>
        </View >

    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 90
    },
    container: {
        flex: 1,
    },
    genericButton: {
        marginTop: 15,
        marginBottom: 30,
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
    item: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 10
    },
    modalView: {
        width: 300,
        minHeight: 450,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    outPuts: {
        width: "90%",
        height: 40,
        marginVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        paddingLeft: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20
    },
});

export default Mycallendar;