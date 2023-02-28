import React, { useEffect, useState, useContext, useCallback } from 'react'

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
    StatusBar,
    FlatList
} from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';

import { createEvent, updateEvent, fetchEvents, deleteEvent } from '../../Redux/actions/events';
import { getMeals, createMeal, updateMeal, deleteMeal } from '../../Redux/actions/meals';
import { deleteRecipe, addRecipeTo } from '../../Redux/actions/recipes'

// import { Context } from "../../context/UserContext";
import FloatingButton from '../../components/FloatingButton'
import PopupModal from '../../components/PopupModal';
import { CLEAR_MSG } from "../../Redux/constants/constantsTypes.js"
import { useIsFocused } from '@react-navigation/native';

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

export default function RecipeDetail({ navigation, route }) {
    const { recipeData } = route.params

    const [show, setShow] = useState('ingredients')
    const [modalVisible, setModalVisible] = useState(false)
    const [addTo, setAddTo] = useState(null)
    const [popupModal, setPopupModal] = useState(false)
    const [userId, setUserId] = useState()
    const [refreshing, setRefreshing] = useState(false)

    var difficultyColor = ""

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const redux = useSelector((state) => state)

    const eventList = redux?.event?.events
    const mealList = redux?.meal?.meals

    useEffect(() => {
        onRefresh()
        dispatch(fetchEvents(userId))
    }, [userId, isFocused])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(3000).then(() => setRefreshing(false)).then(dispatch(getMeals(userId)))
    }, []);

    const todayDate = new Date().toJSON().slice(0, 10)

    useEffect(() => {
        if (redux?.recipe.message !== "") {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                navigation.navigate('MyBookStackScreen')
            }, 2500)
        }
    }, [redux.recipe, isFocused])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    const editRecipe = () => {
        navigation.navigate('NewRecipe', { recipe: recipeData })
    }

    const delRecipe = () => {
        dispatch(deleteRecipe(recipeData._id))
    }

    const openAddTo = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setAddTo(null)
    }

    const addRecipeToFc = (item) => {
        if (!item.recipesId.includes(recipeData._id)) {
            item.recipesId.push(recipeData._id)
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
        navigation.navigate('ShowShopList', { recipe: recipeData, showType: "recipe" })
    }

    switch (recipeData.difficulty) {
        case "Super Easy":
            difficultyColor = "lime"
            break
        case "Easy":
            difficultyColor = "greenyellow"
            break
        case "Medium":
            difficultyColor = "orange"
            break
        case "Hard":
            difficultyColor = "salmon"
            break
        case "Super Hard":
            difficultyColor = "red"
            break
    }

    return (
        <ScrollView style={styles.scrollView}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>

                <View style={{ height: 45 }}>
                    <Text style={{ fontSize: 30 }}>{recipeData.recipeName}</Text>
                </View>

                <View style={{ height: 30, width: "90%", alignItems: "flex-end" }}>
                    <Text>by_{recipeData.creator}</Text>
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
                    {recipeData.recipePicture.length !== 0 &&
                        <ScrollView
                            // pagingEnabled
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                width: windowWidth * 0.9,
                                height: windowWidth * 0.59,
                                marginBottom: 10,
                            }}>
                            {recipeData.recipePicture.map((image, index) =>
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

                <FloatingButton
                    style={{ bottom: 10, zIndex: 10, elevation: 10 }}
                    openAddTo={openAddTo}
                    editRecipe={editRecipe}
                    deleteAlert={deleteAlert}
                    createShopList={createShopList}
                />

                <View style={{
                    flexDirection: 'row',
                    width: windowWidth * 0.66,
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    marginBottom: 10
                }}>
                    <Text><AntDesign name="like2" size={24} color="black" /> {recipeData.likes.length}</Text>
                    <Text><AntDesign name="hearto" size={24} color="black" /> {recipeData.downloads.length} </Text>
                </View>

                <View style={styles.cookInfo}>
                    <View style={styles.cookItem}>
                        <Text>Prep.Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <Text>{recipeData.prepTime}</Text>
                            <Text>min</Text>
                        </View>
                    </View>
                    <View style={styles.cookItem}>
                        <Text>Cook Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <Text>{recipeData.cookTime}</Text>
                            <Text>min</Text>
                        </View>
                    </View>

                    <View style={styles.cookItem}>
                        <Text style={styles.cookText}>Difficulty</Text>
                        <View style={styles.logoInput}>
                            <MaterialCommunityIcons name="chef-hat" size={24} color="black" />

                            <View style={{
                                backgroundColor: difficultyColor,
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                alignContent: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 18 }}>{recipeData.difficulty.split(" ")[0].slice(0, 1)}{recipeData.difficulty.split(" ")[1]?.slice(0, 1)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cookItem}>
                        <Text style={styles.cookText}>Serves</Text>
                        <View style={styles.logoInput}>
                            <Ionicons name="ios-people-circle-outline" size={24} color="black" />
                            <Text>{recipeData.prepTime}</Text>
                            <Text>ppl.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.specialDietLogo}>
                    {recipeData.specialDiet.map(item => {
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
                    {recipeData.tags.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "tags")}>{item}, </Text>)}
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
                        {recipeData.ingredients.map(item =>
                            <View style={styles.outputIngredients} key={uuid.v4()}>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <Text style={styles.units}>{item.units}</Text>
                                <Text style={styles.product}>{item.product}</Text>
                                <Text style={styles.remarks}>{item.remarks}</Text>
                            </View>
                        )}
                    </View>
                    : <View style={{ width: windowWidth, alignItems: 'center', minHeight: 200 }}>
                        {recipeData.preparation.map(item =>
                            <View style={styles.outputPreparation} key={uuid.v4()}>
                                <Text style={styles.step} key={uuid.v4()}>Step {item.step}</Text>
                                <Text style={styles.prep} key={uuid.v4()}>{item.preparation}</Text>
                            </View>
                        )}
                    </View>
                }

                {/* //// add to meal / event MODAL */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView]}>
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
                                    <View style={{ marginVertical: 20, height: 500 }}>
                                        <Text style={styles.banner}>Meals</Text>
                                        <FlatList
                                            data={mealList}
                                            showsVerticalScrollIndicator={false}
                                            style={{ maxHeight: 250 }}
                                            renderItem={({ item }) =>
                                                !item.isDeleted && <TouchableOpacity
                                                    style={styles.genericButton}
                                                    onPress={() => addRecipeToFc(item)}>
                                                    <Text >{item.mealName}</Text>
                                                </TouchableOpacity>
                                            }
                                            keyExtractor={item => item._id}
                                        />
                                    </View>

                                    : <View style={{ marginVertical: 20 }}>
                                        <Text style={styles.banner}>Events</Text>
                                        <FlatList
                                            data={eventList}
                                            showsVerticalScrollIndicator={false}
                                            style={{ maxHeight: 250 }}
                                            renderItem={({ item }) =>
                                                // item.eventDate >= todayDate &&
                                                <TouchableOpacity
                                                    style={styles.genericButton}
                                                    onPress={() => addRecipeToFc(item)}>
                                                    <Text >{item.eventName}</Text>
                                                </TouchableOpacity>
                                            }
                                            keyExtractor={item => item._id}
                                        />
                                    </View>
                                )
                            }

                        </View>
                    </View>
                </Modal>

                {redux?.recipe?.message !== "" && <PopupModal message={redux?.recipe?.message} popupModal={popupModal} />}
                {/* {redux?.events?.message !== "" && <PopupModal message={redux?.events?.message} popupModal={popupModal} />}
                {redux?.meals?.message !== "" && <PopupModal message={redux?.meals?.message} popupModal={popupModal} />} */}

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight - 10,
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
        width: 250,
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