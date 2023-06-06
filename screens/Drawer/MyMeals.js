import React, { useState, useEffect, useCallback, useContext } from 'react'

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
    StatusBar,
    RefreshControl,
    ImageBackground,
    FlatList
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import * as SecureStore from 'expo-secure-store';

import { useIsFocused } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo } from '../../Redux/actions/auth'

import { getMeals, createMeal, updateMeal, deleteMeal } from '../../Redux/actions/meals';

import { getMyRecipes } from '../../Redux/actions/recipes';

import { CLEAR_MSG } from "../../Redux/constants/constantsTypes.js"

import SwitchButton from '../../components/SwitchButton'

import MealCard from '../../components/MealCard';
import PopupModal from '../../components/PopupModal';
import Banner from '../../components/Banner';
import ShowMealDetail from '../../components/ShowMealDetail';
import GlobalStyles from '../../GlobalStyles';
import trans from '../../Language';

const initialState = {
    mealName: "",
    specialDiet: [],
    status: "Public",
    tags: [],
}

const specialDiet = [
    "Vegan",
    "Vegetarian",
    "Lactose Free",
    "Peanut Free",
    "Soy Free",
    "Gluten Free",
    "Sea Food",
    "Contain Fish",
    "Contain Nuts",
    "Contain Eggs",
    "No Added Sugar",
    "No Added Salt",
    "Low Fat",
    "Spicy",
    "Halal",
    "Kosher",
]

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

import { Context } from '../../context/UserContext';
var theme = ""
var language = ""
var fontStyle = ""

