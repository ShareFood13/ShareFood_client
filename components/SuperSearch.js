import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Alert, Modal, FlatList } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'

import { Fontisto, FontAwesome, EvilIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { superSearch } from '../Redux/actions/superSearch';
import { Context } from '../context/UserContext';

const foodCourses = [
    { key: 1, value: "Hors d'oeuvre (Appetizer)" },
    { key: 2, value: "Potage (Soup)" },
    { key: 3, value: "Oeufs (Eggs)" },
    { key: 4, value: "Farineaux (Rice & Pasta)" },
    { key: 5, value: "Poisson (Fish)" },
    { key: 6, value: "Entrée (entry of 1st meat course)" },
    { key: 7, value: "Reléve (Meat Course)" },
    { key: 8, value: "Sorbet (Flavoured Water)" },
    { key: 9, value: "Rôti (Roast)" },
    { key: 10, value: "Légume (Vegetables)" },
    { key: 11, value: "Salade (Salad)" },
    { key: 12, value: "Buffet Froid (Cold Buffet)" },
    { key: 13, value: "Entremet de sûcre (Sweets)" },
    { key: 14, value: "Savoureaux (Savoury)" },
    { key: 15, value: "Fromage (Cheese)" },
    { key: 16, value: "Desserts (Fresh fruits & Nuts)" },
    { key: 17, value: "Café (Coffee)" },
    { key: 18, value: "Pain (Bread)" },
]

const logos = [
    { key: 1, value: "Vegan", image: require('./../assets/images/logo/vegan.png') },
    { key: 2, value: "Organic", image: require('./../assets/images/logo/organic.png') },
    { key: 3, value: "Gluten Free", image: require('./../assets/images/logo/glutenFree.png') },
    { key: 4, value: "Lactose Free", image: require('./../assets/images/logo/lactoseFree.png') },
    { key: 5, value: "Egg Free", image: require('./../assets/images/logo/eggFree2.png') },
    { key: 6, value: "Nut Free", image: require('./../assets/images/logo/nutFree.png') },
    { key: 7, value: "Less Sugar", image: require('./../assets/images/logo/lessSugar.png') },
    { key: 8, value: "Low Fat", image: require('./../assets/images/logo/lowFat.png') },
    { key: 9, value: "Contain Nuts", image: require('./../assets/images/logo/containNuts.png') },
    { key: 10, value: "No Molluses", image: require('./../assets/images/logo/noMolluses.png') },
    { key: 11, value: "Zero Fat", image: require('./../assets/images/logo/zeroFat.png') },
    { key: 12, value: "Raw Food", image: require('./../assets/images/logo/rawFood.png') },
    { key: 13, value: "Safe For Kids", image: require('./../assets/images/logo/safeForKids.png') },
    { key: 14, value: "Spicy", image: require('./../assets/images/logo/spicy.png') },
    { key: 15, value: "Constain Soybean", image: require('./../assets/images/logo/constainSoybean.png') },
    { key: 16, value: "Contain Custacean", image: require('./../assets/images/logo/containCustacean.png') },
    { key: 17, value: "Halal", image: require('./../assets/images/logo/chalal.png') },
    { key: 18, value: "Kosher", image: require('./../assets/images/logo/kosher.png') },

    // {  key: 1, name: "Gluten Free2", image: require('./../assets/images/logo/glutenFree2.png') },
    // {  key: 1, name: "Milk Free2", image: require('./../assets/images/logo/milkFree2.png') },
    // {  key: 1, name: "Sugar Free2", image: require('./../assets/images/logo/sugarFree2.png') },
    // {  key: 1, name: "Vegan2", image: require('./../assets/images/logo/vegan2.png') },
    // {  key: 1, name: "Wheat Free2", image: require('./../assets/images/logo/wheatFree2.png') },
]

const windowWidth = Dimensions.get("window").width
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
import GlobalStyles from '../GlobalStyles';
import GlobalFontStyles from './../GlobalFontStyles';
import GlobalTextStyles from '../GlobalTextStyles';
import trans from '../Language'

var theme = ""
var language = ""
var fontStyle = ""

const SuperSearch = () => {
    const dispatch = useDispatch();

    const [textToSearch, setTextToSearch] = useState("")
    const [restrictions, setRestrictions] = useState({ sDiet: "", foodCourses: "" })
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false)

    const [text, setText] = useState('normalText')

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

    const MODAL_TITLE = trans[language]?.HOW_TO_SEARCH
    const MODAL_MSG = trans[language]?.SEARCH_MSG

    const onChangeSearch = (text) => {
        setTextToSearch(text)
    }

    const searchFn = () => {
        dispatch(superSearch(textToSearch, restrictions))
    }

    const onChange = (type, select) => {
        setRestrictions({ ...restrictions, [type]: select })
        setModalVisible(false)
        setModalVisible2(false)
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: "center",
            width: windowWidth,
            padding: 10,
            backgroundColor: GlobalStyles[theme]?.background
        }}>

            <View style={{ width: "100%", height: 25 }}>
                <TouchableOpacity
                    style={{ width: 25, alignSelf: 'flex-end', alignItems: 'center' }}
                    onPress={() => setModalVisible3(true)}>
                    <FontAwesome name="question-circle-o" size={25} color={GlobalStyles[theme]?.fontColor} />
                </TouchableOpacity>
            </View>

            <View style={[{
                flexDirection: 'row',
                width: "100%",
                height: 50,
                borderBottomWidth: 2,
                borderRadius: 10,
                marginTop: 10,
                backgroundColor: GlobalStyles[theme]?.paperColor,
                borderBottomColor: GlobalStyles[theme]?.borderColor,
            }, {
                // width: windowWidth - 20,
                // alignSelf: 'center',
                // justifyContent: 'space-between',
            }]}>
                <TextInput
                    onChangeText={text => onChangeSearch(text)}
                    placeholder={trans[language]?.SEARCH_FOR}
                    placeholderTextColor={GlobalStyles[theme]?.fontColor}
                    value={textToSearch}
                    style={[{
                        width: "90%",
                        alignSelf: 'center',
                        fontSize: 15,
                        paddingLeft: 10,
                        // height: "100%",
                    }, {
                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        color: GlobalStyles[theme]?.fontColor
                    }]}
                />
                <TouchableOpacity onPress={searchFn} style={{
                    width: "10%",
                    textAlign: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                }}>
                    <Fontisto name="search" size={24} color={GlobalStyles[theme]?.fontColor} />
                </TouchableOpacity>
            </View>

            {/* // Special Diet Area // */}
            <View style={{
                width: "100%",
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 10,
                borderRadius: 10,
                backgroundColor: GlobalStyles[theme]?.paperColor,
            }}>
                {restrictions.sDiet !== "" ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}
                            style={{
                                width: '90%',
                            }}>
                            <Text style={{
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontSize: 16,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                color: GlobalStyles[theme]?.fontColor
                            }}>
                                {restrictions.sDiet}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: "10%",
                                alignItems: 'center',
                                justifyContent: "center",
                            }}
                            onPress={() => setRestrictions({ ...restrictions, sDiet: "" })}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={{
                            textAlignVertical: 'center',
                            textAlign: 'center',
                            alignContent: 'center',
                            height: '100%',
                            width: '100%',
                            fontSize: 15,
                            paddingLeft: 10,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                            color: GlobalStyles[theme]?.fontColor
                        }}>
                            {trans[language]?.SPECIAL_DIET}
                        </Text>
                    </TouchableOpacity>
                }

                {/* <TouchableOpacity
                    style={[{
                        width: "10%",
                        height: 40,
                        borderRadius: 10,
                        padding: 10,
                        elevation: 2,
                        borderWidth: 0.5,
                    }, {
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.buttonColor,
                    }]}
                    onPress={() => setModalVisible(true)}>

                    <Text style={[{
                        width: "100%",
                        textAlign: "center",
                        alignSelf: 'center'
                    }, {
                        fontSize: GlobalTextStyles[text]?.fontSize,
                        fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                        color: GlobalStyles[theme]?.fontColor
                    }]}>
                        {trans[language]?.SDIET}
                    </Text>
                </TouchableOpacity> */}

            </View>

            {/* // Food Courses Area // */}
            <View style={{
                width: "100%",
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: GlobalStyles[theme]?.paperColor,
            }}>
                {restrictions.foodCourses !== "" ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                        <TouchableOpacity onPress={() => setModalVisible2(true)}
                            style={{
                                width: '90%',
                            }}>
                            <Text style={{
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontSize: 16,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                color: GlobalStyles[theme]?.fontColor
                            }}>
                                {restrictions.foodCourses}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: "10%",
                                alignItems: 'center',
                                justifyContent: "center",
                            }}
                            onPress={() => setRestrictions({ ...restrictions, foodCourses: "" })}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity onPress={() => setModalVisible2(true)}>
                        <Text style={{
                            textAlignVertical: 'center',
                            textAlign: 'center',
                            alignContent: 'center',
                            height: '100%',
                            width: '100%',
                            fontSize: 15,
                            paddingLeft: 10,
                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                            color: GlobalStyles[theme]?.fontColor
                        }}>
                            {trans[language]?.FOOD_COURSE}
                        </Text>
                    </TouchableOpacity>
                }
            </View>

            {/* // Search ? Info Modal // */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible3}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        flexDirection: 'row',
                        width: '90%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        borderWidth: 0.5,
                        borderStyle: 'solid',
                        borderRadius: 20,
                        padding: 30,
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.paperColor,
                    }}>
                        <TouchableOpacity style={{
                            width: "100%",
                            alignItems: 'flex-end',
                            marginTop: 20,
                            marginRight: 20,
                            // marginBottom: 20,
                            position: 'absolute',
                            top: 0,
                            right: 0
                        }}
                            onPress={() => setModalVisible3(false)}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                color: GlobalStyles[theme]?.fontColor,
                                marginBottom: 10,
                            }}>{MODAL_TITLE}</Text>
                            <Text style={{
                                color: GlobalStyles[theme]?.fontColor,
                                fontSize: GlobalFontStyles[fontStyle]?.fontSize,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                paddingLeft: 20
                            }}>{MODAL_MSG}</Text>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* // Special Diet Modal // */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>

                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={[{
                        borderRadius: 10,
                        maxHeight: 400,
                        padding: 35,
                        paddingTop: 45,
                        alignItems: "center",
                        elevation: 5,
                        borderWidth: 0.5,
                    }, {
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.paperColor
                    }]}>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                width: "100%",
                                alignItems: 'flex-end',
                                marginTop: 20,
                                marginRight: 20,
                                top: 0,
                                right: 0
                            }}
                            onPress={() => setModalVisible(false)}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>
                        <FlatList
                            data={logos}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => <TouchableOpacity
                                style={[{
                                    borderRadius: 10,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    minWidth: 150,
                                    borderWidth: 0.5,
                                    marginVertical: 5,
                                    elevation: 2,
                                }, {
                                    borderColor: GlobalStyles[theme]?.borderColor,
                                    backgroundColor: GlobalStyles[theme]?.buttonColor
                                }]}
                            >
                                <Text style={[{
                                    textAlign: "center"
                                }, {
                                    fontSize: GlobalTextStyles[text]?.fontSize,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                    color: GlobalStyles[theme]?.fontColor
                                }]}
                                    onPress={() => onChange('sDiet', item.value)}
                                >
                                    {item.value}</Text>
                            </TouchableOpacity>
                            }
                            keyExtractor={item => item.key}
                        />
                    </View>
                </View>
            </Modal>

            {/* // Food Courses Modal // */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible2}>

                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={[{
                        borderRadius: 10,
                        maxHeight: 400,
                        padding: 35,
                        paddingTop: 45,
                        alignItems: "center",
                        elevation: 5,
                        borderWidth: 0.5,
                    }, {
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.paperColor
                    }]}>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                width: "100%",
                                alignItems: 'flex-end',
                                marginTop: 20,
                                marginRight: 20,
                                top: 0,
                                right: 0
                            }}
                            onPress={() => setModalVisible2(false)}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>
                        <FlatList
                            data={foodCourses}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => <TouchableOpacity
                                style={[{
                                    borderRadius: 10,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    minWidth: 150,
                                    borderWidth: 0.5,
                                    marginVertical: 5,
                                    elevation: 2,
                                }, {
                                    borderColor: GlobalStyles[theme]?.borderColor,
                                    backgroundColor: GlobalStyles[theme]?.buttonColor
                                }]}
                            >
                                <Text style={[{
                                    textAlign: "center"
                                }, {
                                    fontSize: GlobalTextStyles[text]?.fontSize,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                    color: GlobalStyles[theme]?.fontColor
                                }]}
                                    onPress={() => onChange('foodCourses', item.value)}>
                                    {item.value}</Text>
                            </TouchableOpacity>
                            }
                            keyExtractor={item => item.key}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default SuperSearch

const styles = StyleSheet.create({

})