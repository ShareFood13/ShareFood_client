import React, { useState } from 'react'
import { StyleSheet, Text, View, Modal, Dimensions } from 'react-native'
import GlobalStyles from '../GlobalStyles'

const windowHeight = Dimensions.get("window").height
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
import trans from '../Language'
import { useContext } from 'react';
import { Context } from '../context/UserContext';
import { useEffect } from 'react';
var theme = ""
var language = ""
var fontStyle = ""
const PopupModal = ({ message, popupModal }) => {
    // const [language, setLanguage] = useState("en")
    // const [theme, setTheme] = useState("stylesLight")
    // const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Lato_400Regular,
        Montserrat_400Regular,
        // Oswald_400Regular,
        // SourceCodePro_400Regular,
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
        <Modal
            animationType="none"
            transparent={true}
            visible={popupModal}
        >
            <View style={{ flex: 1, top: windowHeight * 0.75, alignItems: 'center' }}>
                <View style={{
                    flexDirection: 'row',
                    width: '90%',
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    borderWidth: 0.5,
                    borderStyle: 'solid',
                    borderRadius: 20,
                    borderColor: GlobalStyles[theme]?.borderColor,
                    backgroundColor: GlobalStyles[theme]?.paperColor,
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: GlobalStyles[theme]?.fontColor,
                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                    }}>
                        {message}
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export default PopupModal

const styles = StyleSheet.create({})