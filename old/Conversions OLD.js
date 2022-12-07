import React, { useState, useEffect, useRef } from 'react'
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
    Alert
} from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'

import { Picker } from '@react-native-picker/picker';

import { DataTable } from 'react-native-paper';

import uuid from 'react-native-uuid';

import convert from 'convert-units'

const mainColor = '#052F5F'


const mass = [
    { system: "metric", unit: "Grams", abreviation: "g", toGrams: 1, toKiloGrams: 0.001, toOnces: 0.0352739619, toPounds: 0.00220462262 },
    { system: "metric", unit: "KiloGrams", abreviation: "Kg", toGrams: 1000, toKiloGrams: 1, toOnces: 35.2739619, toPounds: 2.20462262 },
    { system: "imperial", unit: "Onces", abreviation: "Oz", toGrams: 28.3495231, toKiloGrams: 0.0283495231, toOnces: 1, toPounds: 0.0625 },
    { system: "imperial", unit: "Pounds", abreviation: "lbs", toGrams: 453.59237, toKiloGrams: 0.45359237, toOnces: 16, toPounds: 1 },
]

const volume = [
    { system: "metric", unit: "MilliLiter", abreviation: "ml", toMilliLiter: 1, toLiter: 0.001, toTeaSpoon: 0.2, toTableSpoon: 0.067, toCup: 0.0042, toOnces: 0.033, toPint: 0.0021, toGallon: 0.00026 },
    { system: "metric", unit: "Liter", abreviation: "L", toMilliLiter: 1000, toLiter: 1, toTeaSpoon: 202.88, toTableSpoon: 67.62, toCup: 4.227, toOnces: 33.814, toPint: 2.11, toGallon: 0.26 },
    { system: "both", unit: "TeaSpoon", abreviation: "tsp", toMilliLiter: 5, toLiter: 0.005, toTeaSpoon: 1, toTableSpoon: 0.3333, toCup: 0.02, toOnces: 0.16, toPint: 0.010, toGallon: 0.0013 },
    { system: "both", unit: "TableSpoon", abreviation: "tbs", toMilliLiter: 15, toLiter: 0.015, toTeaSpoon: 3, toTableSpoon: 1, toCup: 0.0625, toOnces: 0.5, toPint: 0.031, toGallon: 0.0039 },
    { system: "both", unit: "Cup", abreviation: "cup", toMilliLiter: 236.58, toLiter: 0.23, toTeaSpoon: 48, toTableSpoon: 16, toCup: 1, toOnces: 8, toPint: 0.5, toGallon: 0.062 },
    { system: "imperial", unit: "Onces", abreviation: "oz", toMilliLiter: 29.57, toLiter: 0.029, toTeaSpoon: 6, toTableSpoon: 2, toCup: 0.12, toOnces: 1, toPint: 0.062, toGallon: 0.0077 },
    { system: "imperial", unit: "Pint", abreviation: "pnt", toMilliLiter: 473.17, toLiter: 0.46, toTeaSpoon: 96, toTableSpoon: 32, toCup: 2, toOnces: 16, toPint: 1, toGallon: 0.12 },
    { system: "imperial", unit: "Gallon", abreviation: "gal", toMilliLiter: 3785.41, toLiter: 3.74, toTeaSpoon: 768, toTableSpoon: 256, toCup: 16, toOnces: 128, toPint: 8, toGallon: 1 },
]

const temperature = [
    { system: "imperial", unit: "Fahrenheit", abreviation: "F", toCelsius: "-32*0.5556", toFahrenheit: 1 },
    { system: "metric", unit: "Celsius", abreviation: "C", toCelsius: 1, toFahrenheit: "* 1.8 + 32" },
]

const ovenLevels = [
    { level: "Cool oven", imperial: "200 °F", metric: "90 °C" },
    { level: "Very slow oven", imperial: "250 °F", metric: "120 °C" },
    { level: "Slow oven", imperial: "300-325 °F", metric: "150-160 °C" },
    { level: "Moderately slow", imperial: "325-350 °F", metric: "160-180 °C" },
    { level: "Moderate oven", imperial: "350-375 °F", metric: "180-190 °C" },
    { level: "Moderately hot", imperial: "375-400 °F", metric: "190-200 °C" },
    { level: "Hot oven", imperial: "400-450 °F", metric: "200-230 °C" },
    { level: "Very hot oven", imperial: "450-500 °F", metric: "230-260 °C" },
    { level: "Fast oven", imperial: "450-500 °F", metric: "230-260 °C" },
]


