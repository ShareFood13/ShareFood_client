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
} from 'react-native';

import { SimpleLineIcons } from '@expo/vector-icons'

import Constants from 'expo-constants';

import { Picker } from '@react-native-picker/picker';

import { DataTable } from 'react-native-paper';

import uuid from 'react-native-uuid';
import { ScrollView } from 'react-native-gesture-handler';
import Banner from '../../components/Banner';
import GlobalStyles from '../../GlobalStyles';

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

const convert = ["C", "O", "N", "V", "E", "R", "T",]

const ovenLevels = [
    { level: 'Cool oven', imperial: '200 °F', metric: '90 °C' },
    { level: 'Very slow oven', imperial: '250 °F', metric: '120 °C' },
    { level: 'Slow oven', imperial: '300-325 °F', metric: '150-160 °C' },
    { level: 'Moderately slow', imperial: '325-350 °F', metric: '160-180 °C' },
    { level: 'Moderate oven', imperial: '350-375 °F', metric: '180-190 °C' },
    { level: 'Moderately hot', imperial: '375-400 °F', metric: '190-200 °C' },
    { level: 'Hot oven', imperial: '400-450 °F', metric: '200-230 °C' },
    { level: 'Very hot oven', imperial: '450-500 °F', metric: '230-260 °C' },
    { level: 'Fast oven', imperial: '450-500 °F', metric: '230-260 °C' },
];

