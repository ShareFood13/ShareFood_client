import { useState, useEffect } from 'react';
import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    TextInput,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import { SimpleLineIcons } from '@expo/vector-icons'

import Constants from 'expo-constants';

import { Picker } from '@react-native-picker/picker';

import { DataTable } from 'react-native-paper';

import uuid from 'react-native-uuid';
import { ScrollView } from 'react-native-gesture-handler';
import Banner from '../../components/Banner';
import GlobalStyles from '../../GlobalStyles';
import { SelectList } from 'react-native-dropdown-select-list';

const windowWidth = Dimensions.get('window').width
const mainColor = '#052F5F'

const mass = [
    // { system: "metric", unit: "From...To...", abreviation: "", toGrams: 0, toKiloGrams: 0, toOnces: 0, toPounds: 0 },
    {
        system: 'metric',
        unit: 'Grams',
        abreviation: 'g',
        toGrams: 1,
        toKiloGrams: 0.001,
        toOnces: 0.0352739619,
        toPounds: 0.00220462262,
    },
    {
        system: 'metric',
        unit: 'KiloGrams',
        abreviation: 'Kg',
        toGrams: 1000,
        toKiloGrams: 1,
        toOnces: 35.2739619,
        toPounds: 2.20462262,
    },
    {
        system: 'imperial',
        unit: 'Onces',
        abreviation: 'Oz',
        toGrams: 28.3495231,
        toKiloGrams: 0.0283495231,
        toOnces: 1,
        toPounds: 0.0625,
    },
    {
        system: 'imperial',
        unit: 'Pounds',
        abreviation: 'lbs',
        toGrams: 453.59237,
        toKiloGrams: 0.45359237,
        toOnces: 16,
        toPounds: 1,
    },
];

const volume = [
    // { system: "metric", unit: "From...To...", abreviation: "", toMilliLiter: 0, toLiter: 0, toTeaSpoon: 0, toTableSpoon: 0, toCup: 0, toOnces: 0, toPint: 0, toGallon: 0 },
    {
        system: 'metric',
        unit: 'MilliLiter',
        abreviation: 'ml',
        toMilliLiter: 1,
        toLiter: 0.001,
        toTeaSpoon: 0.2,
        toTableSpoon: 0.067,
        toCup: 0.0042,
        toOnces: 0.033,
        toPint: 0.0021,
        toGallon: 0.00026,
    },
    {
        system: 'metric',
        unit: 'Liter',
        abreviation: 'L',
        toMilliLiter: 1000,
        toLiter: 1,
        toTeaSpoon: 202.88,
        toTableSpoon: 67.62,
        toCup: 4.227,
        toOnces: 33.814,
        toPint: 2.11,
        toGallon: 0.26,
    },
    {
        system: 'both',
        unit: 'TeaSpoon',
        abreviation: 'tsp',
        toMilliLiter: 5,
        toLiter: 0.005,
        toTeaSpoon: 1,
        toTableSpoon: 0.3333,
        toCup: 0.02,
        toOnces: 0.16,
        toPint: 0.01,
        toGallon: 0.0013,
    },
    {
        system: 'both',
        unit: 'TableSpoon',
        abreviation: 'tbs',
        toMilliLiter: 15,
        toLiter: 0.015,
        toTeaSpoon: 3,
        toTableSpoon: 1,
        toCup: 0.0625,
        toOnces: 0.5,
        toPint: 0.031,
        toGallon: 0.0039,
    },
    {
        system: 'both',
        unit: 'Cup',
        abreviation: 'cup',
        toMilliLiter: 236.58,
        toLiter: 0.23,
        toTeaSpoon: 48,
        toTableSpoon: 16,
        toCup: 1,
        toOnces: 8,
        toPint: 0.5,
        toGallon: 0.062,
    },
    {
        system: 'imperial',
        unit: 'Onces',
        abreviation: 'oz',
        toMilliLiter: 29.57,
        toLiter: 0.029,
        toTeaSpoon: 6,
        toTableSpoon: 2,
        toCup: 0.12,
        toOnces: 1,
        toPint: 0.062,
        toGallon: 0.0077,
    },
    {
        system: 'imperial',
        unit: 'Pint',
        abreviation: 'pnt',
        toMilliLiter: 473.17,
        toLiter: 0.46,
        toTeaSpoon: 96,
        toTableSpoon: 32,
        toCup: 2,
        toOnces: 16,
        toPint: 1,
        toGallon: 0.12,
    },
    {
        system: 'imperial',
        unit: 'Gallon',
        abreviation: 'gal',
        toMilliLiter: 3785.41,
        toLiter: 3.74,
        toTeaSpoon: 768,
        toTableSpoon: 256,
        toCup: 16,
        toOnces: 128,
        toPint: 8,
        toGallon: 1,
    },
];

