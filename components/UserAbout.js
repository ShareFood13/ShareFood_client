import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Dimensions
} from 'react-native'
import React from 'react'
import GlobalStyles from '../GlobalStyles'
import { useState } from 'react'
import { Entypo, MaterialIcons, Foundation, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

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
const UserAbout = ({  setMoreHeight, moreHeight }) => {
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
    // console.log("UserAbout", userContext)
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
            backgroundColor: GlobalStyles[theme]?.paperColor,
            marginHorizontal: 10,
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 0.5,
            borderColor: GlobalStyles[theme]?.fontColor,
            // paddingVertical: 10
        }}>
            <View style={moreHeight && { maxHeight: 100, overflow: 'hidden' }}>
                <Text style={{ width: '100%', padding: 10, textAlign: 'justify', alignSelf: 'center', marginBottom: 5, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>
                    {userContext?.profile?.personalDescription}
                </Text>

                {userContext?.profile?.socialMediaHandles?.facebook &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="facebook" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                        <Text style={{ textAlignVertical: 'center', fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{userContext?.profile?.socialMediaHandles?.facebook}</Text>
                    </View>
                }
                {userContext?.profile?.socialMediaHandles?.instagram &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="instagram" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                        <Text style={{ textAlignVertical: 'center', fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{userContext?.profile?.socialMediaHandles?.instagram}</Text>
                    </View>
                }
                {userContext?.profile?.socialMediaHandles?.pinterest &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="pinterest" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                        <Text style={{ textAlignVertical: 'center', fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{userContext?.profile?.socialMediaHandles?.pinterest}</Text>
                    </View>
                }
                {userContext?.profile?.socialMediaHandles?.tiktok &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <FontAwesome5 name="tiktok" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                        <Text style={{ textAlignVertical: 'center', fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{userContext?.profile?.socialMediaHandles?.tiktok}</Text>
                    </View>
                }
                {userContext?.profile?.socialMediaHandles?.blog &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <FontAwesome5 name="blogger" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                        <Text style={{ textAlignVertical: 'center', fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{userContext?.profile?.socialMediaHandles?.blog}</Text>
                    </View>
                }
            </View>
            <TouchableOpacity onPress={() => setMoreHeight(!moreHeight)} style={{ width: "100%", alignContent: 'flex-end' }}>
                {moreHeight
                    ? <Text style={{ textAlign: 'right', right: 10, bottom: 5, fontSize: 15, color: GlobalStyles[theme]?.buttonColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>...{trans[language]?.MORE}</Text>
                    : <Text style={{ textAlign: 'right', right: 10, bottom: 5, fontSize: 15, color: GlobalStyles[theme]?.buttonColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }}>...{trans[language]?.LESS}</Text>}
            </TouchableOpacity>
        </View>
    )
}

export default UserAbout

const styles = StyleSheet.create({})