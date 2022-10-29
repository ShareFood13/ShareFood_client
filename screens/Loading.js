import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function Loading({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
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