const temperature = [
    {
        system: 'imperial',
        unit: 'Fahrenheit',
        abreviation: 'F',
        toCelsius: 0.5556,
        toFahrenheit: 1,
    },
    {
        system: 'metric',
        unit: 'Celsius',
        abreviation: 'C',
        toCelsius: 1,
        toFahrenheit: 1.8,
    },
];

const massUnit = [
    { key: '1', value: "Grams" },
    { key: '2', value: "KiloGrams" },
    { key: '3', value: "Onces" },
    { key: '4', value: "Pounds" },
]

const volumeUnit = [
    { key: '1', value: "MilliLiter" },
    { key: '2', value: "Liter" },
    { key: '3', value: "TeaSpoon" },
    { key: '4', value: "TableSpoon" },
    { key: '5', value: "Cup" },
    { key: '6', value: "Onces" },
    { key: '7', value: "Pint" },
    { key: '8', value: "Gallon" },
]

const temperatureUnit = [
    { key: '1', value: "Fahrenheit" },
    { key: '2', value: "Celsius" },

]
const convert = ["C", "O", "N", "V", "E", "R", "T",]

const ovenLevels = {
    en: [
        { level: 'Cool oven', imperial: '200 °F', metric: '90 °C' },
        { level: 'Very slow oven', imperial: '250 °F', metric: '120 °C' },
        { level: 'Slow oven', imperial: '300-325 °F', metric: '150-160 °C' },
        { level: 'Mod. slow', imperial: '325-350 °F', metric: '160-180 °C' },
        { level: 'Moderate oven', imperial: '350-375 °F', metric: '180-190 °C' },
        { level: 'Mod. hot', imperial: '375-400 °F', metric: '190-200 °C' },
        { level: 'Hot oven', imperial: '400-450 °F', metric: '200-230 °C' },
        { level: 'Very hot oven', imperial: '450-500 °F', metric: '230-260 °C' },
        { level: 'Fast oven', imperial: '450-500 °F', metric: '230-260 °C' },
    ],
    he: [
        { level: 'Cool oven', imperial: '200 °F', metric: '90 °C' },
        { level: 'Very slow oven', imperial: '250 °F', metric: '120 °C' },
        { level: 'Slow oven', imperial: '300-325 °F', metric: '150-160 °C' },
        { level: 'Mod. slow', imperial: '325-350 °F', metric: '160-180 °C' },
        { level: 'Moderate oven', imperial: '350-375 °F', metric: '180-190 °C' },
        { level: 'Mod. hot', imperial: '375-400 °F', metric: '190-200 °C' },
        { level: 'Hot oven', imperial: '400-450 °F', metric: '200-230 °C' },
        { level: 'Very hot oven', imperial: '450-500 °F', metric: '230-260 °C' },
        { level: 'Fast oven', imperial: '450-500 °F', metric: '230-260 °C' },
    ]
}

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
import trans from '../../Language'

