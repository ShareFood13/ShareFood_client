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
import GlobalFontStyles from '../../GlobalFontStyles';
import GlobalStyles from '../../GlobalStyles';
import trans from '../../Language'
import GlobalTextStyles from '../../GlobalTextStyles';

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
    const [language, setLanguage] = useState("en")
    const [text, setText] = useState('normalText')
    const [theme, setTheme] = useState("stylesLight")
    const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Lato_400Regular,
        Montserrat_400Regular,
        // Oswald_400Regular,
        // SourceCodePro_400Regular,
        Slabo27px_400Regular,
        Poppins_400Regular,
        Lora_400Regular,
        Rubik_400Regular,
        PTSans_400Regular,
        Karla_400Regular
    })
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
            difficultyColor = GlobalStyles[theme].green
            break
        case "Easy":
            difficultyColor = GlobalStyles[theme].yesColor
            break
        case "Medium":
            difficultyColor = "orange"
            break
        case "Hard":
            difficultyColor = "salmon"
            break
        case "Super Hard":
            difficultyColor = GlobalStyles[theme].noColor
            break
    }

    return (
        // <ScrollView style={styles.scrollView}
        <ScrollView style={{ marginTop: recipeDetailFlag ? 40 : 0 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: GlobalStyles[theme].background }]}>

                <View style={{
                    height: 45,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderRadius: 10,
                    borderColor: GlobalStyles[theme].fontColor,
                    backgroundColor: GlobalStyles[theme].paperColor
                }}>
                    <Text style={{ fontSize: 30, color: GlobalStyles[theme].fontColor }}>{recipeData?.recipeName}</Text>
                </View>

                <View style={{ height: 30, width: "100%", alignItems: "flex-end", marginTop: 5 }}>
                    <Text style={{ color: GlobalStyles[theme].fontColor }}>by_{recipeData?.creator}</Text>
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
                    <Text style={{ color: GlobalStyles[theme].fontColor }}><AntDesign name="like2" size={24} color={GlobalStyles[theme].fontColor} /> {recipeData?.likes?.length}</Text>
                    <Text style={{ color: GlobalStyles[theme].fontColor }}><AntDesign name="hearto" size={24} color={GlobalStyles[theme].fontColor} /> {recipeData?.downloads?.length} </Text>
                </View>

                <View style={[{
                    width: "100%",
                    height: 90,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                }, { backgroundColor: GlobalStyles[theme].paperColor }]}>
                    <View style={{
                        width: (windowWidth - 40) / 4,
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{
                            marginBottom: 10,
                            fontSize: GlobalTextStyles[text].fontSize,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            color: GlobalStyles[theme].fontColor
                        }}>
                            {trans[language].PREP_TIME}
                        </Text>
                        <View style={{
                            width: "90%",
                            height: 40,
                            flexDirection: "row",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Entypo name="stopwatch" size={24} color={GlobalStyles[theme].fontColor} />
                            <Text style={[{
                                width: 30,
                                textAlign: "center",
                                borderStyle: 'solid',
                                borderBottomWidth: 0.5,
                            }, {
                                borderBottomColor: GlobalStyles[theme].borderColor,
                                fontSize: GlobalTextStyles[text].fontSize,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }]}>{recipeData?.prepTime}</Text>
                            <Text style={{
                                fontSize: GlobalTextStyles[text].fontSize,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {trans[language].MIN}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        width: (windowWidth - 40) / 4,
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{
                            marginBottom: 10,
                            fontSize: GlobalTextStyles[text].fontSize,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            color: GlobalStyles[theme].fontColor
                        }}>
                            {trans[language].COOK_TIME}
                        </Text>
                        <View style={{
                            width: "90%",
                            height: 40,
                            flexDirection: "row",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Entypo name="stopwatch" size={24} color={GlobalStyles[theme].fontColor} />
                            <Text style={[{
                                width: 30,
                                textAlign: "center",
                                borderStyle: 'solid',
                                borderBottomWidth: 0.5,
                            }, {
                                borderBottomColor: GlobalStyles[theme].borderColor,
                                fontSize: GlobalTextStyles[text].fontSize,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }]}>{recipeData?.cookTime}</Text>
                            <Text style={{
                                fontSize: GlobalTextStyles[text].fontSize,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {trans[language].MIN}
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        width: (windowWidth - 40) / 4,
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{
                            marginBottom: 5,
                            fontSize: GlobalTextStyles[text].fontSize,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            color: GlobalStyles[theme].fontColor
                        }}>
                            {trans[language].DIFFICULTY}
                        </Text>
                        <View style={{
                            width: "90%",
                            height: 40,
                            flexDirection: "row",
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}>
                            <MaterialCommunityIcons name="chef-hat" size={24} color={GlobalStyles[theme].fontColor} />

                            <View style={[{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                // padding: 10,
                                elevation: 2,
                                borderWidth: 0.5,
                                fontSize: 18,
                                backgroundColor: difficultyColor,
                                borderColor: GlobalStyles[theme].borderColor,
                            }]}>
                                <Text style={{
                                    width: 40,
                                    height: 40,
                                    textAlign: 'center',
                                    textAlignVertical: "center",
                                    fontSize: 18,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                }}>
                                    {recipeData?.difficulty?.split(" ")[0].slice(0, 1)}{recipeData?.difficulty?.split(" ")[1]?.slice(0, 1)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        width: (windowWidth - 40) / 4,
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{
                            marginBottom: 10,
                            fontSize: GlobalTextStyles[text].fontSize,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            color: GlobalStyles[theme].fontColor
                        }}>
                            {trans[language].SERVES}
                        </Text>
                        <View style={{
                            width: "90%",
                            height: 40,
                            flexDirection: "row",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Ionicons name="ios-people-circle-outline" size={24} color={GlobalStyles[theme].fontColor} />
                            <Text style={[{
                                width: 30,
                                textAlign: "center",
                                borderStyle: 'solid',
                                borderBottomWidth: 0.5,
                            }, {
                                borderBottomColor: GlobalStyles[theme].borderColor,
                                fontSize: GlobalTextStyles[text].fontSize,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }]}>{recipeData?.prepTime}</Text>
                            <Text style={{
                                fontSize: GlobalTextStyles[text].fontSize,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                color: GlobalStyles[theme].fontColor
                            }}>
                                {trans[language].PPL}
                            </Text>
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
                    <Text style={{
                        fontSize: GlobalTextStyles[text].fontSize,
                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                        color: GlobalStyles[theme].fontColor
                    }}>{recipeData?.foodCourse}</Text>
                </Text>

                <View style={[styles.outputTags, { flexDirection: 'row', backgroundColor: GlobalStyles[theme].paperColor }]} >
                    <FontAwesome5 name="hashtag" size={24} color={GlobalStyles[theme].fontColor} />
                    {recipeData?.tags?.map(item => <Text key={uuid.v4()}
                        style={{
                            textAlignVertical: 'center',
                            fontSize: GlobalTextStyles[text].fontSize,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            color: GlobalStyles[theme].fontColor
                        }}
                    // onPress={(text) => remove(text, "tags")}
                    >{item}, </Text>)}
                </View>

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
                            <View style={[styles.outputIngredients, {backgroundColor: GlobalStyles[theme].paperColor}]} key={uuid.v4()}>
                                <Text style={[styles.quantity, {
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    color: GlobalStyles[theme].fontColor
                                }]}>{item.quantity}</Text>
                                <Text style={[styles.units, {
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    color: GlobalStyles[theme].fontColor
                                }]}>{item.units}</Text>
                                <Text style={[styles.product, {
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    color: GlobalStyles[theme].fontColor
                                }]}>{item.product}</Text>
                                <Text style={[styles.remarks, {
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    color: GlobalStyles[theme].fontColor
                                }]}>{item.remarks}</Text>
                            </View>
                        )}
                    </View>
                    : <View style={{ width: "100%", alignItems: 'center', minHeight: 200 }}>
                        {recipeData?.preparation.map(item =>
                            <View style={[styles.outputPreparation, {backgroundColor: GlobalStyles[theme].paperColor}]} key={uuid.v4()}>
                                <Text style={[styles.step, {
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    color: GlobalStyles[theme].fontColor
                                }]} key={uuid.v4()}>Step {item.step}</Text>
                                <Text style={[styles.prep, {
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    color: GlobalStyles[theme].fontColor
                                }]} key={uuid.v4()}>{item.preparation}</Text>
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
        width: 70,
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
        width: "20%",
        paddingLeft: 10,
        textAlignVertical: 'center',

    },
    prep: {
        width: "80%",
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