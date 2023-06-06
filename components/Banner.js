import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import GlobalStyles from '../GlobalStyles'
import { useFonts } from 'expo-font';
import {
    Roboto_400Regular,
    Lato_400Regular,
    Montserrat_400Regular,
    Oswald_400Regular,
    SourceCodePro_400Regular,
    Slabo27px_400Regular,
    Poppins_400Regular,
    Lora_400Regular,
    Rubik_400Regular,
    PTSans_400Regular,
    Karla_400Regular
} from '@expo-google-fonts/dev';
import GlobalFontStyles from '../GlobalFontStyles';

import { Context } from '../context/UserContext';
import { useContext } from 'react';
import { useEffect } from 'react';
var theme = ""
var language = ""
var fontStyle = ""

const Banner = ({ title }) => {
    // const [theme, setTheme] = useState("stylesLight")
    // const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Lato_400Regular,
        Montserrat_400Regular,
        Oswald_400Regular,
        SourceCodePro_400Regular,
        Slabo27px_400Regular,
        Poppins_400Regular,
        Lora_400Regular,
        Rubik_400Regular,
        PTSans_400Regular,
        Karla_400Regular
    })
    
    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])

    return (
        <Text style={[styles.banner, {
            backgroundColor: GlobalStyles[theme]?.bannerColor, 
            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
        }]}>{title}</Text>
    )
}

export default Banner

const styles = StyleSheet.create({
    banner: {
        width: "100%",
        height: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 20,
        fontSize: 18,
        marginBottom: 10,
    },
})