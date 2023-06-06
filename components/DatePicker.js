
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
import GlobalFontStyles from '../GlobalFontStyles';
import GlobalStyles from '../GlobalStyles';
import trans from '../Language';
import { Context } from '../context/UserContext';
import { useContext } from 'react';
var theme = ""
var language = ""
var fontStyle = ""
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

    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])
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
                    <View
                        style={{
                            flexDirection: 'row',
                            height: 35,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                        }}>
                        <Text style={{
                            width: '30%',
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                        }}>
                            {trans[language]?.BIRTHDATE}:
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '70%',
                                height: '100%',
                                textAlignVertical: 'center',
                                paddingLeft: 10,
                                borderRadius: 10,
                            }}>
                            <Text style={{
                                color: GlobalStyles[theme]?.fontColor,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                            }}>
                                {date.toISOString().split('T')[0]}
                            </Text>
                            <TouchableOpacity style={{ width: "20%", alignItems: 'center', justifyContent: 'center' }} onPress={showDatepicker}>
                                <Ionicons name="calendar-outline" size={30} color={GlobalStyles[theme]?.fontColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View
                        style={[styles.outPuts, {backgroundColor: GlobalStyles[theme]?.paperColor,}]}
                    >
                        <Text style={{
                            width: "80%",
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        }}>
                            {trans[language]?.DATE_PICKED}: {date.toISOString().split('T')[0]}
                        </Text>
                        <TouchableOpacity style={{ width: "20%", alignItems: 'center', justifyContent: 'center' }} onPress={showDatepicker}>
                            <Ionicons name="calendar-outline" size={30} color={GlobalStyles[theme]?.fontColor} />
                        </TouchableOpacity>
                    </View>
            )}
            {pickerType === 'time' && (
                <View
                    style={[styles.outPuts, {backgroundColor: GlobalStyles[theme]?.paperColor,}]}
                >
                    <Text style={{ 
                        width: "80%", 
                        color: GlobalStyles[theme]?.fontColor,
                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>
                        {trans[language]?.TIME_PICKED}: {date.toLocaleTimeString('he-IL')}
                    </Text>
                    <TouchableOpacity
                        style={{
                            width: "20%",
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={showTimepicker}>
                        <MaterialCommunityIcons name="clock-time-three-outline" size={30} color={GlobalStyles[theme]?.fontColor} />
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
        width: "100%",
        height: 40,
        marginVertical: 5,
        flexDirection: 'row',
        paddingLeft: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10
    },
});