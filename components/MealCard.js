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

export default function MealCard({ meal, navigation, openMeal, remove, editMeal, delMeal }) {
const [theme, setTheme] = useState('stylesLight')

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                alignItems: 'center',
                width: windowWidth - 20,
                marginBottom: 10,
                height: 90,
                borderWidth: 0.5,
                borderStyle: 'solid',
                borderColor: 'black',
                backgroundColor: GlobalStyles[theme].paperColor,
                borderRadius: 10,
                paddingHorizontal: 10
            }}>

            <TouchableOpacity
                onPress={() => openMeal(meal)}
                style={{ width: '90%', height: '75%', }}
            >
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>{meal?.mealName} </Text>
                    <Text style={[styles.outputTags, { width: '100%' }]} >
                        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                        {meal?.tags?.map(item => <Text key={uuid.v4()}>{item}, </Text>)}
                        {/* </ScrollView> */}
                        {/* <FlatList
                                data={meal?.tags}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return <Text>{item}, </Text>
                                }}
                                keyExtractor={item => item + uuid.v4()}
                            // extraData={selectedId}
                            /> */}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={{ height: 60, justifyContent: 'space-between', }}>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => editMeal(meal)}>
                    <Feather name="edit-3" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => Alert.alert(
                    'Are you sure???',
                    'You are permantly deleting this meal from your meals!!!',
                    [
                        { text: "Cancel", },
                        { text: "Delete", onPress: () => delMeal(meal) }
                    ])}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
    image: {
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    left: {
        justifyContent: 'space-around',
        width: "60%",
        height: "100%"
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
    subCard: {
        flexDirection: "row",
        width: "98%",
        justifyContent: 'space-between'
    },
})