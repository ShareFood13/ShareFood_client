import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {

    const [user, setUser] = useState()

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUser(JSON.parse(await AsyncStorage.getItem('profile')))
    }

    // console.log(user);

    return (
        <View style={styles.container}>
            <Text>{user?.result?.name}</Text>
            <Button title='Click Me' onPress={() => alert('ToDo')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})