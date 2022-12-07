import React, { useEffect, useState } from 'react'
import { Text, View, Button, Image, StyleSheet } from 'react-native'

import Loading from './Loading'

export default function Wellcome({ navigation }) {

    return (
        <View style={styles.container}>
            <Image source={require("../assets/images/favicon.png")} />
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>ShareFood</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#30D5C8",
        justifyContent: "center",
        alignItems: "center"
    }
})