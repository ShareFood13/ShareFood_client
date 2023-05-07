import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import Banner from '../../components/Banner'

export default function Donations({ navigation }) {
    return (
        <View style={styles.container}>
            <Banner title="Donate a Meal" />
            <Text>Donations</Text>
            <Button title='Click Me' onPress={() => alert('ToDo')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})