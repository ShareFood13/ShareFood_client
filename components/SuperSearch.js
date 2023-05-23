import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'

import { Fontisto, FontAwesome, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import GlobalStyles from '../GlobalStyles';
import { useDispatch, useSelector } from 'react-redux';
import { superSearch } from '../Redux/actions/superSearch';
import { SelectList } from 'react-native-dropdown-select-list';

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

const SuperSearch = () => {
    const dispatch = useDispatch();
    const [textToSearch, setTextToSearch] = useState("")
    const [theme, setTheme] = useState("stylesLight")
    const [selected, setSelected] = useState('');
    const [restrictions, setRestrictions] = useState({})


    const onChangeSearch = (text) => {
        setTextToSearch(text)
    }

    const search = () => {
        console.log("search", textToSearch, restrictions)
        dispatch(superSearch(textToSearch, restrictions))
    }

    const onChange = (type, select) => {
        setRestrictions({ ...restrictions, [type]: select })
    }

    console.log("SuperSearch restrictions", restrictions)
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <View style={{ width: windowWidth * 0.95, height: 25, marginTop: 10 }}>
                <TouchableOpacity
                    style={{  paddingRight: 0, width: 25, alignSelf: 'flex-end', alignItems: 'center' }}
                    onPress={() => Alert.alert(
                        'How to search?',
                        `
                by_  -> user search,\n
                tag_  -> tag search,\n
                recipe_  -> recipe search,\n
                meal_  -> meal search,\n
                event_  -> event search`

                    )}>
                    <FontAwesome name="question-circle-o" size={25} color="black"/>
                </TouchableOpacity>
            </View>
            <View style={[{ backgroundColor: GlobalStyles[theme].paperColor }, styles.searchContainer]}>
                <TextInput
                    onChangeText={text => onChangeSearch(text)}
                    placeholder="Search for..."
                    value={textToSearch}
                    style={styles.search}
                />
                <Fontisto name="search" size={24} color="black" onPress={search}
                    style={{
                        width: 30,
                        textAlign: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center'
                    }} />
            </View>
            <View style={{ width: windowWidth * 0.9, alignItems: 'center' }}>
                <SelectList
                    onSelect={() => onChange('foodCourses', selected)}
                    setSelected={setSelected}
                    // placeholder="To:"
                    placeholder="Food Courses"

                    maxHeight="160"
                    data={foodCourses}
                    search={true}
                    // fontFamily="lato"
                    save="value"
                    boxStyles={{
                        width: 300,
                        borderWidth: 0,
                        borderBottomWidth: 2,
                        borderStyle: 'solid',
                        borderColor: 'black',
                        backgroundColor: GlobalStyles[theme].paperColor,
                        marginTop: 10
                    }}
                    dropdownItemStyles={{
                        width: 250,
                        // marginBottom: 10,
                    }}
                    dropdownStyles={{
                        width: windowWidth * 0.75,
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        position: 'absolute',
                        elevation: 10,
                        zIndex: 10,
                        top: 50
                    }}
                    dropdownTextStyles={{
                        // backgroundColor: 'red'
                    }}
                />

                <SelectList
                    onSelect={() => onChange('sDiet', selected)}
                    setSelected={setSelected}
                    placeholder="Special Diet"

                    maxHeight="160"
                    data={logos}
                    search={true}
                    // fontFamily="lato"
                    save="value"
                    boxStyles={{
                        width: 300,
                        borderWidth: 0,
                        borderBottomWidth: 2,
                        borderStyle: 'solid',
                        borderColor: 'black',
                        backgroundColor: GlobalStyles[theme].paperColor,
                        marginTop: 10
                    }}
                    dropdownItemStyles={{
                        width: 250,
                        // marginBottom: 10,
                    }}
                    dropdownStyles={{
                        width: windowWidth * 0.75,
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        position: 'absolute',
                        elevation: 10,
                        zIndex: 10,
                        top: 50
                    }}
                    dropdownTextStyles={{
                        // backgroundColor: 'red'
                    }}
                />
            </View>

        </View>
    )
}

export default SuperSearch

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        width: windowWidth * 0.95,
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        borderRadius: 10,
        marginTop: 10,
    },
    search: {
        width: "90%",
        height: "100%",
        paddingLeft: 15,
        // borderBottomWidth: 2,
        // borderBottomColor: 'black',
        // borderRadius: 5,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 15
    },
})