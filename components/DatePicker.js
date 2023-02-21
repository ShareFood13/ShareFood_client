
import React, { useState } from 'react';
import {
    View,
    Button,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons } from '@expo/vector-icons';


export default function DatePicker({
    pickerType,
    infoPickerFunction,
    formTypeInput,
    birthDay
}) {

    const todayDate = new Date();

    const [date, setDate] = useState(todayDate);

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    var currentDate = '';



    const onChange = (event, selectedDate) => {
        currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        // setInfoPicked(currentDate);
        infoPickerFunction(pickerType, selectedDate, formTypeInput);
    };

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(false);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
        setShow(true);
    };

    const showTimepicker = () => {
        showMode('time');
        setShow(true);
    };

    return (
        <View>

            {pickerType === 'date' && (
                (birthDay)
                    ?
                    <View style={{ flexDirection: 'row', height: 35, width: '90%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                        <Text style={{ width: '30%' }}>BirthDate:</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '70%', height: '100%', textAlignVertical: 'center', paddingLeft: 10, backgroundColor: 'white', borderRadius: 10, marginHorizontal: 5 }}>
                            <Text>{date.toISOString().split('T')[0]}</Text>
                            <TouchableOpacity style={{ width: "20%", alignItems: 'center', justifyContent: 'center' }} onPress={showDatepicker}>
                                <Ionicons name="calendar-outline" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View
                        style={styles.outPuts}
                    >
                        <Text style={{ width: "80%" }}>Date Picked: {date.toISOString().split('T')[0]}</Text>
                        <TouchableOpacity style={{ width: "20%", alignItems: 'center', justifyContent: 'center' }} onPress={showDatepicker}>
                            <Ionicons name="calendar-outline" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
            )}
            {pickerType === 'time' && (
                <View
                    style={styles.outPuts}
                >
                    <Text style={{ width: "80%" }}>
                        Time Picked: {date.toLocaleTimeString('he-IL')}
                    </Text>
                    <TouchableOpacity
                        style={{
                            width: "20%",
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={showTimepicker}>
                        <MaterialCommunityIcons name="clock-time-three-outline" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            )}
            {/* <Text>selected: {date.toLocaleString()}</Text> */}
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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