export default function Conversions() {
    const [show, setShow] = useState('mass');
    const [convertResult, setConvertResult] = useState()
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [toUnitShow, setToUnitShow] = useState('');
    const [value, setValue] = useState(0);
    const [multi, setMulti] = useState(1);
    const [language, setLanguage] = useState("en")
    const [theme, setTheme] = useState("stylesLight")
    const [fontStyle, setFontStyle] = useState("Montserrat")
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
    const [test, setTest] = useState(1);
    var array = [];
    const handleChange = (text) => {
        setFromUnit(text);
    };

    const handleButtonPress = (text) => {
        setShow(text);
        setMulti(1);
        setFromUnit('');
        setToUnitShow('');
        setToUnit('');
    };

    const setFromUnitHandler = (text) => {
        if (show === "temperature") {
            if (text === 'Celsius') {
                setToUnitShow("Fahrenheit");
                setToUnit("toFahrenheit");
            }
            else {
                setToUnitShow("Celsius");
                setToUnit("toCelsius");
            }
        }
        setFromUnit(text)
    }
    const setTo = (text) => {
        // if (show === "temperature") {
        //     if (text === 'Celsius') {
        //         setFromUnit("Fahrenheit")
        //     }
        //     else {
        //         setFromUnit("Celsius")
        //     }
        // }
        (show === "temperature") && ((text === 'Celsius') ? setFromUnit("Fahrenheit") : setFromUnit("Celsius"))
        setToUnitShow(text);
        setToUnit(`to${text}`);
    };

    const result = () => {
        fromUnit
        const result =
            show === 'mass'
                ? mass.filter((elem) => elem.unit === fromUnit)
                : show === 'volume'
                    ? volume.filter((elem) => elem.unit === fromUnit)
                    : temperature.filter((elem) => elem.unit === fromUnit);
        for (const [key, value] of Object.entries(result[0])) {
            array.push(key === toUnit && `${value}`);
        }
        // setMulti(array.filter((elem) => elem !== false));
        //Object.entries(obj)
        // setTest(array.filter((elem) => elem !== false));
        var multi2 = array.filter((elem) => elem !== false)

        Number(multi2[0]) !== 1 &&
            (show !== 'temperature'
                ? setConvertResult((value * +multi2[0]).toFixed(3))
                : toUnit === 'toCelsius'
                    ? setConvertResult(((value - 32) * +multi2[0]).toFixed(3))
                    : setConvertResult((value * +multi2[0] + 32).toFixed(3)))
    };

    return (
        <View style={[styles.container, { backgroundColor: GlobalStyles[theme].background, }]}>

            {/* <Banner title={trans[language].UNITS_CONVERTOR} /> */}

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 30,
                    marginVertical: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 10,
                    borderColor: 'orange',
                    backgroundColor: '#ffcc80',
                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '33.33333%',
                                height: 30,
                                borderRadius: 10,
                                borderColor: show === 'mass' ? 'orange' : '#ffcc80',
                                borderWidth: 0.5,
                                backgroundColor: show === 'mass' ? 'orange' : '#ffcc80',
                                // position: 'absolute',
                                // left: 0,
                            }}
                            onPress={() => handleButtonPress('mass')}>
                            <Text style={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}>{trans[language].MASS}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '33.33333%',
                                height: 30,
                                borderRadius: 10,
                                borderColor: show === 'volume' ? 'orange' : '#ffcc80',
                                borderWidth: 0.5,
                                backgroundColor: show === 'volume' ? 'orange' : '#ffcc80',
                                // position: 'absolute',
                                // right: '33%'
                            }}
                            onPress={() => handleButtonPress('volume')}>
                            <Text style={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}>{trans[language].VOLUME}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '33.33333%',
                                height: 30,
                                borderRadius: 10,
                                borderColor: show === 'temperature' ? 'orange' : '#ffcc80',
                                borderWidth: 0.5,
                                backgroundColor: show === 'temperature' ? 'orange' : '#ffcc80',
                                // position: 'absolute',
                                // right: 0
                            }}
                            onPress={() => handleButtonPress('temperature')}>
                            <Text style={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}>{trans[language].TEMPERATURE}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                            <TextInput
                                placeholder='0.000'
                                placeholderTextColor={GlobalStyles[theme].fontColor}
                                value={value}
                                keyboardType={'numeric'}
                                onChangeText={(text) => setValue(text)}
                                style={{
                                    width: 100,
                                    // height: 55, 
                                    textAlign: 'center',
                                    marginRight: 10,
                                    // borderRadius: 10,
                                    borderTopLeftRadius: 10,
                                    borderWidth: 0.5,
                                    borderStyle: 'solid',
                                    fontSize: 18,
                                    backgroundColor: GlobalStyles[theme].paperColor,
                                    borderColor: GlobalStyles[theme].borderColor,
                                    color: GlobalStyles[theme].fontColor,
                                }}
                            />
                            <View style={{
                                borderColor: GlobalStyles[theme].borderColor,
                                borderWidth: 0.5
                            }}>
                                <Picker
                                    style={{
                                        width: 150,
                                        height: 55,
                                        alignSelf: 'center',
                                        paddingLeft: 10,
                                        color: GlobalStyles[theme].fontColor,
                                        backgroundColor: GlobalStyles[theme].paperColor,
                                    }}
                                    selectedValue={fromUnit}
                                    onValueChange={(text) => setFromUnitHandler(text)}>
                                    <Picker.Item label={trans[language].FROM + "..."}
                                        value="From..."
                                        color={GlobalStyles[theme].fontColor}
                                        fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                        style={{
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            backgroundColor: GlobalStyles[theme].paperColor,
                                            width: 150,
                                        }}
                                    />
                                    {show === 'mass'
                                        ? mass.map((elem) => (
                                            <Picker.Item
                                                label={elem.unit}
                                                value={elem.unit}
                                                key={uuid.v4()}
                                                color={GlobalStyles[theme].fontColor}
                                                fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                                style={{
                                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                    backgroundColor: GlobalStyles[theme].paperColor,
                                                }} />
                                        ))
                                        : show === 'volume'
                                            ? volume.map((elem) => (
                                                <Picker.Item
                                                    label={elem.unit}
                                                    value={elem.unit}
                                                    key={uuid.v4()}
                                                    color={GlobalStyles[theme].fontColor}
                                                    fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                                    style={{
                                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                        backgroundColor: GlobalStyles[theme].paperColor
                                                    }} />
                                            ))
                                            : temperature.map((elem) => (
                                                <Picker.Item
                                                    label={elem.unit}
                                                    value={elem.unit}
                                                    key={uuid.v4()}
                                                    color={GlobalStyles[theme].fontColor}
                                                    fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                                    style={{
                                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                        backgroundColor: GlobalStyles[theme].paperColor
                                                    }} />
                                            ))}
                                </Picker>
                            </View>
                        </View>

                        <SimpleLineIcons
                            name="arrow-down-circle"
                            size={40}
                            color={GlobalStyles[theme].buttonColor}
                            style={{ alignSelf: 'center' }}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                            <Text
                                style={{
                                    width: 100,
                                    // height: 55, 
                                    textAlign: 'center',
                                    marginRight: 10,
                                    textAlignVertical: 'center',
                                    // borderRadius: 10,
                                    borderBottomLeftRadius: 10,
                                    borderWidth: 0.5,
                                    borderStyle: 'solid',
                                    fontSize: 18,
                                    color: GlobalStyles[theme].fontColor,
                                    borderColor: GlobalStyles[theme].borderColor,
                                    backgroundColor: GlobalStyles[theme].paperColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                }}>
                                {/* {multi !== 1 && (show !== 'temperature'
                                    ? (value * multi).toFixed(3)
                                    : toUnit === 'toCelsius'
                                        ? ((value - 32) * multi).toFixed(3)
                                        : (value * multi + 32).toFixed(3))} */}
                                {convertResult}
                            </Text>

                            <View style={{ borderColor: GlobalStyles[theme].borderColor, borderWidth: 0.5 }}>
                                <Picker
                                    style={{
                                        width: 150,
                                        height: 55,
                                        alignSelf: 'center',
                                        paddingLeft: 10,
                                        color: GlobalStyles[theme].fontColor,
                                        backgroundColor: GlobalStyles[theme].paperColor,
                                    }}
                                    selectedValue={toUnitShow}
                                    onValueChange={(text) => setTo(text)}>
                                    <Picker.Item
                                        label={trans[language].TO + "..."}
                                        value="To..."
                                        color={GlobalStyles[theme].fontColor}
                                        fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                        style={{
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            backgroundColor: GlobalStyles[theme].paperColor,
                                            width: 150,
                                        }} />
                                    {show === 'mass'
                                        ? mass.map((elem) => (
                                            <Picker.Item
                                                value={elem.unit}
                                                key={uuid.v4()}
                                                color={GlobalStyles[theme].fontColor}
                                                fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                                style={{
                                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                    backgroundColor: GlobalStyles[theme].paperColor,
                                                }}
                                            />
                                        ))
                                        : show === 'volume'
                                            ? volume.map((elem) => (
                                                <Picker.Item
                                                    label={elem.unit}
                                                    value={elem.unit}
                                                    key={uuid.v4()}
                                                    color={GlobalStyles[theme].fontColor}
                                                    fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                                    style={{
                                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                        backgroundColor: GlobalStyles[theme].paperColor
                                                    }}
                                                />
                                            ))
                                            : temperature.map((elem) => (
                                                <Picker.Item label={elem.unit}
                                                    value={elem.unit}
                                                    key={uuid.v4()}
                                                    color={GlobalStyles[theme].fontColor}
                                                    fontFamily={GlobalFontStyles[fontStyle].fontStyle}
                                                    style={{
                                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                        backgroundColor: GlobalStyles[theme].paperColor
                                                    }}
                                                />
                                            ))}
                                </Picker>
                                {/* {show === 'mass'
                                    ? <SelectList
                                        setSelected={(text) => setTo(text)}
                                        data={massUnit}
                                        // placeholder={toUnitShow === "" ? "To..." : toUnitShow}
                                        placeholder="To..."
                                        save="value"
                                        inputStyles={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}
                                        dropdownTextStyles={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}
                                        boxStyles={{
                                            width: 150,
                                            // height: 55,
                                            borderWidth: 0.5,
                                            borderStyle: 'solid',
                                            borderColor: 'black',
                                            // marginRight: 20,
                                            backgroundColor: GlobalStyles[theme].paperColor,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle

                                        }}
                                        dropdownItemStyles={{
                                            width: 150,
                                            // marginBottom: 10,
                                        }}
                                        dropdownStyles={{
                                            width: 150,
                                            alignSelf: 'center',
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                            elevation: 10,
                                            zIndex: 10,
                                            top: 40,
                                        }}
                                    />
                                    : show === 'volume'
                                        ? <SelectList
                                            setSelected={(text) => setTo(text)}
                                            data={volumeUnit}
                                            placeholder="To..."
                                            save="value"
                                            inputStyles={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}
                                            dropdownTextStyles={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}
                                            boxStyles={{
                                                width: 150,
                                                borderWidth: 0.5,
                                                borderStyle: 'solid',
                                                borderColor: 'black',
                                                backgroundColor: GlobalStyles[theme].paperColor,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle

                                            }}
                                            dropdownItemStyles={{
                                                width: 150,
                                                // marginBottom: 10,
                                            }}
                                            dropdownStyles={{
                                                width: 150,
                                                alignSelf: 'center',
                                                backgroundColor: 'white',
                                                position: 'absolute',
                                                elevation: 10,
                                                zIndex: 10,
                                                top: 40,
                                            }}
                                        />
                                        : <SelectList
                                            setSelected={(text) => setTo(text)}
                                            data={temperatureUnit}
                                            placeholder="To..."
                                            save="value"
                                            inputStyles={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}
                                            dropdownTextStyles={{ fontFamily: GlobalFontStyles[fontStyle].fontStyle }}
                                            boxStyles={{
                                                width: 150,
                                                borderWidth: 0.5,
                                                borderStyle: 'solid',
                                                borderColor: 'black',
                                                backgroundColor: GlobalStyles[theme].paperColor,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle

                                            }}
                                            dropdownItemStyles={{
                                                width: 150,
                                                // marginBottom: 10,
                                            }}
                                            dropdownStyles={{
                                                width: 150,
                                                alignSelf: 'center',
                                                backgroundColor: 'white',
                                                position: 'absolute',
                                                elevation: 10,
                                                zIndex: 10,
                                                top: 40,
                                            }}
                                        />} */}
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => result()} style={{
                        // width: 40, 
                        // height: 160, 
                        marginLeft: 10,
                        padding: 20,
                        justifyContent: 'center',
                        borderBottomRightRadius:10,
                        borderTopRightRadius: 10,
                        borderWidth: 0.5,
                        borderStyle: 'solid',
                        backgroundColor: (fromUnit !== "" && toUnit !== "") ? GlobalStyles[theme].buttonColor : '#ddd',
                        borderColor: GlobalStyles[theme].borderColor,
                    }}
                        disabled={(fromUnit !== "" && toUnit !== "") ? false : true}>
                        {convert.map(elem =>
                            <Text key={uuid.v4()}
                                style={{
                                    // fontWeight: 'bold',
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: 14.2,
                                    color: GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                }}>
                                {elem}
                            </Text>)}
                    </TouchableOpacity>
                </View>

                <View style={{
                    width: '100%',
                    marginTop: 15,
                    alignSelf: 'center',
                    borderStyle: 'solid',
                    borderWidth: 0.5,
                    borderColor: GlobalStyles[theme].borderColor,
                    backgroundColor: GlobalStyles[theme].paperColor,
                }}>
                    <DataTable style={{ width: '100%' }}>
                        <DataTable.Header style={{
                            width: '100%',
                            borderBottomColor: GlobalStyles[theme].borderColor,
                            borderBottomWidth: 0.5,
                        }}>
                            <DataTable.Title textStyle={{
                                fontSize: 15,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                                {trans[language].OVEN_LEVEL}
                            </DataTable.Title>
                            <DataTable.Title
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                                textStyle={{
                                    fontSize: 15,
                                    color: GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                }}>
                                {trans[language].FAHRENHEIT}
                            </DataTable.Title>
                            <DataTable.Title
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                                textStyle={{
                                    fontSize: 15,
                                    color: GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                }}>
                                {trans[language].CELSIUS}
                            </DataTable.Title>
                        </DataTable.Header>

                        {ovenLevels[language].map((level) => (
                            <DataTable.Row key={uuid.v4()}
                                style={{
                                    borderBottomColor: GlobalStyles[theme].borderColor,
                                    borderBottomWidth: 0.5,
                                }}>
                                <DataTable.Cell
                                    textStyle={{
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}
                                    style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    {level.level}
                                </DataTable.Cell>
                                <DataTable.Cell
                                    textStyle={{
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}
                                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    {level.imperial}
                                </DataTable.Cell>
                                <DataTable.Cell
                                    textStyle={{
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}
                                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    {level.metric}
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 10,
    }
});
