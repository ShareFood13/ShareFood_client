import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function Share({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Share</Text>
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