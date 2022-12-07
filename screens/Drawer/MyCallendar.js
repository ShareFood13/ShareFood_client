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
    date: "",
    freeText: "",
    howManyGuests: 0,
    name: "",
    occasion: "",
    status: "Public",
    time: "",
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
    const [showPicker, setShowPicker] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);
    const [type, setType] = useState()
    const [user, setUser] = useState()
    // const [eventList, setEventList] = useState()

    const dispatch = useDispatch();

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const result = JSON.parse(await AsyncStorage.getItem('profile'))
        setUser(result.result._id)
    }

    const eventList = useSelector((state) => state.event.events)

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
        alarm2 ?
            setEventForm({
                ...eventForm, date: date.toISOString().split("T")[0], time: date.toLocaleTimeString('he-IL').slice(0, 5), creatorId: user,
                alarm: { isAlarm: alarm2, alarmDate: alarmDate.toISOString().split("T")[0], alarmTime: alarmDate.toLocaleTimeString('he-IL').slice(0, 5) }
            })
            : setEventForm({
                ...eventForm, date: date.toISOString().split("T")[0], time: date.toLocaleTimeString('he-IL').slice(0, 5), creatorId: user,
                alarm: { isAlarm: alarm2, alarmDate: "", alarmTime: "" }
            })
    }, [date, alarmDate, alarm2])


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        if (type === "event") {
            setDate(currentDate)
        } else {
            setAlarmDate(currentDate)
        }
        setType("")
        console.log('====================================');
        console.log("onChangeFn");
        console.log('====================================');
        setShowPicker(false);
        setShowPicker2(false);
    };

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
    };

    const showDatepicker = (event) => {
        setType(event)
        showMode('date');
        event === "event" ? setShowPicker(true) : setShowPicker2(true)
    };

    const showTimepicker = (event) => {
        setType(event)
        showMode('time');
        event === "event" ? setShowPicker(true) : setShowPicker2(true)
    };

    const handleOnChange = (name, text) => {
        setEventForm({ ...eventForm, [name]: text })
    }

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
        console.log(eventForm);
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

    const closeModal = () => {
        // setEventForm(initialValue)
        setModalVisible(false)
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        loadItems()
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const openShowEventDetail = (item) => {
        navigation.push('ShowEventDetail', { item: item })
    }

    const loadItems = () => {

        var date = new Date();
        var timestamp = date.getTime();
        setTimeout(() => {
            for (let i = -15; i < 15; i++) {

                // const time = day.timestamp + (i + 30) * 24 * 60 * 60 * 1000;
                const time = timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                // if (!items[strTime]) {
                items[strTime] = [];

                // eventList?.map(item => console.log(item.date === strTime))
                eventList?.map(item => (item.date === strTime) &&
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

    // console.log("eventForm", eventForm);
    // console.log("alarmDate", alarmDate);

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => openShowEventDetail(item)}>
                <Card>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text>{item.name}</Text>
                                <Text>{item.occasion}</Text>
                                <Text>{item.time}</Text>
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

    return (

        < View style={styles.container} >
            <Button title='Add new Event' onPress={() => setModalVisible(true)} />
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
                showClosingKnob={false}
                refreshing={true}
                renderItem={renderItem}
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
                            value={eventForm.name}
                            onChangeText={text => handleOnChange('name', text)} />

                        <View style={styles.outPuts}>
                            <Text style={{ width: "80%" }}>
                                Event day: {date?.toISOString().split("T")[0]}
                            </Text>
                            <TouchableOpacity style={{ width: "20%", alignItems: 'center', justifyContent: 'center' }} onPress={() => showDatepicker("event")}>
                                <Ionicons name="calendar-outline" size={30} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.outPuts}>
                            <Text style={{ width: "80%" }}>
                                Event time: {date?.toLocaleTimeString('he-IL')}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    width: "20%",
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => showTimepicker("event")}>
                                <MaterialCommunityIcons name="clock-time-three-outline" size={30} color="black" />
                            </TouchableOpacity>
                        </View>

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
                        {alarm2 && <View>
                            <View style={styles.outPuts}>
                                <Text style={{ width: "80%" }}>
                                    Alert day: {alarmDate?.toISOString().split("T")[0]}
                                </Text>
                                <TouchableOpacity style={{ width: "20%", alignItems: 'center', justifyContent: 'center' }} onPress={() => showDatepicker("alarm")}>
                                    <Ionicons name="calendar-outline" size={30} color="black" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.outPuts}>
                                <Text style={{ width: "80%" }}>
                                    Alert time: {alarmDate?.toLocaleTimeString('he-IL')}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        width: "20%",
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => showTimepicker("alarm")}>
                                    <MaterialCommunityIcons name="clock-time-three-outline" size={30} color="black" />
                                </TouchableOpacity>
                            </View>
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
                            </TouchableOpacity>}

                        {showPicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            // display='spinner'
                            />
                        )}
                        {showPicker2 && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={alarmDate}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            // display='spinner'
                            />
                        )}
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