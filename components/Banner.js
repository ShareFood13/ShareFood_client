import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Banner = ({ title }) => {
    return (
        <Text style={styles.banner}>{title}</Text>
    )
}

export default Banner

const styles = StyleSheet.create({
    banner: {
        width: "90%",
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        fontSize: 18,
        marginVertical: 20,
        backgroundColor: "orange",
        // color: 'white',
    },
})