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

import { Agenda } from 'react-native-calendars';

import { Card } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';

import * as SecureStore from 'expo-secure-store';

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import { createEvent, updateEvent, fetchEvents, deleteEvent } from '../../Redux/actions/events';
import { Context } from '../../context/UserContext';

import SwitchButton from '../../components/SwitchButton'
import DatePicker2 from '../../components/DatePicker';

import SpSheet from '../../components/SpSheet';
import ShowShopList from "../../screens/pages/ShopList2"
import PopupModal from '../../components/PopupModal';
import { CLEAR_MSG } from "../../Redux/constants/constantsTypes.js"
import { useIsFocused } from '@react-navigation/native';

import { getMyRecipes } from '../../Redux/actions/recipes';
import Banner from '../../components/Banner';
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

const windowWidth = Dimensions.get('window').width

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

const initialValue = {
    alarm: {
        isAlarm: false,
        // alarmDate: "",
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

import trans from "../../Language"

var theme = ""
var language = ""
var fontStyle = ""
const Mycallendar = ({ navigation }) => {
    const todayDate = new Date()

    const [alarm2, setAlarm2] = useState(false)
    const [eventForm, setEventForm] = useState(initialValue)
    const [items, setItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false)
    const [modalAlert, setModalAlert] = useState(false)
    const [modalFromEdit, setModalFromEdit] = useState(false)
    const [itemDelete, setItemDelete] = useState({})
    const [refreshing, setRefreshing] = useState(false);
    const [show, setShow] = useState("Public")
    const [alarmDate, setAlarmDate] = useState(todayDate)
    // const [date, setDate] = useState(todayDate);
    // const [mode, setMode] = useState('date');
    // const [showPicker, setShowPicker] = useState(true);
    const [userId, setUserId] = useState()

    ////////////
    // const [infoPicked, setInfoPicked] = useState();
    // const [showPickedInfo, setShowPickedInfo] = useState();
    // const [eventForm, setEventForm] = useState([]);
    const [fromToForm, setFromToForm] = useState({ fromDate: "", toDate: "" })
    const [popupModal, setPopupModal] = useState(false)
    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()
    // const [language, setLanguage] = useState("en")
    // const [theme, setTheme] = useState('stylesLight')
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

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const redux = useSelector((state) => state)
    const eventList = redux?.event?.events

    const { userContext, setUserContext } = useContext(Context)

    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
            console.log(theme,language,fontStyle)
        }
    }, [userContext])
    // useEffect(
    //     () => navigation.addListener('focus', () => dispatch(fetchEvents(userId))),
    //     []
    // );

    useEffect(() => {
        // if (redux?.recipe.recipes) {
        //     setUserContext({ result: redux.event.events[0] })
        // }
        if (redux?.event.message) {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                // redux?.event.message.includes("Created") ?
                // navigation.navigate('MyBookStackScreen')
                navigation.navigate('Home1')
                // : onRefresh()
            }, 2500)
        }
    }, [redux?.event, isFocused])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    // useEffect(() => {
    //     if (userId !== undefined) {
    //         onRefresh()
    //         dispatch(fetchEvents(userId))
    //         dispatch(getMyRecipes(userId))
    //     }
    // }, [userId, isFocused])

    // REFRESH FUNCTIONS //////////////////////////////////////////
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        loadItems()
        setRefreshing(true);
        // dispatch(getMyRecipes(userId))
        wait(5000).then(() => setRefreshing(false))//.then(userId !== undefined && dispatch(getMyRecipes(userId)));
    }, []);

    ////////////////////////////

    const infoPickerFunction = (pickerType, selectedDate, formTypeInput) => {
        // console.log(pickerType, selectedDate, formTypeInput)
        const info =
            pickerType === 'date'
                ? selectedDate.toISOString().split('T')[0]
                : selectedDate.toLocaleTimeString('he-IL');

        // if (formTypeInput === "fromDate" || formTypeInput === "toDate") {
        //     console.log({ fromToForm })
        //     setFromToForm({ ...fromToForm, [formTypeInput]: info })
        if (formTypeInput === "fromDate") {
            setFromDate(info)
        } else if (formTypeInput === "toDate") {
            setToDate(info)
        } else if (formTypeInput.includes("alarm")) {
            setEventForm({ ...eventForm, alarm: { ...eventForm.alarm, [formTypeInput]: info } });

        } else {
            setEventForm({ ...eventForm, [formTypeInput]: info, creatorId: userId });
        }
    };
    // console.log("fromDate", fromDate)
    // console.log("toDate", toDate)
    ////////////////////
    useEffect(() => {
        eventList && loadItems()
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
        // dispatch(fetchEvents(userId))
        setEventForm(initialValue)
    }

    const editEvent = (event) => {
        setEventForm({ ...event })
        setModalVisible(true)
        setModalFromEdit(true)
    }

    const updatEvent = () => {
        dispatch(updateEvent(eventForm))
        // dispatch(fetchEvents(userId))
        setModalFromEdit(false)
        setModalVisible(false)

    }

    const delEvent = (event) => {
        dispatch(deleteEvent(event._id))
        // dispatch(fetchEvents(userId))
    }

    /////////////////////////////////////////////////////////////////
    const closeModal = () => {
        // setEventForm(initialValue)
        setModalVisible(false)
    }

    const openShowEventDetail = (item) => {
        navigation.push('ShowEventDetail', { eventData: item })
    }

    const loadItems = () => {

        var date = new Date();
        var timestamp = date.getTime();
        setTimeout(() => {
            for (let i = -60; i < 30; i++) {

                // const time = day.timestamp + (i + 30) * 24 * 60 * 60 * 1000;
                const time = timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                // if (!items[strTime]) {
                items[strTime] = [];

                // eventList?.map(item => console.log(item.date === strTime))
                eventList?.map(item => (item.eventDate === strTime) &&
                    items[strTime]?.push({ ...item, day: strTime }))
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
            <View style={{
                flex: 1,
                borderRadius: 10,
                padding: 3,
                marginRight: 10,
                marginTop: 10,
                borderWidth: 0.5,
                backgroundColor: GlobalStyles[theme]?.paperColor,
                borderColor: GlobalStyles[theme]?.borderColor,
                // backgroundColor: "white",
                // borderColor: "black",
            }} >
                <Card>
                    <Card.Content
                        style={{ backgroundColor: GlobalStyles[theme]?.paperColor }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ width: "90%" }} onPress={() => openShowEventDetail(item)}>
                                <Text style={{
                                    color: GlobalStyles[theme]?.fontColor,
                                    // color: "black",
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {item.eventName}
                                </Text>
                                <Text style={{
                                    color: GlobalStyles[theme]?.fontColor,
                                    // color: "black",
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {item.occasion}
                                </Text>
                                <Text style={{
                                    color: GlobalStyles[theme]?.fontColor,
                                    // color: "black",
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {item.eventTime.slice(0, 5)}
                                </Text>
                            </TouchableOpacity>

                            <View style={{ height: 55, alignContent: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => editEvent(item)}>
                                    <Feather name="edit-3" size={24}
                                        // color="black"
                                        color={GlobalStyles[theme]?.fontColor}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { setModalAlert(true); setItemDelete(item) }}>
                                    <AntDesign name="delete" size={24}
                                        // color="black"
                                        color={GlobalStyles[theme]?.fontColor}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View >
        );
    }

    const createShopList = () => {
        var filter = [];
        // console.log(fromToForm)
        // console.log(fromDate, " to ", toDate)
        // console.log("eventList", eventList)
        // eventList.map((event) =>
        //     event.eventDate >= fromToForm.fromDate && event.eventDate <= fromToForm.toDate
        //         ? filter.push(event.recipesId[0])
        //         : null
        // );

        // var newMyRecipes = [];
        // filter.map((myEvent) => {
        //     myEvent.ingredients.map((ingredient) => newMyRecipes.push(ingredient));
        // });

        // navigation.navigate('Main', { screen: 'ShowShopList', params: { recipe: filter, showType: "events", eventName: `${fromToForm.fromDate} to ${fromToForm.toDate}` } })
        eventList.map((event) =>
            event.eventDate >= fromDate && event.eventDate <= toDate
                ? event.recipesId.map(item => filter.push(item)) //filter.push(event.recipesId[0])
                : null
        );
        // console.log(filter)
        var newMyRecipes = [];
        // filter.map((myEvent) => {
        //     myEvent.ingredients.map((ingredient) => newMyRecipes.push(ingredient));
        // });
        filter.map(recipeId =>
            // userContext?.result?.recipesId.map
            redux?.recipe?.recipes?.map(item => {
                if (item._id === recipeId && item.isDeleted === false) {
                    newMyRecipes.push(item)
                    // item.ingredients.map(ing => newMyRecipes.push(ing)) //newMyRecipes.push(item)
                }
            })
        )
        // console.log("newMyRecipes", newMyRecipes)
        navigation.navigate('Main', { screen: 'ShowShopList', params: { recipe: newMyRecipes, showType: "events", eventName: `from ${fromDate} to ${toDate}` } })

    }

    const Footer = () => {
        return <View style={{
            // position: 'absolute',
            width: windowWidth,
            // height: 120,
            // alignSelf: 'center',
            // justifyContent: 'flex-end',
            // elevation: 5,
            // zIndex: 5,

        }}>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}>
                <View
                    // value={mealForm.mealName}
                    style={{
                        width: windowWidth,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: 'black',
                        borderWidth: 0.5,
                        borderStyle: 'solid',
                        backgroundColor: GlobalStyles[theme]?.buttonColor
                    }}>
                    <Text style={{ color: 'white', fontSize: 20, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.ADD_NEW_EVENT}</Text>

                </View>
            </TouchableOpacity>
        </View>
    }
    return (

        < View style={[styles.container,
        { backgroundColor: GlobalStyles[theme]?.background }
        ]} >

            < View style={{ alignItems: 'center', padding: 10 }} >

                {/* <Banner title={trans[language]?.MY_CALENDAR} /> */}

                <SpSheet
                    text={trans[language]?.CREATE_SHOP_LIST}
                    heightValue={370}
                    style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%' }}
                >
                    <View style={{ alignItems: 'center', padding: 10, backgroundColor: GlobalStyles[theme]?.background }}>
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                        }}>
                            {trans[language]?.FROM_DATE}:
                        </Text>
                        <DatePicker2
                            pickerType="date"
                            // setInfoPicked={setInfoPicked}
                            infoPickerFunction={infoPickerFunction}
                            formTypeInput="fromDate"

                        />
                        <Text style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                        }}>
                            {trans[language]?.TO_DATE}:
                        </Text>
                        <DatePicker2
                            pickerType="date"
                            // setInfoPicked={setInfoPicked}
                            infoPickerFunction={infoPickerFunction}
                            formTypeInput="toDate"
                        />
                        <TouchableOpacity
                            style={[{
                                // width: 100,
                                // height: 40,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                marginTop: 10,
                                marginBottom: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                borderStyle: 'solid',
                                borderWidth: 0.5,
                                borderColor: GlobalStyles[theme]?.borderColor,
                                backgroundColor: GlobalStyles[theme]?.buttonColor,
                            }]}
                            onPress={() => createShopList()}>
                            <Text style={{
                                fontSize: 16,
                                color: GlobalStyles[theme]?.fontColor,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                            }}>
                                {trans[language]?.CREATE_SHOP_LIST}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SpSheet>
            </View>

            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                // selected={todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate()}
                // selected={date}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={() => onRefresh()}
                //     />}
                // refreshing={true}
                showClosingKnob={true}
                renderItem={renderItem}
                renderKnob={() => {
                    return <View style={{
                        width: 50,
                        height: 10,
                        borderStyle: 'solid',
                        borderWidth: 2,
                        marginTop: 8,
                        borderRadius: 10,
                        borderColor: GlobalStyles[theme]?.buttonColor,
                        backgroundColor: GlobalStyles[theme]?.buttonColor,
                    }} />;
                }}
                rende
                calendarStyle={{ maxHeight: 600, borderColor: GlobalStyles[theme]?.fontColor, borderWidth: 1, }}
                theme={{
                    backgroundColor: GlobalStyles[theme]?.background,
                    agendaDayNumColor: GlobalStyles[theme]?.fontColor,
                    agendaDayTextColor: GlobalStyles[theme]?.fontColor,
                    agendaTodayColor: GlobalStyles[theme]?.buttonColor,
                    calendarBackground: GlobalStyles[theme]?.paperColor,
                    dotColor: GlobalStyles[theme]?.buttonColor,
                    textColor: GlobalStyles[theme]?.fontColor,
                    monthTextColor: GlobalStyles[theme]?.fontColor,
                    dayTextColor: GlobalStyles[theme]?.fontColor,
                    todayDotColor: GlobalStyles[theme]?.buttonColor,
                    selectedDayTextColor: GlobalStyles[theme]?.fontColor,
                    selectedDayBackgroundColor: GlobalStyles[theme]?.buttonColor,
                    textDayFontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                    textMonthFontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                    todayButtonFontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                    textDisabledColor: "#cccccc",
                    // todayBackgroundColor: 'red',
                    // todayTextColor: 'blue',
                    // separatorColor: "purple",
                    // weekVerticalMargin: 2,
                    // arrowColor: "white",
                    // arrowWidth: 3,
                    // contentStyle: {borderColor: "red", borderWidth: 1},
                    // container: {borderColor: "blue", borderWidth: 1},
                   
                }}
            // Agenda theme
            // theme={{
            //     calendarBackground: 'red',
            // agendaDayTextColor: 'yellow',
            // agendaDayNumColor: 'green',
            // agendaTodayColor: 'red',
            // agendaKnobColor: 'blue'
            // }}
            // Agenda container style
            // style={{}}
            />

            {/* Add New Event Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: GlobalStyles[theme]?.paperColor }]}>

                        <TouchableOpacity style={{
                            width: "100%",
                            alignItems: 'flex-end',
                            marginTop: 10,
                            marginRight: 20,
                        }}
                            onPress={() => closeModal()}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>

                        <TextInput
                            style={[styles.outPuts, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }]}
                            placeholderTextColor="black"
                            placeholder={trans[language]?.EVENT_NAME}
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
                            style={[styles.outPuts, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }]}
                            placeholderTextColor="black"
                            placeholder={trans[language]?.OCCASION}
                            value={eventForm.occasion}
                            onChangeText={text => handleOnChange('occasion', text)} />

                        <TextInput
                            style={[styles.outPuts, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }]}
                            placeholderTextColor="black"
                            placeholder={trans[language]?.HOW_MANY_GUESTS}
                            keyboardType='numeric'
                            value={eventForm.howManyGuests}
                            onChangeText={text => handleOnChange('howManyGuests', text)} />

                        <TextInput
                            style={[styles.outPuts, { fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }]}
                            placeholderTextColor="black"
                            placeholder={trans[language]?.FREE_TEXT}
                            value={eventForm.freeText}
                            onChangeText={text => handleOnChange('freeText', text)} />

                        <SwitchButton text01={trans[language]?.PUBLIC} text02={trans[language]?.PRIVATE} show={show} setShow={setShow} />

                        <Pressable onPress={() => setAlarm2(!alarm2)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <View style={{ width: 52, height: 27, borderRadius: 25, borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid', justifyContent: 'center', marginRight: 10 }}>
                                <View style={{ width: 25, height: 25, borderRadius: 25, backgroundColor: alarm2 ? "green" : 'red', alignSelf: alarm2 ? 'flex-end' : 'flex-start', borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid', marginHorizontal: 1 }} />
                            </View>
                            <Text style={{ fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.SET_ALARM}</Text>
                        </Pressable>

                        {alarm2 && <View style={{ width: "100%", alignItems: 'center' }}>
                            <DatePicker2
                                pickerType="date"
                                // setInfoPicked={setInfoPicked}
                                infoPickerFunction={infoPickerFunction}
                            // formTypeInput="alarmDate"
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
                                style={[styles.genericButton, { backgroundColor: GlobalStyles[theme]?.buttonColor }]}
                                onPress={() => addNewEvent()}>
                                <Text style={{ color: 'white', fontSize: 16, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.SAVE}</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity
                                style={[styles.genericButton, { backgroundColor: GlobalStyles[theme]?.buttonColor }]}
                                onPress={() => updatEvent()}>
                                <Text style={{ color: 'white', fontSize: 16, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.UPDATE}</Text>
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </Modal>

            <PopupModal message={redux?.event.message} popupModal={popupModal} />

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
                                {trans[language]?.ARE_YOU_SURE}
                            </Text>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                color: GlobalStyles[theme]?.fontColor,
                            }}>
                                {trans[language]?.EVENT_PERMANET_DELETE}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-around", marginTop: 20 }}>
                            <TouchableOpacity
                                onPress={() => delEvent(itemDelete)}>
                                <Text style={{
                                    color: GlobalStyles[theme]?.buttonColor,
                                    fontSize: 16,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {trans[language]?.DELETE}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setModalAlert(false); setItemDelete({}) }}>
                                <Text style={{
                                    color: GlobalStyles[theme]?.buttonColor,
                                    fontSize: 16,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {trans[language]?.CANCEL}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>

            {/* <View style={{ width: '100%', backgroundColor: GlobalStyles[theme]?.buttonColor }}>
                <Button title='Add new Event' onPress={() => setModalVisible(true)} />
            </View> */}
            <Footer />
        </View >

    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 50
    },
    container: {
        flex: 1,
    },
    genericButton: {
        marginTop: 15,
        marginBottom: 30,
        // width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
        // backgroundColor: '#66ccff',
    },
    item: {
        flex: 1,
        borderRadius: 10,
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
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    outPuts: {
        width: "100%",
        height: 40,
        marginVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        paddingLeft: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
    },
});

export default Mycallendar;