import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import Banner from '../../components/Banner'

export default function MySettings({ navigation }) {
    return (
        <View style={styles.container}>
            <Banner title="My Settings" />
            <Text>Search Bar</Text>
            <Text>Language: en, he, pt, sp, </Text>
            <Text>System: metric or imperial</Text>
            <Text>Global Privacy: Public or Private</Text>
            <Text>System: Metric or Imperial</Text>
            <Text>Notifications</Text>
            <Text>Security</Text>
            <Text>Ads</Text>
            <Text>Account</Text>
            <Text>About</Text>
            <Text>Theme: light, dark</Text>
            <Text>MyBook Pagination: none, default, custom</Text>

            <Text>Location: automatico eu acho</Text>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    }
})