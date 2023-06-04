import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Root, SPSheet } from 'react-native-popup-confirm-toast'

import React, { useState } from 'react'
import GlobalStyles from '../GlobalStyles'
import { useFonts } from 'expo-font';
import GlobalFontStyles from '../GlobalFontStyles'
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

const SpSheet = ({ text, children, heightValue }) => {
    const [theme, setTheme] = useState('stylesLight')
    const [fontStyle, setFontStyle] = useState("Montserrat")
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

    const TestComp = () => {
        return (
            children
        )
    }
    return (
        <Root>
            <View>
                <TouchableOpacity
                    style={[{
                        height: 40,
                        width: 230,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        marginBottom: 0,
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        borderStyle: 'solid',
                        borderWidth: 0.5,
                    }, { 
                        borderColor: GlobalStyles[theme].borderColor,
                        backgroundColor: GlobalStyles[theme].buttonColor 
                    }]}
                    onPress={() => {
                        const spSheet = SPSheet;
                        spSheet.show({
                            component: () => TestComp(),
                            dragTopOnly: true,
                            height: heightValue,
                            keyboardHeightAdjustment: true,//boolean	re-adjusts the height when the keyboard is opened	false
                            // background: GlobalStyles[theme].background, 	        //string	'red',rgba(0, 0, 0, 0.5)
                            // height:	  500          //number	auto height (min: 250)	250
                            // duration:	        //number	animation time used when opening	250(ms)
                            // closeDuration:	    //number	animation time used when closing	300(ms)
                            // closeOnDragDown:	    //boolean	Use drag with motion to close the window	true
                            // closeOnPressMask:    //boolean	press the outside space to close the window	true
                            // closeOnPressBack:	//boolean	Press the back key to close the window (Android only)	true
                            // dragTopOnly:	        //boolean	use only the top area of the draggable icon to close the window	false
                            // component:	        //component(hook or class)	custom modal component container	null
                            // onOpen:	            //function	works after the window is opened	null
                            // onOpenComplete:	    //function	works after the window is opened	null
                            // onClose:	            //function	works after window is closed	null
                            // onCloseComplete:	    //function	works after window is closed	null
                            // customStyles:	    //object	customStyles: { draggableIcon: {}, container: {}, draggableContainer:{} }	{}
                            // timing:	            //number	Use this parameter for automatic shutdown.	0(ms)
                        });
                    }}
                >

                    <Text style={{ color: GlobalStyles[theme].fontColor, fontSize: 16, fontFamily: GlobalFontStyles[fontStyle].fontStyle }}>{text}</Text>
                </TouchableOpacity>
            </View>
        </Root>
    )
}

export default SpSheet

const styles = StyleSheet.create({
    genericButton: {
        height: 40,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 0.5,
    },
})