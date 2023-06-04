import React, { useEffect, useState } from 'react'

import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Pressable,
    Modal,
    ScrollView,
    Image,
    Dimensions,
    Alert
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import GlobalFontStyles from '../GlobalFontStyles';
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

const SwitchButton = ({ text01, text02, setShow, show }) => {
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

    return (
        <View style={styles.switch}>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50%',
                height: 30,
                borderRadius: 10,
                borderColor: (show === text01) ? 'orange' : '#ffcc80',
                borderWidth: 0.5,
                backgroundColor: (show === text01) ? 'orange' : '#ffcc80',
                position: 'absolute',
                left: 0,
            }}
                onPress={() => setShow(text01)}>
                <Text style={{fontFamily: GlobalFontStyles[fontStyle].fontStyle}}>{text01}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50%',
                height: 30,
                borderRadius: 10,
                borderColor: (show !== text01) ? 'orange' : '#ffcc80',
                borderWidth: 0.5,
                backgroundColor: (show !== text01) ? 'orange' : '#ffcc80',
                position: 'absolute',
                right: 0
            }}
                onPress={() => setShow(text02)}>
                <Text style={{fontFamily: GlobalFontStyles[fontStyle].fontStyle}}>{text02}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SwitchButton

const styles = StyleSheet.create({
    switch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 30,
        marginVertical: 10,
        borderRadius: 10,
        borderColor: 'orange',
        borderWidth: 0.5,
        backgroundColor: '#ffcc80',
        // opacity: 0.2,
        position: 'relative'
    }
})