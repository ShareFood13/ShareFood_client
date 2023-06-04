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
    Alert,
    StatusBar,
    RefreshControl,
    ImageBackground,
    FlatList
} from 'react-native'
import React, { useState } from 'react'
import uuid from 'react-native-uuid';


import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';

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


const logos = [
    { name: "Vegan", image: require('./../assets/images/logo/vegan.png') },
    { name: "Organic", image: require('./../assets/images/logo/organic.png') },
    { name: "Gluten Free", image: require('./../assets/images/logo/glutenFree.png') },
    { name: "Lactose Free", image: require('./../assets/images/logo/lactoseFree.png') },
    { name: "Egg Free", image: require('./../assets/images/logo/eggFree2.png') },
    { name: "Nut Free", image: require('./../assets/images/logo/nutFree.png') },
    { name: "Less Sugar", image: require('./../assets/images/logo/lessSugar.png') },
    { name: "Low Fat", image: require('./../assets/images/logo/lowFat.png') },
    { name: "Contain Nuts", image: require('./../assets/images/logo/containNuts.png') },
    { name: "No Molluses", image: require('./../assets/images/logo/noMolluses.png') },
    { name: "Zero Fat", image: require('./../assets/images/logo/zeroFat.png') },
    { name: "Raw Food", image: require('./../assets/images/logo/rawFood.png') },
    { name: "Safe For Kids", image: require('./../assets/images/logo/safeForKids.png') },
    { name: "Spicy", image: require('./../assets/images/logo/spicy.png') },
    { name: "Constain Soybean", image: require('./../assets/images/logo/constainSoybean.png') },
    { name: "Contain Custacean", image: require('./../assets/images/logo/containCustacean.png') },
    { name: "Halal", image: require('./../assets/images/logo/chalal.png') },
    { name: "Kosher", image: require('./../assets/images/logo/kosher.png') },

    // { name: "Gluten Free2", image: require('../../assets/images/logo/glutenFree2.png') },
    // { name: "Milk Free2", image: require('../../assets/images/logo/milkFree2.png') },
    // { name: "Sugar Free2", image: require('../../assets/images/logo/sugarFree2.png') },
    // { name: "Vegan2", image: require('../../assets/images/logo/vegan2.png') },
    // { name: "Wheat Free2", image: require('../../assets/images/logo/wheatFree2.png') },
]

const ShowMealDetail = ({ meal, recipes, sDietMeal, closeModal }) => {
    const [language, setLanguage] = useState("en")
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
        <View style={styles.centeredView}>
            {/* <View style={styles.mealCard}>
                <ImageBackground source={require('./../assets/images/linePaper.png')} style={{ width: '100%', height: 350 }}
                    imageStyle={{ resizeMode: 'cover' }}>

                    <TouchableOpacity onPress={() => closeModal()}
                        style={{
                            width: "100%",
                            alignItems: 'flex-end',
                            marginTop: 5,
                            marginRight: 40,
                            marginBottom: 0
                        }}>
                        <EvilIcons name="close-o" size={30} color="black" />
                    </TouchableOpacity>

                    <View style={styles.mealShow}>
                        <Text style={{ fontSize: 20, marginBottom: 18 }}>{meal?.mealName}</Text>
                        <View style={{ height: 150, width: '90%', justifyContent: 'space-around', alignItems: 'center' }}>
                            {meal?.recipesId.map(recipeId =>
                                // userContext?.result?.recipesId.map
                                recipes.map(item => {
                                    if (item._id === recipeId && item.isDeleted === false) {
                                        return <Text key={uuid.v4()} style={{ fontSize: 16 }}>{item.recipeName}</Text>
                                    }
                                })
                            )}
                        </View>
                    </View>
                </ImageBackground>
            </View> */}

            <View style={styles.container}>
                <View style={styles.notebook}>
                    <View style={styles.linesContainer}>

                        <TouchableOpacity onPress={() => closeModal()}
                            style={{
                                width: "100%",
                                alignItems: 'flex-end',
                                marginTop: 1,
                                marginRight: 40,
                                marginBottom: 0,
                                position: 'absolute'
                            }}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>

                        {[...Array(20)].map((_, index) => (
                            <View key={index} style={styles.line} >
                                {index === 1 && <Text style={{ fontSize: 20, marginBottom: 18, position: 'absolute', paddingLeft: 20, fontFamily: GlobalFontStyles[fontStyle].fontStyle }}>{meal?.mealName}</Text>}
                            </View>
                        ))}

                        <View style={{
                            height: 350,
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            position: 'absolute',
                            top: "16.5%",
                        }}>
                            {meal?.recipesId.map(recipeId =>
                                // userContext?.result?.recipesId.map
                                recipes.map((item, index) => {
                                    if (item._id === recipeId && item.isDeleted === false) {
                                        return <Text key={uuid.v4()} style={{ fontSize: 16, top: 30 * index, fontFamily: GlobalFontStyles[fontStyle].fontStyle }}>{item.recipeName}</Text>
                                    }
                                })
                            )}
                        </View>

                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 0, height: '10%' }}>
                {sDietMeal?.map(item => {
                    return logos.map(logo =>
                        (logo.name === item)
                        && <Image
                            key={uuid.v4()}
                            resizeMode='contain'
                            source={logo.image}
                            style={{
                                height: 45, width: 45, margin: 5, alignSelf: 'center',
                            }} />

                    )
                })}
            </View>
        </View >
    )
}

export default ShowMealDetail

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'grey'
    },
    mealCard: {
        width: '95%',
        height: 330,
        // borderStyle: 'solid',
        // borderWidth: 0.3,
        // borderColor: 'black',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    mealShow: {
        justifyContent: 'space-between',
        width: '80%',
        height: 150,
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'black',
        alignItems: 'flex-start',
        marginLeft: 50,
        paddingHorizontal: 10,
    },
    container: {
        // height: '70%',
        // backgroundColor: 'cyan',
        // top: '20%',
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        position: 'relative'
    },
    notebook: {
        width: '90%',
        aspectRatio: 0.7,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    linesContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    line: {
        height: 1,
        backgroundColor: '#000',
        opacity: 0.3,
    },
})