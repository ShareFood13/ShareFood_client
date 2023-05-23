import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// import {
//     useFonts,
//     BalsamiqSans_400Regular,
//     BalsamiqSans_400Regular_Italic,
//     BalsamiqSans_700Bold,
//     BalsamiqSans_700Bold_Italic,
// } from '@expo-google-fonts/balsamiq-sans';
// import {Inter_900Black,} from '@expo-google-fonts/inter';
// import { Bangers_400Regular } from "@expo-google-fonts/bangers"
// import { Allan_400Regular, Allan_700Bold } from '@expo-google-fonts/allan';
import {
    useFonts,
    RobotoCondensed_400Regular,
    RobotoCondensed_400Regular_Italic,
    RobotoMono_400Regular,
    RobotoMono_400Regular_Italic,
    RobotoSerif_400Regular,
    RobotoSerif_400Regular_Italic,
    RobotoSerif_500Regular,
    RobotoSerif_500Regular_Italic,
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_300Light_Italic,
    
    Nunito_400Regular,
    Lato_400Regular,
    Inter_900Black,
    Allan_400Regular, 
    Allan_700Bold,
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold,
    BalsamiqSans_700Bold_Italic,
    Bangers_400Regular,
    DancingScript_400Regular,
    DancingScript_700Bold,
    Calligraffitti_400Regular,
    Miniver_400Regular,
    ABeeZee_400Regular,
    ABeeZee_400Regular_Italic,
    Abel_400Regular,
    AbhayaLibre_400Regular,
    AbhayaLibre_500Medium,
    AbhayaLibre_600SemiBold,
    AbhayaLibre_700Bold,
    AbhayaLibre_800ExtraBold,
    Aboreto_400Regular,
    AbrilFatface_400Regular,
    AbyssinicaSIL_400Regular,
    Aclonica_400Regular,

  } from '@expo-google-fonts/dev';

const StylesText = ({ title, style00 }) => {
    console.log("StylesText", title, style00)

    const [fontsLoaded] = useFonts({
        Inter_900Black,
        BalsamiqSans_400Regular,
        BalsamiqSans_400Regular_Italic,
        BalsamiqSans_700Bold,
        BalsamiqSans_700Bold_Italic,
        Bangers_400Regular,
        Allan_400Regular,
        Allan_700Bold,
        Lato_400Regular,
        Nunito_400Regular,
        DancingScript_400Regular,
        DancingScript_700Bold,
        Calligraffitti_400Regular,
        Miniver_400Regular,
        Allan_400Regular,
        
        
    });

    if (!fontsLoaded) {
        return null;
    } else {
        return (
            <View>
                <Text style={[styles.text, style00]}>{title}</Text>
            </View>
        )
    }
}

export default StylesText

const styles = StyleSheet.create({
    text: {
        fontSize: 25
    }
})

// San Francisco (iOS)
// SF pro display
// SF pro text
// Proxima Nova
// Lato
// Nexa
// Open Sans
// Montserrat
// Playfair Display
// Roboto
// Source Sans
// Nunito

// iFont