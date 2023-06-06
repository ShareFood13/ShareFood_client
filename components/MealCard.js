import React, { useEffect, useState, useCallback, useContext } from 'react'

import {
    View,
    Text,
    Button,
    StyleSheet,
    RefreshControl,
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
    ActivityIndicator,
    FlatList,
    SafeAreaView
} from 'react-native'

import uuid from 'react-native-uuid';

const windowWidth = Dimensions.get('window').width


import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import GlobalStyles from '../GlobalStyles';

const logos = [
    { name: "Vegan", image: require('../assets/images/logo/vegan.png') },
    { name: "Organic", image: require('../assets/images/logo/organic.png') },
    { name: "Gluten Free", image: require('../assets/images/logo/glutenFree.png') },
    { name: "Lactose Free", image: require('../assets/images/logo/lactoseFree.png') },
    { name: "Egg Free", image: require('../assets/images/logo/eggFree2.png') },
    { name: "Nut Free", image: require('../assets/images/logo/nutFree.png') },
    { name: "Less Sugar", image: require('../assets/images/logo/lessSugar.png') },
    { name: "Low Fat", image: require('../assets/images/logo/lowFat.png') },
    { name: "Contain Nuts", image: require('../assets/images/logo/containNuts.png') },
    { name: "No Molluses", image: require('../assets/images/logo/noMolluses.png') },
    { name: "Zero Fat", image: require('../assets/images/logo/zeroFat.png') },
    { name: "Raw Food", image: require('../assets/images/logo/rawFood.png') },
    { name: "Safe For Kids", image: require('../assets/images/logo/safeForKids.png') },
    { name: "Spicy", image: require('../assets/images/logo/spicy.png') },
    { name: "Constain Soybean", image: require('../assets/images/logo/constainSoybean.png') },
    { name: "Contain Custacean", image: require('../assets/images/logo/containCustacean.png') },
    { name: "Halal", image: require('../assets/images/logo/chalal.png') },
    { name: "Kosher", image: require('../assets/images/logo/kosher.png') },

    // { name: "Gluten Free2", image: require('../assets/images/logo/glutenFree2.png') },
    // { name: "Milk Free2", image: require('../assets/images/logo/milkFree2.png') },
    // { name: "Sugar Free2", image: require('../assets/images/logo/sugarFree2.png') },
    // { name: "Vegan2", image: require('../assets/images/logo/vegan2.png') },
    // { name: "Wheat Free2", image: require('../assets/images/logo/wheatFree2.png') },
]

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
var theme = ""
var language = ""
var fontStyle = ""
export default function MealCard({ meal, navigation, openMeal, remove, editMeal, delMeal }) {
    const [modalAlert, setModalAlert] = useState(false)
    const [mealDelete, setMealDelete] = useState({})
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
        <View
            style={{
                flexDirection: 'row',
                width: '100%',
                height: 90,
                justifyContent: 'space-between',
                alignSelf: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginBottom: 10,
                borderWidth: 0.5,
                borderStyle: 'solid',
                borderRadius: 10,
                borderColor: GlobalStyles[theme]?.borderColor,
                backgroundColor: GlobalStyles[theme]?.paperColor,
            }}>

            <TouchableOpacity
                onPress={() => openMeal(meal)}
                style={{ width: '90%', height: '75%', }}
            >
                <View>
                    <Text style={{
                        fontSize: 16,
                        color: GlobalStyles[theme]?.fontColor,
                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                    }}>
                        {meal?.mealName}
                    </Text>
                    <View style={[{ width: '100%', flexDirection: 'row', fontFamily: GlobalFontStyles[fontStyle]?.fontStyle }]} >
                        {meal?.tags?.map(item => <Text key={uuid.v4()} style={{
                            color: GlobalStyles[theme]?.fontColor,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                        }}>{item}, </Text>)}
                    </View>
                </View>
            </TouchableOpacity>

            <View style={{ height: 60, justifyContent: 'space-between', }}>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => editMeal(meal)}>
                    <Feather name="edit-3" size={24} color={GlobalStyles[theme]?.fontColor} />
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { setModalAlert(true); setMealDelete(meal) }}>
                    <AntDesign name="delete" size={24} color={GlobalStyles[theme]?.fontColor} />
                </TouchableOpacity>
            </View>

            {/* // Modal Alert// */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalAlert}>

                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={[{
                        width: 350,
                        maxHeight: 400,
                        alignItems: "flex-start",
                        padding: 30,
                        borderWidth: 0.5,
                        borderRadius: 10,
                        elevation: 5,
                    }, {
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.paperColor
                    }]}>
                        <View>
                            <Text style={{
                                fontSize: 16,
                                marginBottom: 10,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                color: GlobalStyles[theme]?.fontColor,
                            }}>
                                {trans[language]?.ARE_YOU_SURE}
                            </Text>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                color: GlobalStyles[theme]?.fontColor,
                            }}>
                                {trans[language]?.PERMANTLY_DELETING}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-around", marginTop: 20 }}>
                            <TouchableOpacity
                                onPress={() => delMeal(meal)}>
                                <Text style={{
                                    color: GlobalStyles[theme]?.buttonColor,
                                    fontSize: 16,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {trans[language]?.DELETE}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setModalAlert(false); setMealDelete({}) }}>
                                <Text style={{
                                    color: GlobalStyles[theme]?.buttonColor,
                                    fontSize: 16,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                                }}>
                                    {trans[language]?.CANCEL}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
    },
    image: {
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    recipeCard: {
        width: "90%",
        height: 100,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
})