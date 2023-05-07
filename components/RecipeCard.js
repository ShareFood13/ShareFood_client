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

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

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
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe } from '../Redux/actions/recipes';

export default function RecipeCard({ recipe, navigation }) {
    const dispatch = useDispatch()

    const openRecipe = (recipe) => {
        // navigation.push('RecipeDetail', { recipeData: recipe })
        // console.log("RecipeCard", recipe._id)
        // dispatch(getRecipe(recipe._id))

        // navigation.push('RecipeDetail', { recipeId: recipe._id })
        navigation.push('RecipeDetail', { recipeFromHome: recipe, recipeDetailFlag: false })

    }
    // console.log(recipe?.recipePicture?.small)
    return (
        <View style={styles.container}>
            <View style={styles.recipeCard}>
                <View style={styles.subCard}>

                    <Pressable style={styles.left} onPress={() => openRecipe(recipe)}>
                        <Text style={{ width: "100%", textAlign: 'center', fontWeight: 'bold' }}>{recipe?.recipeName}</Text>

                        <View style={{
                            flexDirection: 'row',
                            width: "100%",
                            paddingLeft: 0,
                            overflow: 'hidden',
                        }}>
                            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                            <View style={{ height: 45 }} >
                                <FlatList
                                    data={recipe?.specialDiet}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return logos.map(logo =>
                                            (logo.name === item)
                                                ? <Image
                                                    key={logo.name}
                                                    resizeMode='contain'
                                                    source={logo.image}
                                                    style={{ height: 35, width: 35, margin: 5 }} />
                                                : null
                                        )
                                    }}
                                    keyExtractor={item => item}
                                />
                            </View>
                            {/* </ScrollView> */}
                        </View>

                        <View style={{ flexDirection: 'row', width: 170, justifyContent: 'space-between', alignSelf: 'center' }}>
                            <Text><AntDesign name="like2" size={24} color="black" /> {recipe?.likes?.length}</Text>
                            <Text><AntDesign name="hearto" size={24} color="black" /> {recipe?.downloads?.length} </Text>
                            <Text><Entypo name="stopwatch" size={24} color="black" /> {Number(recipe?.cookTime) + Number(recipe?.prepTime)} </Text>
                        </View>

                    </Pressable>

                    <View style={styles.image}>
                        {recipe?.recipePicture?.small?.length > 0 && <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ width: 140, height: 70 }}>
                            {recipe?.recipePicture?.small?.map((image, index) =>
                                <View key={index} style={{ position: 'relative' }}>
                                    {/* <Image source={{ uri: image.base64 }} style={{ width: 140, height: 90, resizeMode: "cover", borderRadius: 10 }} /> */}
                                    <Image source={{ uri: image }} style={{ width: 140, height: "100%", resizeMode: "cover", borderRadius: 10 }} />
                                </View>)}
                        </ScrollView>}
                    </View>
                </View>
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
        height: "100%"
    },
    left: {
        justifyContent: 'space-around',
        width: "60%",
        height: "95%"
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
        height: "100%",
        justifyContent: 'space-between'
    },
})