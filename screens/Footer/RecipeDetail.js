import React, { useEffect, useState, useContext, useCallback, } from 'react'

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
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import ImagesSwipe from '../../components/ImagesSwipe';
import Banner from '../../components/Banner';
import GlobalStyles from '../../GlobalStyles';

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
    const { recipeFromHome, recipeDetailFlag } = route.params
    // console.log("RecipeDetail recipeFromHome", recipeFromHome, recipeDetailFlag)
    const [show, setShow] = useState('ingredients')
    const [modalVisible, setModalVisible] = useState(false)
    const [addTo, setAddTo] = useState(null)
    const [popupModal, setPopupModal] = useState(false)
    const [userId, setUserId] = useState()
    const [showImage, setShowImage] = useState(false)
    const [theme, setTheme] = useState('stylesLight')

    var difficultyColor = ""

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const redux = useSelector((state) => state)
    // console.log("RecipeDetail redux", redux?.recipe?.recipe)
    const recipeData = recipeFromHome !== undefined ? recipeFromHome : redux?.recipe?.recipe

    // console.log("RecipeDetail recipeData", recipeData)


    const eventList = redux?.event?.events
    const mealList = redux?.meal?.meals

    // useEffect(() => {
    //     onRefresh()
    //     userId !== undefined && dispatch(fetchEvents(userId))
    // }, [userId, isFocused])

    // const wait = (timeout) => {
    //     return new Promise(resolve => setTimeout(resolve, timeout));
    // }

    // const onRefresh = useCallback(() => {
    //     setRefreshing(true);
    //     userId !== undefined && dispatch(getMeals(userId))
    //     wait(3000).then(() => setRefreshing(false))//.then(dispatch(getMeals(userId)))
    // }, []);

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

    // useFocusEffect(useCallback(() => {
    //     alert('Screen was focused');
    //     // Do something when the screen is focused
    //     return () => {
    //         alert('Screen was unfocused');
    //         // Do something when the screen is unfocused
    //         // Useful for cleanup functions
    //     }
    // }, []))

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
        navigation.navigate('ShowShopList', { recipe: recipeData, showType: "recipe", recipeName: recipeData.recipeName })
    }

    switch (recipeData?.difficulty) {
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
        // <ScrollView style={styles.scrollView}
        <ScrollView style={{ marginTop: recipeDetailFlag ? 40 : 0 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: GlobalStyles[theme].background }]}>

                <View style={{ height: 45, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>{recipeData?.recipeName}</Text>
                </View>

                <View style={{ height: 30, width: "100%", alignItems: "flex-end" }}>
                    <Text>by_{recipeData?.creator}</Text>
                </View>

                <ImagesSwipe recipeFormRecipePicture={recipeData.recipePicture.normal} setShowImage={setShowImage} showImage={showImage} />

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
                    <Text><AntDesign name="like2" size={24} color="black" /> {recipeData?.likes?.length}</Text>
                    <Text><AntDesign name="hearto" size={24} color="black" /> {recipeData?.downloads?.length} </Text>
                </View>

                <View style={[styles.cookInfo, { backgroundColor: GlobalStyles[theme].paperColor }]}>
                    <View style={styles.cookItem}>
                        <Text style={{ marginBottom: 10 }}>Prep.Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <Text style={{
                                width: 30,
                                // height: 20,
                                borderStyle: 'solid',
                                borderBottomWidth: 1,
                                borderBottomColor: 'black',
                                textAlign: "center",
                            }}>{recipeData?.prepTime}</Text>
                            <Text>min</Text>
                        </View>
                    </View>
                    <View style={styles.cookItem}>
                        <Text style={{ marginBottom: 10 }}>Cook Time</Text>
                        <View style={styles.logoInput}>
                            <Entypo name="stopwatch" size={24} color="black" />
                            <Text style={{
                                width: 30,
                                // height: 30,
                                borderStyle: 'solid',
                                borderBottomWidth: 1,
                                borderBottomColor: 'black',
                                textAlign: "center",
                            }}>{recipeData?.cookTime}</Text>
                            <Text>min</Text>
                        </View>
                    </View>

                    <View style={styles.cookItem}>
                        <Text style={{ marginBottom: 10 }}>Difficulty</Text>
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
                                <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 18 }}>{recipeData?.difficulty?.split(" ")[0].slice(0, 1)}{recipeData?.difficulty?.split(" ")[1]?.slice(0, 1)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cookItem}>
                        <Text style={{ marginBottom: 10 }}>Serves</Text>
                        <View style={styles.logoInput}>
                            <Ionicons name="ios-people-circle-outline" size={24} color="black" />
                            <Text style={{
                                width: 30,
                                // height: 30,
                                borderStyle: 'solid',
                                borderBottomWidth: 1,
                                borderBottomColor: 'black',
                                textAlign: "center",
                            }}>{recipeData?.prepTime}</Text>
                            <Text>ppl.</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.specialDietLogo, { backgroundColor: GlobalStyles[theme].paperColor }]}>
                    {recipeData?.specialDiet?.map(item => {
                        return logos.map(logo =>
                            (logo.name === item) ?
                                <TouchableOpacity key={uuid.v4()}
                                // onPress={() => remove(`${logo.name}`, "specialDiet")}
                                >
                                    <Image
                                        resizeMode='contain'
                                        source={logo.image}
                                        style={{ height: 45, width: 45, margin: 5 }}
                                    /></TouchableOpacity> : null
                        )
                    }
                    )}
                </View>

                <Text style={[styles.outputTags, { backgroundColor: GlobalStyles[theme].paperColor }]} >
                    <Text >{recipeData?.foodCourse}</Text>
                </Text>

                <Text style={[styles.outputTags, { backgroundColor: GlobalStyles[theme].paperColor }]} >
                    <FontAwesome5 name="hashtag" size={24} color="black" />
                    {recipeData?.tags?.map(item => <Text key={uuid.v4()}
                    // onPress={(text) => remove(text, "tags")}
                    >{item}, </Text>)}
                </Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
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
                    ? <View style={{ width: "100%", alignItems: 'center', minHeight: 200 }}>
                        {recipeData?.ingredients?.map(item =>
                            <View style={styles.outputIngredients} key={uuid.v4()}>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <Text style={styles.units}>{item.units}</Text>
                                <Text style={styles.product}>{item.product}</Text>
                                <Text style={styles.remarks}>{item.remarks}</Text>
                            </View>
                        )}
                    </View>
                    : <View style={{ width: "100%", alignItems: 'center', minHeight: 200 }}>
                        {recipeData?.preparation.map(item =>
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
                                        style={[styles.genericButton, { backgroundColor: GlobalStyles[theme].buttonColor }]}
                                        onPress={() => setAddTo("meal")}>
                                        <Text style={{ color: 'white', fontWeight: '700' }}>To Meal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.genericButton, { backgroundColor: GlobalStyles[theme].buttonColor }]}
                                        onPress={() => setAddTo("event")}>
                                        <Text style={{ color: 'white', fontWeight: '700' }}>To Event</Text>
                                    </TouchableOpacity>
                                </View>
                                : (addTo === "meal" ?
                                    <View style={{ marginVertical: 0, height: 500, width: "100%", alignItems: 'center' }}>
                                        <Banner title="Meals" />
                                        <FlatList
                                            data={mealList}
                                            showsVerticalScrollIndicator={false}
                                            style={{ maxHeight: 250 }}
                                            contentContainerStyle={{ alignContent: 'center' }}
                                            renderItem={({ item }) =>
                                                !item.isDeleted && <TouchableOpacity
                                                    style={[styles.genericButton, { backgroundColor: GlobalStyles[theme].buttonColor }]}
                                                    onPress={() => addRecipeToFc(item)}>
                                                    <Text >{item.mealName}</Text>
                                                </TouchableOpacity>
                                            }
                                            keyExtractor={item => item._id}
                                        />
                                    </View>

                                    : <View style={{ marginVertical: 0, height: 500, width: "100%", alignItems: 'center' }}>
                                        <Banner title="Events" />
                                        <FlatList
                                            data={eventList}
                                            showsVerticalScrollIndicator={false}
                                            style={{ maxHeight: 250 }}
                                            renderItem={({ item }) =>
                                                // item.eventDate >= todayDate &&
                                                <TouchableOpacity
                                                    style={[styles.genericButton, { backgroundColor: GlobalStyles[theme].buttonColor }]}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
        // marginTop: StatusBar.currentHeight - 20,
        // height: windowHeight,
        // position: 'relative'
    },
    cookInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
        height: 90,
        borderRadius: 10,
        // backgroundColor: "white",
        padding: 10
        // marginTop: 10
    },
    cookItem: {
        width: (windowWidth - 40) / 4,
        // width: 70,
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'blue',

    },
    cookText: {
        alignSelf: 'center'
    },
    logoInput: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "90%", 
        height: 40,
        // backgroundColor: 'red',

    },
    outputTags: {
        // height: '100%',
        minWidth: "100%",
        maxWidth: "100%",
        textAlignVertical: 'center',
        // backgroundColor: "white",
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
        width: "100%",
        minHeight: 40,
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    outputIngredients: {
        width: "100%",
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
        width: "100%",
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
        // backgroundColor: '#66ccff',

    },
    specialDietLogo: {
        justifyContent: 'flex-start',
        width: "100%",
        // backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 5,
        minHeight: 55,
        flexDirection: "row",
        textAlignVertical: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    scrollView: {
        flex: 1
    }
})


///// 210
{/* <View style={{
                    // flex: 0.05,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: windowWidth * 0.9 + 0.2,
                    height: windowWidth * 0.6,
                    borderStyle: 'solid',
                    borderWidth: 0.2,
                    borderColor: 'black',
                    marginVertical: 10,
                    position: "relative", zIndex: 5
                }}>
                    {recipeData?.recipePicture?.normal?.length !== 0 &&
                        <ScrollView
                            // pagingEnabled
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                width: windowWidth * 0.9,
                                height: windowWidth * 0.6,
                            }}>
                            {recipeData?.recipePicture?.normal?.map((image, index) =>
                                <View key={image}>
                                    {/* <Image source={{ uri: image.base64 }} */}
{/* <Image source={{ uri: image }}
    style={{
        width: windowWidth * 0.9,
        height: windowWidth * 0.6,
        resizeMode: "cover",
    }} />
                                </View >)}
                        </ScrollView >
                    } */}


                // </View > * /}