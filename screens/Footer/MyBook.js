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

import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux"

import { getMyRecipes } from '../../Redux/actions/recipes';

export default function MyBook({ navigation }) {
    const [user, setUser] = useState(null)
    const [refreshing, setRefreshing] = useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        dispatch(getMyRecipes(user?.result?._id, navigation))
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const dispatch = useDispatch();
    const myRecipes = useSelector((state) => state.recipe)


    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    // console.log('====================================');
    // console.log(windowWidth, windowHeight);
    // console.log('====================================');

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        dispatch(getMyRecipes(user?.result?._id, navigation))
    }, [user])

    const getData = async () => {
        setUser(JSON.parse(await AsyncStorage.getItem('profile')))
    }

    console.log('====================================');
    console.log("user:", user);
    console.log('====================================');

    console.log('====================================');
    console.log("myRecipes", myRecipes?.recipes?.length);
    console.log('====================================');

    const openRecipe = (recipe) => {
        console.log(recipe.recipeName);
        navigation.push('RecipeDetail', { recipe: recipe })
    }

    return (
        (myRecipes?.recipes?.length === 0) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
            : (<ScrollView
                // contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }
            >
                {myRecipes?.recipes && myRecipes.recipes.map(recipe =>
                    <View style={styles.recipeCard} key={uuid.v4()}>
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
                                    {recipe.specialDiet.map(sDiet => <Text key={uuid.v4()} style={{
                                        // borderWidth: 1,
                                        // borderColor: 'black',
                                        // borderStyle: 'solid',
                                    }}>{sDiet}, </Text>)}
                                </View>
                                <View style={{ flexDirection: 'row', width: 170, justifyContent: 'space-between', alignSelf: 'center' }}>
                                    <Text><AntDesign name="like2" size={24} color="black" /> {recipe.likes.length}</Text>
                                    <Text><AntDesign name="hearto" size={24} color="black" /> {recipe.downloads.length} </Text>
                                    {/* {recipe.donwloads.length} */}
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