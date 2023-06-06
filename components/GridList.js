import React, {useState} from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native'
import { MaterialIcons, Foundation } from '@expo/vector-icons';
import GlobalStyles from '../GlobalStyles';
import { useContext } from 'react';
import { Context } from '../context/UserContext';
import { useEffect } from 'react';
var theme = ""
var language = ""
var fontStyle = ""

const GridList = ({ showPictures, setShowPictures }) => {
    // const [theme, setTheme] = useState("stylesLight")

    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])

    return (
        <View
            style={{
                flexDirection: 'row',
                width: '70%',
                justifyContent: 'space-around',
                alignSelf: 'center',
                height: 30,
                alignItems: 'flex-start',
                marginBottom: 10,
            }}
        >
            <View style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                borderBottomWidth: showPictures === "grid" ? 2 : 0,
                borderBottomColor: GlobalStyles[theme]?.fontColor,
                marginBottom: 10,
            }}>
                <TouchableOpacity onPress={() => setShowPictures("grid")}>
                    <MaterialIcons name="grid-on" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                </TouchableOpacity>
            </View>
            <View style={{
                justifyContent: 'flex-start',
                // alignSelf: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                borderBottomWidth: showPictures === "grid" ? 0 : 2,
                borderBottomColor: GlobalStyles[theme]?.fontColor,
                marginBottom: 10,
            }}>
                <TouchableOpacity onPress={() => setShowPictures("list")}>
                    <Foundation name="list" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default GridList

const styles = StyleSheet.create({})