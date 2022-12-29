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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import { createEvent, updateEvent, fetchEvents, deleteEvent, addRecipeTo } from '../../Redux/actions/events';
import { getMeals, createMeal, updateMeal, deleteMeal } from '../../Redux/actions/meals';
import { deleteRecipe } from '../../Redux/actions/recipes'

import FloatingButton from '../../components/FloatingButton'

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

export default function RecipeDetail(navigation) {
    const recipeData = navigation.route.params
    console.log("RecipeDetail:", recipeData);

    const [show, setShow] = useState('ingredients')
    const [modalVisible, setModalVisible] = useState(false)
    const [addTo, setAddTo] = useState(null)
    const [user, setUser] = useState()

    const dispatch = useDispatch();

    const eventList = useSelector((state) => state.event.events)
    const mealList = useSelector((state) => state.meal.meals)

    // console.log("mealList:", mealList);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const result = JSON.parse(await AsyncStorage.getItem('profile'))
        setUser(result.result._id)
    }

    useEffect(() => {
        dispatch(fetchEvents(user))
        dispatch(getMeals(user))
    }, [user])

    const editRecipe = () => {
        // dispatch(updateRecipe(recipeForm, navigation))
        navigation.navigation.navigate('NewRecipe', { recipe: recipeData })
    }

    const delRecipe = () => {
        dispatch(deleteRecipe(recipeData.recipe._id))
        navigation.navigation.goBack('MyBook')
        // console.log(navigation.navigation)
    }

    const addToMeal = () => {
        // console.log('====================================');
        // console.log("eu tenho que pensar como fazer");
        // console.log('====================================');
    }

    const openAddTo = () => {
        setModalVisible(true)
        dispatch(fetchEvents(user))
        dispatch(getMeals(user))
        // console.log("openAddTo");
    }

    const closeModal = () => {
        setModalVisible(false)
        setAddTo(null)
    }

    const addRecipeToFc = (item) => { //item can be a meal or event
        // console.log(recipeData.recipe._id);
        // console.log(item.recipesId);
        // console.log(!item.recipesId.includes(recipeData.recipe._id));
        if (!item.recipesId.includes(recipeData.recipe._id)) {
            item.recipesId.push(recipeData.recipe._id)
            // console.log("item", item);
            dispatch(addRecipeTo(addTo, item))
        }
        closeModal()
    }

    const deleteAlert = () => {
        Alert.alert(
            'Are you sure???',
            'You are permantly deleting this recipe from your book!!!',
            [
                { text: "Cancel", },
                { text: "Delete", onPress: () => delRecipe() }
            ]
        )
    }

    const createShopList = () => {
        navigation.navigation.navigate('ShowShopList', { recipe: recipeData.recipe, showType: "recipe" })
    }


    return (
        <ScrollView style={styles.scrollView}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <View style={{ height: 45 }}>
                    <Text style={{ fontSize: 30 }}>{recipeData.recipe.recipeName}</Text>
                </View>
                <View style={{ height: 30, width: "90%", alignItems: "flex-end" }}>
                    <Text>by_{recipeData.recipe.creator}</Text>
                </View>

                <View style={{
                    // flex: 0.05,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: windowWidth * 0.9 + 2,
                    height: windowWidth * 0.54,
                    marginBottom: 10,
                    borderStyle: 'solid',
                    borderWidth: 0.2,
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
                    <FloatingButton style={{ bottom: -10, zIndex: 10, elevation: 10 }}
                        openAddTo={openAddTo}
                        editRecipe={editRecipe}
                        deleteAlert={deleteAlert}
                        createShopList={createShopList}
                    />

                </View>
                <View style={{
                    flexDirection: 'row',
                    width: windowWidth * 0.66,
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    marginBottom: 10
                }}>
                    <Text><AntDesign name="like2" size={24} color="black" /> {recipeData.recipe.likes.length}</Text>
                    <Text><AntDesign name="hearto" size={24} color="black" /> {recipeData.recipe.downloads.length} </Text>
                    {/* <TouchableOpacity onPress={() => openAddTo()}>
                        <Text><AntDesign name="pluscircleo" size={24} color="black" /> to...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity key={uuid.v4()} style={styles.validation} onPress={() => editRecipe()}>
                        <Feather name="edit-3" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => Alert.alert(
                        'Are you sure???',
                        'You are permantly deleting this recipe from your book!!!',
                        [
                            { text: "Cancel", },
                            { text: "Delete", onPress: () => delRecipe() }
                        ])}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity> */}
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

                            <View style={{ width: 50, paddingLeft: 5 }}>
                                <Text style={{ textAlign: 'center' }}>{recipeData.recipe.difficulty}</Text>
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

                <View style={styles.specialDietLogo}>
                    {recipeData.recipe.specialDiet.map(item => {
                        return logos.map(logo =>
                            (logo.name === item) ?
                                <TouchableOpacity key={uuid.v4()}
                                    onPress={() => remove(`${logo.name}`, "specialDiet")}>
                                    <Image
                                        resizeMode='contain'
                                        source={logo.image}
                                        style={{ height: 45, width: 45, margin: 5 }}
                                    /></TouchableOpacity> : null
                        )
                    }
                    )}
                </View>

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
                    ? <View style={{ width: windowWidth, alignItems: 'center', minHeight: 200 }}>
                        {recipeData.recipe.ingredients.map(item =>
                            <View style={styles.outputIngredients} key={uuid.v4()}>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <Text style={styles.units}>{item.units}</Text>
                                <Text style={styles.product}>{item.product}</Text>
                                <Text style={styles.remarks}>{item.remarks}</Text>
                            </View>
                        )}
                    </View>
                    : <View style={{ width: windowWidth, alignItems: 'center', minHeight: 200 }}>
                        {recipeData.recipe.preparation.map(item =>
                            <View style={styles.outputPreparation} key={uuid.v4()}>
                                <Text style={styles.step} key={uuid.v4()}>Step {item.step}</Text>
                                <Text style={styles.prep} key={uuid.v4()}>{item.preparation}</Text>
                            </View>
                        )}
                    </View>
                }

                {/* <View style={{ marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigation.goBack('MyBook')}>
                        <Text> Back to My Book</Text>
                    </TouchableOpacity>
                </View> */}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ width: "100%", alignItems: 'flex-end', marginTop: 20, marginRight: 40 }} onPress={() => closeModal()}>
                                <EvilIcons name="close-o" size={30} color="black" />
                            </TouchableOpacity>
                            {addTo === null ?
                                <View >
                                    <TouchableOpacity
                                        style={styles.genericButton}
                                        onPress={() => setAddTo("meal")}>
                                        <Text style={{ color: 'white', fontWeight: '700' }}>To Meal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.genericButton}
                                        onPress={() => setAddTo("event")}>
                                        <Text style={{ color: 'white', fontWeight: '700' }}>To Event</Text>
                                    </TouchableOpacity>
                                </View>
                                : (addTo === "meal" ?
                                    <View style={{ marginVertical: 20 }}>
                                        <Text style={styles.banner}>Meals</Text>
                                        {mealList?.map(item =>
                                            !item.isDeleted && <TouchableOpacity
                                                key={uuid.v4()}
                                                style={styles.genericButton}
                                                onPress={() => addRecipeToFc(item)}>
                                                <Text >{item.mealName}</Text>
                                            </TouchableOpacity>)}
                                    </View>

                                    : <View style={{ marginVertical: 20 }}>
                                        <Text style={styles.banner}>Events</Text>
                                        {eventList?.map(item =>
                                            <TouchableOpacity
                                                key={uuid.v4()}
                                                style={styles.genericButton}
                                                onPress={() => addRecipeToFc(item)}>
                                                <Text >{item.name}</Text>
                                            </TouchableOpacity>)}
                                    </View>
                                )
                            }

                        </View>
                    </View>
                </Modal>


            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight + 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: windowHeight,
        position: 'relative'
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
        marginBottom: 5,
        borderRadius: 5
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
        textAlignVertical: 'center',
        borderRadius: 5
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        width: 300,
        minHeight: 180,
        maxHeight: 400,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white'
    },
    banner: {
        width: 250,
        height: 40,
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        fontSize: 18,
        marginBottom: 10,
        backgroundColor: "orange",
        // color: 'white',
    },
    genericButton: {
        marginBottom: 10,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#66ccff',

    },
    specialDietLogo: {
        justifyContent: 'flex-start',
        width: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 5,
        minHeight: 55,
        flexDirection: "row",
        textAlignVertical: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
    },
})