import React, {useState} from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import GlobalStyles from '../../GlobalStyles'
import GlobalFontStyles from '../../GlobalFontStyles'
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

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselCardItem = ({ item, index }) => {
    const [theme, setTheme] = useState("stylesLight")
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
        <View style={[styles.container, {backgroundColor: GlobalStyles[theme].background}]} key={index}>
            <Image
                source={{ uri: item.imgUrl }}
                style={styles.image}
            />
            <Text style={[styles.header, {color: GlobalStyles[theme].fontColor, fontFamily: GlobalFontStyles[fontStyle].fontStyle}]}>{item.title}</Text>
            <Text style={[styles.body, {color: GlobalStyles[theme].fontColor, fontFamily: GlobalFontStyles[fontStyle].fontStyle}]}>{item.body}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        width: ITEM_WIDTH,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    image: {
        width: ITEM_WIDTH,
        height: 300,
    },
    header: {
        // color: "#222",
        fontSize: 28,
        fontWeight: "bold",
        paddingLeft: 20,
        paddingTop: 20
    },
    body: {
        // color: "#222",
        fontSize: 18,
        paddingHorizontal: 20
        // paddingLeft: 20,
        // paddingLeft: 20,
        // paddingRight: 20,
    }
})

export default CarouselCardItem