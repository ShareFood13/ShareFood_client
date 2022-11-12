import React, { useEffect, useState } from 'react'

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
    SafeAreaView,
    StatusBar
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch } from 'react-redux';

// import { createRecipe } from '../../Redux/actions/recipes';

export default function RecipeDetail(navigation) {
    const recipeData = navigation.route.params
    console.log(recipeData);

    const [show, setShow] = useState('ingredients')

    const dispatch = useDispatch();

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <ScrollView style={styles.scrollView}
            showsVerticalScrollIndicator={false}
        >
            <SafeAreaView style={styles.container}>
                <View style={{ height: 30 }}>
                    <Text>{recipeData.recipe.recipeName}</Text>
                </View>
                <View style={{ height: 30, width: "90%", alignItems: "flex-end" }}>
                    <Text>by_{recipeData.recipe.creator}</Text>
                </View>

                <View style={{
                    // flex: 0.05,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: windowWidth * 0.9,
                    height: windowWidth * 0.54,
                    marginBottom: 10,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: 'black',
                    marginVertical: 10,
                    position: "relative", zIndex: 5
                }}>
                    {recipeData.recipe.recipePicture.length !== 0 &&
                        <ScrollView
                            // pagingEnabled
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                width: windowWidth * 0.9,
                                height: windowWidth * 0.59,
                                marginBottom: 10,
                            }}>
                            {recipeData.recipe.recipePicture.map((image, index) =>
                                <View key={uuid.v4()}>
                                    <Image source={{ uri: image.base64 }}
                                        style={{
                                            width: windowWidth * 0.9,
                                            height: windowWidth * 0.54,
                                            resizeMode: "cover",
                                            marginVertical: 10,
                                        }} />
                                </View>)}
                        </ScrollView>
                    }
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: windowWidth / 2,
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    marginBottom: 10
                }}>
                    <Text><AntDesign name="like2" size={24} color="black" /> {recipeData.recipe.likes.length}</Text>
                    <Text><AntDesign name="hearto" size={24} color="black" /> {recipeData.recipe.downloads.length} </Text>
                </View>

                <View style={styles.cookInfo}>
                    <View style={styles.cookItem}>
                        <Text>Prep.Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <Text>{recipeData.recipe.prepTime}</Text>
                            <Text>min</Text>
                        </View>
                    </View>
                    <View style={styles.cookItem}>
                        <Text>Cook Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <Text>{recipeData.recipe.cookTime}</Text>
                            <Text>min</Text>
                        </View>
                    </View>

                    <View style={styles.cookItem}>
                        <Text style={styles.cookText}>Difficulty</Text>
                        <View style={styles.logoInput}>
                            <MaterialCommunityIcons name="chef-hat" size={24} color="black" />

                            <View style={styles.centeredView}>
                                <Text>{recipeData.recipe.difficulty}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cookItem}>
                        <Text style={styles.cookText}>Serves</Text>
                        <View style={styles.logoInput}>
                            <Ionicons name="ios-people-circle-outline" size={24} color="black" />
                            <Text>{recipeData.recipe.prepTime}</Text>
                            <Text>ppl.</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.specialDietText} >
                    {recipeData.recipe.specialDiet.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "specialDiet")}>{item}, </Text>)}
                </Text>

                <Text style={styles.outputTags} >
                    <FontAwesome5 name="hashtag" size={24} color="black" />
                    {recipeData.recipe.tags.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "tags")}>{item}, </Text>)}
                </Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '90%',
                    height: 30,
                    marginVertical: 10,
                    borderRadius: 10,
                    borderColor: 'orange',
                    borderWidth: 0.5,
                    backgroundColor: '#ffcc80',
                    // opacity: 0.2,
                    position: 'relative'
                }}>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '50%',
                        height: 30,
                        borderRadius: 10,
                        borderColor: (show === 'ingredients') ? 'orange' : '#ffcc80',
                        borderWidth: 0.5,
                        backgroundColor: (show === 'ingredients') ? 'orange' : '#ffcc80',
                        position: 'absolute',
                        left: 0,
                    }}
                        onPress={() => setShow("ingredients")}>
                        <Text>Ingredients:</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '50%',
                        height: 30,
                        borderRadius: 10,
                        borderColor: (show !== 'ingredients') ? 'orange' : '#ffcc80',
                        borderWidth: 0.5,
                        backgroundColor: (show !== 'ingredients') ? 'orange' : '#ffcc80',
                        position: 'absolute',
                        right: 0
                    }}
                        onPress={() => setShow("preparation")}>
                        <Text>Preparation:</Text>
                    </TouchableOpacity>
                </View>

                {show === "ingredients"
                    ? <View>
                        {recipeData.recipe.ingredients.map(item =>
                            <View style={styles.outputIngredients} key={uuid.v4()}>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <Text style={styles.units}>{item.units}</Text>
                                <Text style={styles.product}>{item.product}</Text>
                                <Text style={styles.remarks}>{item.remarks}</Text>
                            </View>
                        )}
                    </View>
                    : <View style={{ width: windowWidth, alignItems: 'center' }}>
                        {recipeData.recipe.preparation.map(item =>
                            <View style={styles.outputPreparation} key={uuid.v4()}>
                                <Text style={styles.step} key={uuid.v4()}>Step {item.step}</Text>
                                <Text style={styles.prep} key={uuid.v4()}>{item.preparation}</Text>
                            </View>
                        )}
                    </View>
                }
                <View style={{ width: windowWidth * 0.9, flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity>
                        <Text> Add to a Meal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text> Edit Recipe</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigation.goBack('MyBook')}>
                        <Text> Back to My Book</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight + 20,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    cookInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: "90%",
        height: 80,
        borderRadius: 10,
        backgroundColor: "white",
        // marginTop: 10
    },
    cookItem: {
        width: 70,
        height: 60,
        justifyContent: 'space-around',
    },
    cookText: {
        alignSelf: 'center'
    },
    logoInput: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%"
    },
    outputTags: {
        minWidth: "90%",
        maxWidth: "90%",
        backgroundColor: "white",
        minHeight: 45,
        borderRadius: 10,
        marginTop: 10,
        fontSize: 15,
        padding: 10,

    },
    specialDietText: {
        flexDirection: "row",
        textAlignVertical: 'center',
        justifyContent: 'flex-start',
        width: "90%",
        minHeight: 40,
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    outputIngredients: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 25,
        marginBottom: 5
    },
    product: {
        width: 110,
        paddingLeft: 5,
        textAlignVertical: 'center',

    },
    quantity: {
        width: 40,
        paddingLeft: 10,
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    units: {
        width: 50,
        textAlignVertical: 'center',
        textAlign: 'center'

    },
    remarks: {
        width: 110,
        textAlignVertical: 'center',
        paddingLeft: 5

    },
    preparation: {
        width: "88%",
        paddingLeft: 10,
    },
    outputPreparation: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 25,
        marginBottom: 5,
        textAlignVertical: 'center'
    },
    step: {
        width: 60,
        paddingLeft: 10,
        textAlignVertical: 'center',

    },
    prep: {
        width: 240,
        textAlignVertical: 'center',
        justifyContent: 'flex-start',
    },
})