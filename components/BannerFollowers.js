import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native'
import React, { useState } from 'react'
import GlobalStyles from '../GlobalStyles'
const windowWidth = Dimensions.get('window').width;

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
import { Context } from '../context/UserContext';
import { useContext } from 'react';
import { useEffect } from 'react';
var theme = ""
var language = ""
var fontStyle = ""
const BannerFollowers = ({ countRecipe, userInfo, userImage }) => {
    // const [language, setLanguage] = useState("en")
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
        <View style={{
            flexDirection: "row",
            height: 60,
            width: "100%",
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginVertical: 25,
            backgroundColor: GlobalStyles[theme]?.paperColor,
            alignContent: 'center',
            position: 'relative',
        }}>
            <Image
                // source={require("../../assets/images/user-profile.jpeg")}
                // source={{ uri: userContext?.profilePicture }}
                source={{ uri: userImage ? userImage : userInfo?.profile?.profilePicture?.base64 }}
                style={{ height: 90, width: 90, borderRadius: 45, position: 'absolute', left: 20, borderColor: GlobalStyles[theme]?.fontColor, borderWidth: 0.5 }}
            />

            <View style={{ flexDirection: 'row', width: windowWidth - 150, justifyContent: 'space-between', right: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{countRecipe}</Text>
                    <Text style={{ fontSize: 16, color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.RECIPES}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{userContext?.profile?.followers?.length}</Text>
                    <Text style={{ fontSize: 16, color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.FOLLOWERS}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{userContext?.profile?.following?.length}</Text>
                    <Text style={{ fontSize: 16, color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>{trans[language]?.FOLLOWING}</Text>
                </View>
            </View>
        </View>

    )
}

export default BannerFollowers

const styles = StyleSheet.create({})