const Conversions = () => {
    const [value, setValue] = useState(0)
    const [show, setShow] = useState("mass")

    // const pickerRef = useRef();

    // const [selectedLanguage, setSelectedLanguage] = useState();

    // if (show === "mass")
    //     console.log(mass)

    // function open() {
    //     pickerRef.current.focus();
    // }

    // function close() {
    //     pickerRef.current.blur();
    // }

    const MeasureView = ({ measure, value, setValue }) => {
        const [fromUnit, setFromUnit] = useState("Grams")
        const [toUnit, setToUnit] = useState("toGrams")
        const [toUnit2, setToUnit2] = useState("Grams")
        const [multi, setMulti] = useState(1)

        const [fromMass, setFromMass] = useState("Grams")
        const [toMass, setToMass] = useState("toGrams")
        const [toMass2, setToMass2] = useState("Grams")

        const [fromVolume, setFromVolume] = useState("MilliLiter")
        const [toVolume, setToVolume] = useState("toMilliLiter")
        const [toVolume2, setToVolume2] = useState("MilliLiter")

        const [fromTemperature, setFromTemperature] = useState("Celsius")
        const [toTemperature, setToTemperature] = useState("toCelsius")
        const [toTemperature2, setToTemperature2] = useState("Celsius")

        // useEffect(() => {

        //     if (show === 'mass') {
        //         setFromUnit("Grams")
        //         setToUnit("toGrams")
        //     } else if (show === "volume") {
        //         setFromUnit("MilliLiter")
        //         setToUnit("toMilliLiter")
        //     } else {
        //         setFromUnit("Celsius")
        //         setToUnit("toCelsius")
        //     }
        // }, [show])

        useEffect(() => {

            console.log(show, fromUnit, toUnit);

            const obj = (show === 'mass') ? mass.filter(elem => elem.unit === fromUnit)[0]
                : (show === 'volume') ? volume.filter(elem => elem.unit === fromUnit)[0]
                    : temperature.filter(elem => elem.unit === fromUnit)[0]


            // const obj = mass.filter(elem => elem.unit === fromUnit)[0]
            Object.keys(obj).forEach(key => {
                let value = obj[key];
                key === toUnit && setMulti(`${value}`);
                // console.log(`${key}: ${value}`);
            });
        }, [fromUnit, toUnit])


        const pickerToFc = (text) => {
            setToUnit(`to${text}`)
            setToUnit2(text)
        }
        return (


            <View style={styles.scene}>
                <View style={{
                    width: "90%", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15,
                    borderColor: 'black', borderStyle: 'solid', borderWidth: 1,
                }}>
                    <View style={{ width: '50%', alignItems: 'center' }}>
                        <TextInput
                            value={value}
                            onChangeText={setValue}
                            keyboardType="numeric"
                            style={{
                                width: '50%',
                                backgroundColor: 'white',
                            }}
                        />
                    </View>
                    <Picker
                        style={{ width: '50%' }}
                        selectedValue={fromUnit}
                        onValueChange={setFromUnit}
                        mode={'dropdown'}
                    // dropdownIconColor={'red'}

                    >
                        {measure === 'mass' ? mass.map((unit, i) => (
                            <Picker.Item label={unit.unit} value={unit.unit} key={i} />
                        )) : measure === 'volume' ? volume.map((unit, i) => (
                            <Picker.Item label={unit.unit} value={unit.unit} key={i} />
                        )) : temperature.map((unit, i) => (
                            <Picker.Item label={unit.unit} value={unit.unit} key={i} />
                        ))}
                    </Picker>

                </View>
                <SimpleLineIcons
                    name="arrow-down-circle"
                    size={40}
                    color={mainColor}
                    style={{ alignSelf: 'center' }}
                />
                <View style={{
                    width: "90%", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15,
                    borderColor: 'black', borderStyle: 'solid', borderWidth: 1,
                }}>
                    <View style={{ width: '50%', alignItems: 'center' }}>
                        <Text style={{ width: '50%', alignItems: 'center', fontSize: 20, fontWeight: 'bold', backgroundColor: 'white', textAlign: 'center' }}>
                            {(value * multi).toFixed(3)}
                        </Text>
                    </View>
                    <Picker
                        style={{ width: '50%' }}
                        selectedValue={toUnit2}
                        onValueChange={(text) => pickerToFc(text)}
                        mode={'dropdown'}
                    >
                        {measure === 'mass' ? mass.map((unit, i) => (
                            <Picker.Item label={unit.unit} value={unit.unit} key={i} />
                        )) : measure === 'volume' ? volume.map((unit, i) => (
                            <Picker.Item label={unit.unit} value={unit.unit} key={i} />
                        )) : temperature.map((unit, i) => (
                            <Picker.Item label={unit.unit} value={unit.unit} key={i} />
                        ))}
                    </Picker>

                </View>

                <View style={styles.container2}>
                    <DataTable style={{ width: 350 }}>
                        <DataTable.Header>
                            <DataTable.Title textStyle={{ fontSize: 15, fontWeight: 'bold' }}>Oven Level</DataTable.Title>
                            <DataTable.Title style={{ flexDirection: 'row', justifyContent: 'center' }} textStyle={{ fontSize: 15, fontWeight: 'bold' }}>Fahrenheit</DataTable.Title>
                            <DataTable.Title style={{ flexDirection: 'row', justifyContent: 'center' }} textStyle={{ fontSize: 15, fontWeight: 'bold' }}>Celsius</DataTable.Title>
                        </DataTable.Header>

                        {ovenLevels.map(level => <DataTable.Row key={uuid.v4()}>
                            <DataTable.Cell >{level.level}</DataTable.Cell>
                            <DataTable.Cell style={{ flexDirection: 'row', justifyContent: 'center' }}>{level.imperial}</DataTable.Cell>
                            <DataTable.Cell style={{ flexDirection: 'row', justifyContent: 'center' }}>{level.metric}</DataTable.Cell></DataTable.Row>
                        )}
                    </DataTable>
                </View>
            </View >

        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.switch}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '33%',
                        height: 30,
                        borderRadius: 10,
                        borderColor: (show === "mass") ? 'orange' : '#ffcc80',
                        borderWidth: 0.5,
                        backgroundColor: (show === "mass") ? 'orange' : '#ffcc80',
                        // position: 'absolute',
                        // left: 0,
                    }}
                        onPress={() => setShow("mass")}>
                        <Text>Mass</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '33%',
                        height: 30,
                        borderRadius: 10,
                        borderColor: (show === "volume") ? 'orange' : '#ffcc80',
                        borderWidth: 0.5,
                        backgroundColor: (show === "volume") ? 'orange' : '#ffcc80',
                        // position: 'absolute',
                        // right: '33%'
                    }}
                        onPress={() => setShow("volume")}>
                        <Text>Volume</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '33%',
                        height: 30,
                        borderRadius: 10,
                        borderColor: (show === "temperature") ? 'orange' : '#ffcc80',
                        borderWidth: 0.5,
                        backgroundColor: (show === "temperature") ? 'orange' : '#ffcc80',
                        // position: 'absolute',
                        // right: 0
                    }}
                        onPress={() => setShow("temperature")}>
                        <Text>Temperature</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <MeasureView measure={show} value={value} setValue={setValue} />
        </View>
    )
}

export default Conversions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        alignItems: "center"
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 30,
        marginVertical: 10,
        borderRadius: 10,
        borderColor: 'orange',
        borderWidth: 0.5,
        backgroundColor: '#ffcc80',
        // opacity: 0.2,
        // position: 'relative'
    },
    scene: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        // flex: 1,
        width: 200,
        height: 100

    },
    input: {
        width: '100%',
        backgroundColor: 'white',
    },
    container2: {
        // paddingTop: 100,
        // paddingHorizontal: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 0.5,
        width: '90%',
    },
})