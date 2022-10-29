import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function Profile02({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Profile02</Text>
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