export default function MyMeals({ navigation }) {
    const [meal, setMeal] = useState()
    const [mealForm, setMealForm] = useState(initialState)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible3, setModalVisible3] = useState(false)
    const [modalAlert, setModalAlert] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [show, setShow] = useState("Public")
    const [tagsValue, setTagsValue] = useState("")
    const [update, setUpdate] = useState(false)
    const [userId, setUserId] = useState()
    const [sDietMeal, setSDietMeal] = useState()
    // const [modalVisible2, setModalVisible2] = useState(false)
    const [popupModal, setPopupModal] = useState(false)
    const [mealList, setMealList] = useState()
    // const [language, setLanguage] = useState("en")
    // const [theme, setTheme] = useState("stylesLight")
    // const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
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
    })


    const dispatch = useDispatch();
    const isFocused = useIsFocused();


    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const redux = useSelector((state) => state)
    // console.log("MyMeals redux", redux.meal.meals)

    useEffect(() => {
        setMealList(redux?.meal?.meals)
        if (redux?.meal.message !== "") {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                // redux?.meal.message.includes("Created") && navigation.navigate('MyBookStackScreen', { screen: 'MyBook', params: { fromMyMeals: true }, })
                // navigation.navigate('Home1')
            }, 2500)
        }
    }, [redux?.meal, isFocused])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    // useEffect(() => {
    //     if (userId !== undefined) {
    //         onRefresh()
    //         dispatch(getMeals(userId))
    //         // dispatch(getMyRecipes(userId))
    //     }
    // }, [userId, isFocused])

    // REFRESH FUNCTIONS //////////////////////////////////////////
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        if (userId !== undefined) {
            setRefreshing(true);
            // console.log({ userId })
            userId !== null && dispatch(getMeals(userId))
            wait(3000).then(() => setRefreshing(false))//.then(dispatch(getMyRecipes(userId)));
        }
    }, []);

    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])

    useEffect(() => {
        setMealForm({ ...mealForm, status: show })
    }, [show])

    const handleOnChange = (name, text) => {
        if (name === "tags") {
            if (text.charAt(text.length - 1) === '#') {
                return setTagsValue(text.slice(0, text.length - 1))
            }
            setTagsValue(text)
            if (text.charAt(text.length - 1) === "," || text.charAt(text.length - 1) === " ") {
                if (!mealForm.tags.includes("#" + text.slice(0, text.length - 1).toLowerCase()) && text !== " " && text !== ",")
                    setMealForm({ ...mealForm, tags: [...mealForm.tags, "#" + text.slice(0, text.length - 1).toLowerCase()] })
                setTagsValue("")
            }
        } else {
            setMealForm({ ...mealForm, [name]: text, creatorId: userId })
        }
    }

    const remove = (text, name) => {
        const result2 = mealForm.tags.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
        setMealForm({ ...mealForm, tags: result2 })
    }

    const closeModal = () => {
        setMealForm(initialState)
        setModalVisible(false)
        setModalVisible3(false)
        setUpdate(false)
    }

    const saveMeal = () => {
        dispatch(createMeal(mealForm))
        closeModal()
        onRefresh()
    }

    const openMeal = (mealItem) => {
        const array = []
        setModalVisible3(true)
        setMeal(mealItem)
        mealItem?.recipesId.map(recipeId =>
            // userContext?.result?.recipesId.map
            redux?.recipe?.recipes.map(item => {
                if (item._id === recipeId && item.isDeleted === false) {
                    item.specialDiet.map(sDiet => !array.includes(sDiet) && array.push(sDiet))
                }
            })
        )
        setSDietMeal(array)
    }

    const editMeal = (meal) => {
        setModalVisible(true)
        setMealForm(meal)
        setUpdate(true)
    }

    const updateMealFc = () => {
        dispatch(updateMeal(mealForm, mealForm._id))
        setUpdate(false)
        setModalVisible(false)
        setMealForm(initialState)
        // dispatch(getUserInfo(userId))
        userId !== undefined &&
            dispatch(getMeals(userId))
    }

    const delMeal = (meal) => {
        dispatch(deleteMeal(meal._id))
        // dispatch(getUserInfo(userId))
        dispatch(getMeals(userId))
    }

    //////////////////////
    const createShopList = () => {
        const mealToShopList = []
        console.log("MyMeals createShopList meal", meal.mealName)
        meal?.recipesId.map(recipeId =>
            // userContext?.result?.recipesId.map
            redux?.recipe?.recipes?.map(item => {
                if (item._id === recipeId && item.isDeleted === false) {
                    mealToShopList.push(item)
                }
            })
        )
        navigation.navigate('Main', { screen: 'ShowShopList', params: { recipe: mealToShopList, showType: "meals", mealName: meal.mealName } })
    }
    //////////////////////////////

    const Footer = () => {
        return <>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    width: windowWidth,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 0.5,
                    borderStyle: 'solid',
                    borderColor: GlobalStyles[theme]?.borderColor,
                    backgroundColor: GlobalStyles[theme]?.buttonColor,
                }} >
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle
                }}
                    value={mealForm.specialDiet}>
                    {trans[language]?.CREATE_A_MEAL}
                </Text>
            </TouchableOpacity>
        </>
    }

    return (
        <View style={[styles.container, { backgroundColor: GlobalStyles[theme]?.background }]}>
            {/* <ScrollView
                style={{ width: windowWidth }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        progressViewOffset={windowHeight / 2 - 70}
                    />
                }
            > */}
            {/* <Banner title={trans[language]?.MY_MEALS} /> */}

            <FlatList
                data={mealList}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ backgroundColor: GlobalStyles[theme]?.background }}
                renderItem={({ item }) => !item?.isDeleted &&
                    <MealCard
                        meal={item}
                        navigation={navigation}
                        openMeal={openMeal}
                        remove={remove}
                        editMeal={editMeal}
                        delMeal={delMeal}
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }
                keyExtractor={item => item?._id}
            // extraData={selectedId}
            />
            <Footer />

            {/* <View style={styles.specialDiet}>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible2}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalViewDiet}>
                                <ScrollView style={styles.scrollView}
                                    showsVerticalScrollIndicator={false}>
                                    {specialDiet.map(diet =>
                                        <Pressable
                                            key={uuid.v4()}
                                            style={styles.sDietModalButtons}>

                                            <Text style={styles.textStyle}
                                                onPress={(text) => handleSpecialDiet(text)}>
                                                {diet}</Text>
                                        </Pressable>
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View> */}

            <PopupModal message={redux?.meal?.message} popupModal={popupModal} />

            {/* Create a Meal Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 300,
                        height: 330,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.background,
                    }}>
                        <TouchableOpacity onPress={() => closeModal()}
                            style={{
                                width: "100%",
                                alignItems: 'flex-end',
                                marginBottom: 10,
                                marginRight: 10,
                            }}>
                            <EvilIcons name="close-o" size={30} color="red" />
                        </TouchableOpacity>

                        <TextInput
                            style={{
                                flexDirection: 'row',
                                width: "100%",
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 10,
                                paddingLeft: 15,
                                borderRadius: 10,
                                borderWidth: 0.5,
                                borderColor: GlobalStyles[theme]?.borderColor,
                                backgroundColor: GlobalStyles[theme]?.paperColor,
                                fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                color: GlobalStyles[theme]?.fontColor,
                            }}
                            placeholder={trans[language]?.MEAL_NAME}
                            placeholderTextColor={GlobalStyles[theme]?.fontColor}
                            value={mealForm.mealName}
                            onChangeText={text => handleOnChange('mealName', text)} />

                        <View style={{
                            flexDirection: 'row',
                            width: "100%",
                            height: 40,
                            alignItems: 'center',
                            marginBottom: 10,
                            borderRadius: 10,
                            borderWidth: 0.5,
                            borderColor: GlobalStyles[theme]?.borderColor,
                            backgroundColor: GlobalStyles[theme]?.paperColor,
                        }}>
                            <TouchableOpacity onPress={() => setModalAlert(true)} style={{ paddingLeft: 10 }}>
                                <FontAwesome5 name="hashtag" size={24} color={GlobalStyles[theme]?.fontColor} />
                            </TouchableOpacity>

                            <TextInput
                                value={tagsValue}
                                style={{
                                    width: "100%",
                                    paddingLeft: 10,
                                    fontSize: 16,
                                    color: GlobalStyles[theme]?.fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                }}
                                placeholder={trans[language]?.ENTER_YOUR_TAGS}
                                placeholderTextColor={GlobalStyles[theme]?.fontColor}
                                maxLength={21}
                                onChangeText={text => handleOnChange('tags', text)} />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            width: "100%",
                            height: 40,
                            padding: 10,
                            marginBottom: 10,
                            borderRadius: 10,
                            borderWidth: 0.5,
                            borderColor: GlobalStyles[theme]?.borderColor,
                            backgroundColor: GlobalStyles[theme]?.paperColor,
                        }} >
                            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                                {mealForm.tags.map(item =>
                                    <Text key={uuid.v4()}
                                        style={{
                                            fontSize: 14,
                                            overflow: 'hidden',
                                            color: GlobalStyles[theme]?.fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle]?.fontStyle,
                                        }}
                                        onPress={(text) => remove(text, "tags")}>{item}, </Text>)}
                            </ScrollView>
                        </View>

                        <SwitchButton text01={trans[language]?.PUBLIC} text02={trans[language]?.PRIVATE} show={show} setShow={setShow} />

                        {update ? <TouchableOpacity
                            style={{
                                minWidth: 100,
                                minHeight: 40,
                                marginTop: 10,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                borderStyle: 'solid',
                                borderWidth: 0.5,
                                borderColor: GlobalStyles[theme]?.borderColor,
                                backgroundColor: GlobalStyles[theme]?.buttonColor,
                            }}
                            onPress={() => updateMealFc()}>
                            <Text style={{ color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, }}>{trans[language]?.UPDATE}</Text>
                        </TouchableOpacity>
                            : <TouchableOpacity
                                style={{
                                    minWidth: 100,
                                    minHeight: 40,
                                    marginTop: 10,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                    borderStyle: 'solid',
                                    borderWidth: 0.5,
                                    borderColor: GlobalStyles[theme]?.borderColor,
                                    backgroundColor: GlobalStyles[theme]?.buttonColor,
                                }}
                                onPress={() => saveMeal()}>
                                <Text style={{ color: GlobalStyles[theme]?.fontColor, fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, }}>{trans[language]?.SAVE}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </Modal>

            {/* Meal Detail Modal */}
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible3}>

                <ShowMealDetail meal={meal} recipes={redux?.recipe?.recipes} sDietMeal={sDietMeal} closeModal={closeModal} />

                <View style={styles.button}>
                    <TouchableOpacity onPress={createShopList}>
                        <FontAwesome name="list" size={25} color="red" />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* // Modal Alert// */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalAlert}>

                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: GlobalStyles[theme]?.background
                }}>
                    <View style={[{
                        width: 350,
                        maxHeight: 400,
                        alignItems: "flex-start",
                        padding: 30,
                        paddingBottom: 45,
                        borderWidth: 0.5,
                        borderRadius: 10,
                        elevation: 5,
                    }, {
                        borderColor: GlobalStyles[theme]?.borderColor,
                        backgroundColor: GlobalStyles[theme]?.paperColor
                    }]}>
                        <Text style={{
                            fontSize: 16,
                            marginBottom: 10,
                            color: GlobalStyles[theme]?.fontColor,
                        }}>
                            {trans[language]?.HASHTAG}
                        </Text><Text style={{
                            fontSize: 16,
                            color: GlobalStyles[theme]?.fontColor,
                        }}>
                            {trans[language]?.HASHTAG_INFO}
                        </Text>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                width: "100%",
                                alignItems: 'flex-end',
                                marginBottom: 20,
                                marginRight: 20,
                                bottom: 0,
                                right: 0,
                            }}
                            onPress={() => { setModalAlert(false) }}>
                            <Text style={{ color: GlobalStyles[theme]?.buttonColor, fontSize: 16 }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* </ScrollView> */}
        </View >
    )
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        shadowRadius: 60,
        shadowColor: '#F02A4B',
        shadowOpacity: 0.3,
        shadowOffset: { height: 3, width: 0 },
        elevation: 10,
        zIndex: 10,
        bottom: 30,
        backgroundColor: 'white',
        borderColor: 'black', borderStyle: 'solid', borderWidth: 0.2,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 0
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
    inputTags: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: "90%",
        width: "90%",
        backgroundColor: '#e6e6e6',
        height: 45,
        borderRadius: 10,
        paddingStart: 10,
        fontSize: 16,
        borderRadius: 20,
        marginBottom: 10,
        paddingLeft: 15,
    },
    mealCard: {
        width: '95%',
        height: 330,
        // borderStyle: 'solid',
        // borderWidth: 0.3,
        // borderColor: 'black',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    mealShow: {
        justifyContent: 'space-between',
        width: '80%',
        height: 150,
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'black',
        alignItems: 'flex-start',
        marginLeft: 50,
        paddingHorizontal: 10,
    },
    modalView: {
        width: 300,
        height: 330,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    modalViewDiet: {
        width: 300,
        height: 450,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 20
    },
    outPuts: {
        width: "90%",
        height: 40,
        marginVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        paddingLeft: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20
    },
    outputTags: {
        width: "90%",
        backgroundColor: '#e6e6e6',
        height: 40,
        borderRadius: 10,
        fontSize: 14,
        padding: 10,
        borderRadius: 15,
        marginVertical: 7,
        paddingLeft: 10,
        overflow: 'hidden',
    },
    specialDietText: {
        backgroundColor: '#e6e6e6',
        width: "100%",
        minHeight: 40,
        borderRadius: 20,
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 60,
        textAlignVertical: 'center'
    },
    sDietButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#66ccff",
        width: 60,
        height: 40,
        position: 'absolute',
        right: 0,
        justifyContent: 'center',

    },
    sDietModalButtons: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 150, alignItems: 'center',
        marginVertical: 5
    },
})