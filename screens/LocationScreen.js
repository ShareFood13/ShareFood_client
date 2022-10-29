import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';

import * as Location from 'expo-location';

export default function LocationScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        load()
    }, []);

    async function load() {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync();

        setLocation(location);
    }

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        const { latitude, longitude } = location.coords
        const { timestamp } = location
        let date = (new Date(timestamp)).toString()
        alert(`latitude: ${latitude}, \nlongitude: ${longitude}, \ndate: ${date}`);
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
