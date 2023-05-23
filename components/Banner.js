import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import GlobalStyles from '../GlobalStyles'

const Banner = ({ title }) => {
    const [theme, setTheme] = useState("stylesLight")

    return (
        <Text style={[styles.banner, {backgroundColor: GlobalStyles[theme].bannerColor,}]}>{title}</Text>
    )
}

export default Banner

const styles = StyleSheet.create({
    banner: {
        width: "100%",
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
        marginBottom: 10,
        
        // color: 'white',
    },
})