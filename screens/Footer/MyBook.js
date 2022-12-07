import React, { useEffect, useState, useCallback } from 'react'

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
    ActivityIndicator
} from 'react-native'

import uuid from 'react-native-uuid';

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import { getMyRecipes } from '../../Redux/actions/recipes';

const logos = [
    { name: "Vegan", image: require('../../assets/images/logo/vegan.png') },
    { name: "Organic", image: require('../../assets/images/logo/organic.png') },
    { name: "Gluten Free", image: require('../../assets/images/logo/glutenFree.png') },
    { name: "Lactose Free", image: require('../../assets/images/logo/lactoseFree.png') },
    { name: "Egg Free", image: require('../../assets/images/logo/eggFree2.png') },
    { name: "Nut Free", image: require('../../assets/images/logo/nutFree.png') },
    { name: "Less Sugar", image: require('../../assets/images/logo/lessSugar.png') },
    { name: "Low Fat", image: require('../../assets/images/logo/lowFat.png') },
    { name: "Contain Nuts", image: require('../../assets/images/logo/containNuts.png') },
    { name: "No Molluses", image: require('../../assets/images/logo/noMolluses.png') },
    { name: "Zero Fat", image: require('../../assets/images/logo/zeroFat.png') },
    { name: "Raw Food", image: require('../../assets/images/logo/rawFood.png') },
    { name: "Safe For Kids", image: require('../../assets/images/logo/safeForKids.png') },
    { name: "Spicy", image: require('../../assets/images/logo/spicy.png') },
    { name: "Constain Soybean", image: require('../../assets/images/logo/constainSoybean.png') },
    { name: "Contain Custacean", image: require('../../assets/images/logo/containCustacean.png') },
    { name: "Halal", image: require('../../assets/images/logo/chalal.png') },
    { name: "Kosher", image: require('../../assets/images/logo/kosher.png') },

    // { name: "Gluten Free2", image: require('../../assets/images/logo/glutenFree2.png') },
    // { name: "Milk Free2", image: require('../../assets/images/logo/milkFree2.png') },
    // { name: "Sugar Free2", image: require('../../assets/images/logo/sugarFree2.png') },
    // { name: "Vegan2", image: require('../../assets/images/logo/vegan2.png') },
    // { name: "Wheat Free2", image: require('../../assets/images/logo/wheatFree2.png') },
]

export default function MyBook({ navigation }) {
    const [user, setUser] = useState(null)
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch();

    const myRecipes = useSelector((state) => state.recipe.recipes)
    console.log('====================================');
    console.log(myRecipes);
    console.log('====================================');

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        dispatch(getMyRecipes(user, navigation))
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);



    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    // console.log('====================================');
    // console.log(windowWidth, windowHeight);
    // console.log('====================================');

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const result = JSON.parse(await AsyncStorage.getItem('profile'))
        setUser(result.result._id)
    }

    useEffect(() => {
        dispatch(getMyRecipes(user, navigation))
        // console.log('====================================');
        // console.log("useEffect2");
        // console.log('====================================');
    }, [user])

    const openRecipe = (recipe) => {
        // console.log(recipe.recipeName);
        navigation.push('RecipeDetail', { recipe: recipe })
    }

    return (
        (myRecipes?.length === 0) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
            : (<ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }
            >
                {myRecipes && myRecipes.map(recipe =>
                    !recipe.isDeleted && <View style={styles.recipeCard} key={uuid.v4()}>
                        <View style={styles.subCard}>
                            <Pressable key={uuid.v4()} style={styles.left} onPress={() => openRecipe(recipe)}>
                                <Text style={{ width: "100%", textAlign: 'center' }}>{recipe.recipeName}</Text>

                                <View style={{
                                    flexDirection: 'row', width: "100%", paddingLeft: 0,
                                    // borderWidth: 1,
                                    // borderColor: 'red',
                                    // borderStyle: 'solid',
                                    overflow: 'hidden'
                                }}>
                                    {recipe.specialDiet.map(item => {
                                        return logos.map(logo =>
                                            (logo.name === item)
                                                ? <Image
                                                    key={uuid.v4()}
                                                    resizeMode='contain'
                                                    source={logo.image}
                                                    style={{ height: 35, width: 35, margin: 5 }} />
                                                : null
                                        )
                                    })}
                                </View>

                                <View style={{ flexDirection: 'row', width: 170, justifyContent: 'space-between', alignSelf: 'center' }}>
                                    <Text><AntDesign name="like2" size={24} color="black" /> {recipe.likes.length}</Text>
                                    <Text><AntDesign name="hearto" size={24} color="black" /> {recipe.downloads.length} </Text>
                                    <Text><Entypo name="stopwatch" size={24} color="black" /> {recipe.cookTime + recipe.prepTime} </Text>
                                </View>
                            </Pressable>
                            <View style={styles.image}>
                                {recipe.recipePicture.length > 0 && <ScrollView
                                    // pagingEnabled
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ width: 140, height: 90 }}>
                                    {recipe.recipePicture.map((image, index) =>
                                        <View key={index} style={{ position: 'relative' }}>
                                            <Image source={{ uri: image.base64 }} style={{ width: 140, height: 90, resizeMode: "cover", borderRadius: 10 }} />
                                        </View>)}
                                </ScrollView>}
                            </View>
                        </View>
                    </View>

                )}
            </ScrollView>)
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    recipeCard: {
        width: "90%",
        height: 100,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'center',
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
        width: "95%",
        justifyContent: 'space-between'
    },
    left: {
        justifyContent: 'space-around',
        width: "57%"
    },
    image: {
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
    }
})