export default function Conversions() {
    const [show, setShow] = useState('mass');
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [toUnitShow, setToUnitShow] = useState('');
    const [value, setValue] = useState(0);
    const [multi, setMulti] = useState(1);
    const [theme,setTheme] = useState('stylesLight')

    const [test, setTest] = useState(1);
    var array = [];
    const handleChange = (text) => {
        setFromUnit(text);
    };

    const handleButtonPress = (text) => {
        if (text === 'mass') {
            setShow('mass');
            // setValue(0)
            setMulti(1);
            setFromUnit('');
            setToUnitShow('');
            setToUnit('');
        } else if (text === 'volume') {
            setShow('volume');
            // setValue(0)
            setMulti(1);
            setFromUnit('');
            setToUnitShow('');
            setToUnit('');
        } else {
            setShow('temperature');
            setMulti(1);
            // setValue(0)
            setFromUnit('');
            setToUnitShow('');
            setToUnit('');
        }
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
        const result =
            show === 'mass'
                ? mass.filter((elem) => elem.unit === fromUnit)
                : show === 'volume'
                    ? volume.filter((elem) => elem.unit === fromUnit)
                    : temperature.filter((elem) => elem.unit === fromUnit);
        for (const [key, value] of Object.entries(result[0])) {
            array.push(key === toUnit && `${value}`);
        }
        setMulti(array.filter((elem) => elem !== false));
        //Object.entries(obj)
        setTest(array.filter((elem) => elem !== false));
    };



    return (
        <View style={[styles.container, {backgroundColor: GlobalStyles[theme].background,}]}>

            <Banner title="Units Convertor" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.switch}>
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
                                width: '33%',
                                height: 30,
                                borderRadius: 10,
                                borderColor: show === 'mass' ? 'orange' : '#ffcc80',
                                borderWidth: 0.5,
                                backgroundColor: show === 'mass' ? 'orange' : '#ffcc80',
                                // position: 'absolute',
                                // left: 0,
                            }}
                            onPress={() => handleButtonPress('mass')}>
                            <Text>Mass</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '33%',
                                height: 30,
                                borderRadius: 10,
                                borderColor: show === 'volume' ? 'orange' : '#ffcc80',
                                borderWidth: 0.5,
                                backgroundColor: show === 'volume' ? 'orange' : '#ffcc80',
                                // position: 'absolute',
                                // right: '33%'
                            }}
                            onPress={() => handleButtonPress('volume')}>
                            <Text>Volume</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '33%',
                                height: 30,
                                borderRadius: 10,
                                borderColor: show === 'temperature' ? 'orange' : '#ffcc80',
                                borderWidth: 0.5,
                                backgroundColor: show === 'temperature' ? 'orange' : '#ffcc80',
                                // position: 'absolute',
                                // right: 0
                            }}
                            onPress={() => handleButtonPress('temperature')}>
                            <Text>Temperature</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                            <TextInput
                                value={value}
                                keyboardType={'numeric'}
                                onChangeText={(text) => setValue(text)}
                                style={{ backgroundColor: GlobalStyles[theme].paperColor, width: 80, height: 55, textAlign: 'center', fontSize: 18, marginRight: 20, borderRadius: 15, borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid' }}
                            />
                            <View style={{ borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid' }}>
                                <Picker
                                    style={{ width: 150, height: 55, alignSelf: 'center', paddingLeft: 10, backgroundColor: GlobalStyles[theme].paperColor }}
                                    selectedValue={fromUnit}
                                    onValueChange={(text) => setFromUnitHandler(text)}>
                                    <Picker.Item label="From..." value="From..." />
                                    {show === 'mass'
                                        ? mass.map((elem) => (
                                            <Picker.Item label={elem.unit} value={elem.unit} key={uuid.v4()} />
                                        ))
                                        : show === 'volume'
                                            ? volume.map((elem) => (
                                                <Picker.Item label={elem.unit} value={elem.unit} key={uuid.v4()} />
                                            ))
                                            : temperature.map((elem) => (
                                                <Picker.Item label={elem.unit} value={elem.unit} key={uuid.v4()} />
                                            ))}
                                </Picker>
                            </View>
                        </View>

                        <SimpleLineIcons
                            name="arrow-down-circle"
                            size={40}
                            color={mainColor}
                            style={{ alignSelf: 'center' }}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                            <Text
                                style={{ backgroundColor: GlobalStyles[theme].paperColor, width: 80, height: 55, textAlign: 'center', fontSize: 18, marginRight: 20, textAlignVertical: 'center', borderRadius: 15, borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid' }}>
                                {show !== 'temperature'
                                    ? (value * multi).toFixed(3)
                                    : toUnit === 'toCelsius'
                                        ? ((value - 32) * multi).toFixed(3)
                                        : (value * multi + 32).toFixed(3)}
                            </Text>

                            <View style={{ borderColor: 'black', borderWidth: 0.5, borderStyle: 'solid' }}>
                                <Picker
                                    style={{ width: 150, height: 55, alignSelf: 'center', paddingLeft: 10, backgroundColor: GlobalStyles[theme].paperColor}}  selectedValue={toUnitShow}
                                    onValueChange={(text) => setTo(text)}>
                                    <Picker.Item label="To..." value="To..." />
                                    {show === 'mass'
                                        ? mass.map((elem) => (
                                            <Picker.Item label={elem.unit} value={elem.unit} key={uuid.v4()} />
                                        ))
                                        : show === 'volume'
                                            ? volume.map((elem) => (
                                                <Picker.Item label={elem.unit} value={elem.unit} key={uuid.v4()} />
                                            ))
                                            : temperature.map((elem) => (
                                                <Picker.Item label={elem.unit} value={elem.unit} key={uuid.v4()} />
                                            ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => result()} style={{
                        width: 40, height: 160, backgroundColor: GlobalStyles[theme].buttonColor, marginLeft: 30, justifyContent: 'center', borderRadius: 15,
                        borderColor: 'black', borderWidth: 1, borderStyle: 'solid'
                    }}>
                        {convert.map(elem => <Text key={uuid.v4()} style={{ fontSize: 14, fontWeight: 'bold', color: 'white', width: '100%', textAlign: 'center' }}>{elem}</Text>)}
                    </TouchableOpacity>
                </View>

                <View style={{
                    alignSelf: 'center',
                    borderStyle: 'solid',
                    borderColor: 'black',
                    borderWidth: 0.5,
                    width: '100%',
                    marginTop: 15,
                    backgroundColor: GlobalStyles[theme].paperColor
                }}>
                    <DataTable style={{ width: '100%' }}>
                        <DataTable.Header style={{ width: '100%' }}>
                            <DataTable.Title textStyle={{ fontSize: 15, fontWeight: 'bold' }}>
                                Oven Level
                            </DataTable.Title>
                            <DataTable.Title
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                                textStyle={{ fontSize: 15, fontWeight: 'bold' }}>
                                Fahrenheit
                            </DataTable.Title>
                            <DataTable.Title
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                                textStyle={{ fontSize: 15, fontWeight: 'bold' }}>
                                Celsius
                            </DataTable.Title>
                        </DataTable.Header>

                        <View style={{ width: '100%' }}>
                            {ovenLevels.map((level) => (
                                <DataTable.Row key={uuid.v4()} >
                                    <DataTable.Cell >{level.level}</DataTable.Cell>
                                    <DataTable.Cell
                                        style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        {level.imperial}
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                        style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        {level.metric}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </View>
                    </DataTable>
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 10,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 30,
        marginVertical: 15,
        borderRadius: 10,
        borderColor: 'orange',
        // borderWidth: 0.5,
        backgroundColor: '#ffcc80',
        // opacity: 0.2,
        // position: 'relative'
    },
});
