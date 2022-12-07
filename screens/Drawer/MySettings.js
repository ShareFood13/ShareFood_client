import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function MySettings({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>My Settings</Text>
            <Text>Search Bar</Text>
            <Text>Language</Text>
            <Text>Location</Text>
            <Text>System: metric or imperial</Text>
            <Text>Privacy: Public or Private</Text>
            <Text>Notifications</Text>
            <Text>Security</Text>
            <Text>Ads</Text>
            <Text>Account</Text>
            <Text>About</Text>
            <Text>Theme</Text>



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