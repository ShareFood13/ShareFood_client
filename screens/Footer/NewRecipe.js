import React, { useEffect, useState, useContext, useRef, LegacyRef } from 'react'
import { Context } from "../../context/UserContext";

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
    FlatList
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import * as ImagePicker from 'expo-image-picker';

import SwitchButton from '../../components/SwitchButton';
import PopUp from '../../components/PopUp'
import SpSheet from '../../components/SpSheet';
import Conversions from '../Drawer/Conversions';
import PopupModal from '../../components/PopupModal';

import { useDispatch, useSelector } from 'react-redux';
import { createRecipe, updateRecipe } from '../../Redux/actions/recipes';
import { CLEAR_MSG } from "../../Redux/constants/constantsTypes.js"

import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';


const initialPreparation = {
    preparation: "",
    step: "",
}

const initialIngredients = {
    product: "",
    quantity: "",
    remarks: "",
    units: "",
}

const initialValue = {
    cookTime: 0,
    creator: '',
    creatorId: '',
    difficulty: '',
    donwloads: [],
    foodCourse: "",
    forHowMany: 0,
    freeText: "",
    ingredients: [],
    likes: [],
    preparation: [],
    prepTime: 0,
    recipeComments: [],
    recipeName: '',
    recipePicture: [],
    specialDiet: [],
    status: "Public",
    tags: [],
}

const difficulty = [
    { key: 1, value: "Super Easy" },
    { key: 2, value: "Easy" },
    { key: 3, value: "Medium" },
    { key: 4, value: "Hard" },
    { key: 5, value: "Super Hard" }
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

const units = [
    { unit: 'MilliLiter', abreviation: 'ml' },
    { unit: 'Units', abreviation: 'un' },
    { unit: 'Grams', abreviation: 'gr' },
    { unit: 'KiloGrams', abreviation: 'Kg' },
    { unit: 'Liters', abreviation: 'L' },
    { unit: 'TableSpoon', abreviation: 'Tbsp' },
    { unit: 'TeaSpoon', abreviation: 'Tsp' },
    { unit: 'Cups', abreviation: 'cup' },

]

const foodCourses = [
    { key: 1, value: "Hors d'oeuvre (Appetizer)" },
    { key: 2, value: "Potage (Soup)" },
    { key: 3, value: "Oeufs (Eggs)" },
    { key: 4, value: "Farineaux (Rice & Pasta)" },
    { key: 5, value: "Poisson (Fish)" },
    { key: 6, value: "Entrée (entry of 1st meat course)" },
    { key: 7, value: "Reléve (Meat Course)" },
    { key: 8, value: "Sorbet (Flavoured Water)" },
    { key: 9, value: "Rôti (Roast)" },
    { key: 10, value: "Légume (Vegetables)" },
    { key: 11, value: "Salade (Salad)" },
    { key: 12, value: "Buffet Froid (Cold Buffet)" },
    { key: 13, value: "Entremet de sûcre (Sweets)" },
    { key: 14, value: "Savoureaux (Savoury)" },
    { key: 15, value: "Fromage (Cheese)" },
    { key: 16, value: "Desserts (Fresh fruits & Nuts)" },
    { key: 17, value: "Café (Coffee)" },
    { key: 18, value: "Pain (Bread)" },
]

export default function NewRecipe({ navigation, route }) {
    const [difficultyColor, setDifficultyColor] = useState("#66ccff")
    const [ingredients, setIngredients] = useState(initialIngredients)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [oldStep, setOldStep] = useState(0)
    const [preparation, setPreparation] = useState(initialPreparation)
    const [recipeForm, setRecipeForm] = useState(initialValue)
    const [showImage, setShowImage] = useState(0)
    const [show, setShow] = useState("Public")
    const [tagsValue, setTagsValue] = useState("")
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("")
    const [popupModal, setPopupModal] = useState(false)
    const [showPopUp, setShowPopUp] = useState(false)
    const [userData, setUserData] = useState(null)


    // const gotoRef = useRef(null)
    const dispatch = useDispatch();
    const isFocused = useIsFocused();


    const redux = useSelector((state) => state)

    // console.log("redux NewRecipe", redux);
    // console.log("redux Message", redux.recipe.message);
    // console.log("redux Recipes", redux?.recipe.recipes);
    // console.log("route.params", route.params)

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { userContext, setUserContext } = useContext(Context)
    // console.log("userContext", userContext)

    useEffect(() => {
        // if (redux?.recipe.recipes) {
        //     setUserContext({ result: redux.recipe.recipes[0] })
        // }
        if (redux?.recipe.message) {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                navigation.navigate('MyBookStackScreen')
                // navigation.navigate('Home1')
            }, 2500)
        }
    }, [redux])

    // const userInfo = userContext.result
    // console.log("NewRecipe userContext", userInfo.recipesId)

    useEffect(() => {
        // gotoRef.current.focus()

        getItem()
    }, [isFocused])

    async function getItem() {
        setUserData(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    useEffect(() => {
        route?.params !== undefined && setRecipeForm(route.params.recipe)
    }, [route.params])

    useEffect(() => {
        setRecipeForm({ ...recipeForm, status: show })
    }, [show])

    ///// page 01 - general
    const handleOnChange = (name, text) => {
        if (name === "tags") {
            if (text.charAt(text.length - 1) === '#') {
                return setTagsValue(text.slice(0, text.length - 1))
            }
            setTagsValue(text)
            if (text.charAt(text.length - 1) === "," || text.charAt(text.length - 1) === " ") {
                if (!recipeForm.tags.includes("#" + text.slice(0, text.length - 1).toLowerCase()) && text !== " " && text !== ",")
                    setRecipeForm({ ...recipeForm, tags: [...recipeForm.tags, "#" + text.slice(0, text.length - 1).toLowerCase()] })
                setTagsValue("")
            }
        } else {
            setRecipeForm({ ...recipeForm, [name]: text, creatorId: userData.userId, creator: userData.userUserName })
        }
    }

    const pickImage = async () => {
        // console.log("pickImageFunc")
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            exif: true,
        });
        // console.log("111", result.canceled)
        // result: {
        //     "assets": [
        //       {
        //         "assetId": null,
        //         "base64": null,
        //         "duration": null,
        //         "exif": null,
        //         "height": 4800,
        //         "rotation": null,
        //         "type": "image",
        //         "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%username%252Fsticker-smash-47-beta/ImagePicker/77c4e56f-4ccc-4c83-8634-fc376597b6fb.jpeg",
        //         "width": 3200
        //       }
        //     ],
        //     "canceled": false,
        //     "cancelled": false
        //   }
        if (!result.canceled) {
            setRecipeForm({ ...recipeForm, recipePicture: [...recipeForm.recipePicture, { path: result.assets[0].uri, base64: `data:image/jpg;base64,${result.assets[0].base64}` }] })
        } else {
            Alert.alert(
                'Adding pincture.',
                'Action Canceled!!!',
                [
                    { text: "OK" }
                ])
        }
    }

    const handleDifficulty = (text) => {
        switch (text._dispatchInstances.pendingProps.children) {
            case "Super Easy":
                setDifficultyColor("lime")
                break
            case "Easy":
                setDifficultyColor("greenyellow")
                break
            case "Medium":
                setDifficultyColor("orange")
                break
            case "Hard":
                setDifficultyColor("salmon")
                break
            case "Super Hard":
                setDifficultyColor("red")
                break
        }
        setRecipeForm({ ...recipeForm, difficulty: text._dispatchInstances.pendingProps.children })
        setModalVisible(!modalVisible)
    }

    const handleSpecialDiet = (text) => {
        if (!recipeForm.specialDiet.includes(text._dispatchInstances.pendingProps.children)) {
            setRecipeForm({ ...recipeForm, specialDiet: [...recipeForm.specialDiet, text._dispatchInstances.pendingProps.children] })
        }
        setModalVisible2(!modalVisible2)
    }

    const handleFoodCourse = (text) => {
        setRecipeForm({ ...recipeForm, foodCourse: text._dispatchInstances.pendingProps.children })
        setModalVisible4(!modalVisible4)
    }

    const remove = (text, name) => {
        switch (name) {
            case "specialDiet":
                // const result1 = recipeForm.specialDiet.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
                const result1 = recipeForm.specialDiet.filter(item => item !== text)
                setRecipeForm({ ...recipeForm, specialDiet: result1 })
                break
            case "tags":
                const result2 = recipeForm.tags.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
                setRecipeForm({ ...recipeForm, tags: result2 })
                break
        }
    }

    ////// page 02 - ingredients
    const handleIngredients = (name, text) => {
        if (text !== " ") {
            if (name === "units") {
                setIngredients({ ...ingredients, [name]: text._dispatchInstances.pendingProps.children })
                setModalVisible3(!modalVisible3)
            } else {
                setIngredients({ ...ingredients, [name]: text })
            }
        }
    }

    const addIngredient = () => {
        if (ingredients.product === "" || ingredients.quantity === "" || ingredients.units === "") return
        setRecipeForm({ ...recipeForm, ingredients: [...recipeForm.ingredients, ingredients] })
        // setIngredients(initialIngredients)
    }

    const editIngredient = (product) => {
        const result = recipeForm.ingredients.filter(item => item.product === product)
        delIngredient(product, "ingredient")
        setIngredients(result[0])
    }

    const delIngredient = (product, name) => {
        if (name === "ingredient") {
            const result = recipeForm.ingredients.filter(item => item.product !== product)
            setRecipeForm({ ...recipeForm, ingredients: result })
        }
        if (name === "picture") {
            const result2 = recipeForm.recipePicture.filter((item, index) => index !== product)
            setRecipeForm({ ...recipeForm, recipePicture: result2 })
            setShowImage(0)
        }
    }

    ////// page 03 - preparation steps
    const handlePreparation = (text) => {
        setPreparation({ step: recipeForm.preparation.length + 1, preparation: text })
    }

    const addStep = () => {
        if (preparation.preparation.trim() === "") {
            setPreparation(initialPreparation)
            setOldStep(0)
            return
        }
        if (oldStep === 0) {
            setRecipeForm({ ...recipeForm, preparation: [...recipeForm.preparation, preparation] })
            setPreparation(initialPreparation)
        } else {
            setRecipeForm({
                ...recipeForm, preparation: recipeForm.preparation.map(item => item.step !== oldStep ? item : { preparation: preparation.preparation, step: oldStep })
            })
            setPreparation(initialPreparation)
            setOldStep(0)
        }
    }

    const editStep = (step) => {
        const result = recipeForm.preparation.filter(item => item.step === step)
        setOldStep(result[0].step)
        setPreparation(result[0])
    }

    const delStep = (step) => {
        const result = recipeForm.preparation.filter(item => item.step !== step)
        result.map((item, index) => item.step = index + 1)
        setRecipeForm({ ...recipeForm, preparation: result })
    }

    ///// backend CRUP
    const handleAdd = () => {
        // gotoRef.current.focus()

        dispatch(createRecipe(recipeForm));
        clearForm()
    }

    const handleEdit = () => {
        dispatch(updateRecipe(recipeForm._id, recipeForm));
        clearForm()
        route.params = undefined

    }

    const clearForm = () => {
        setRecipeForm(initialValue)
        setIngredients(initialIngredients)
        setPreparation(initialPreparation)
        setTagsValue("")
        setDifficultyColor("#66ccff")
        route.params = undefined
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* <ScrollView
                showsVerticalScrollIndicator={false}
            > */}
            {/* <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                > */}
            <ScrollView
                // scrollView das 3 paginas
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                    width: windowWidth, maxHeight: windowHeight - 140,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: 'black',

                }}
            >
                {/* /// general */}
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: windowWidth, position: 'relative' }}>

                        <Text style={styles.banner} >New Recipe</Text>

                        <View style={styles.inputLogo}>
                            <TextInput
                                // ref={gotoRef}
                                value={recipeForm.recipeName}
                                style={styles.input}
                                placeholder='Recipe Name'
                                onChangeText={text => handleOnChange('recipeName', text)}
                            />
                        </View>

                        <View style={{
                            flex: 0.05, alignItems: 'center', justifyContent: 'center', width: windowWidth * 0.9, height: windowWidth * 0.54, marginBottom: 10, borderStyle: 'solid',
                            borderWidth: 1,
                            borderColor: 'black',
                            marginTop: 10,
                            position: "relative", zIndex: 5
                        }}>
                            {recipeForm.recipePicture.length !== 0 &&
                                <ScrollView
                                    pagingEnabled
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        width: windowWidth * 0.9,
                                        height: windowWidth * 0.59,
                                        marginBottom: 10,
                                        position: 'absolute'
                                    }}>

                                    {recipeForm.recipePicture.map((image, index) =>
                                        <View key={uuid.v4()}>
                                            <Image source={{ uri: image.base64 }}
                                                style={{
                                                    width: windowWidth * 0.9,
                                                    height: windowWidth * 0.54,
                                                    left: -windowWidth * 0.9 * (showImage),
                                                    resizeMode: "cover",
                                                    marginVertical: 10,
                                                    borderStyle: 'solid',
                                                    borderWidth: 1,
                                                    borderColor: 'black',
                                                }} />
                                            <TouchableOpacity style={styles.delImg} onPress={() => delIngredient(showImage, "picture")}>
                                                <AntDesign name="delete" size={24} color="black" />
                                            </TouchableOpacity>

                                            {recipeForm.recipePicture.length > 1 &&
                                                <View style={{ width: "100%", top: 10, left: 0, position: "absolute", zIndex: 5, elevation: 5, flexDirection: "row", justifyContent: 'space-between', alignSelf: 'center' }}>
                                                    <View style={{ width: "50%", height: "100%" }}>
                                                        {showImage > 0 &&
                                                            <TouchableOpacity onPress={() => setShowImage(showImage => showImage - 1)}
                                                                style={{
                                                                    width: "100%",
                                                                    height: windowWidth * 0.54,
                                                                    // flexDirection: "row", justifyContent: 'flex-start',
                                                                }}>
                                                                {/* <AntDesign name="leftcircleo" size={24} color="orange" style={{ top: "55%", left: "5%" }} /> */}
                                                            </TouchableOpacity>}
                                                    </View>
                                                    <View style={{ width: "50%", height: "100%" }}>
                                                        {showImage < (recipeForm.recipePicture.length - 1) &&
                                                            <TouchableOpacity onPress={() => setShowImage(showImage => showImage + 1)}
                                                                style={{
                                                                    width: "100%",
                                                                    height: windowWidth * 0.54,
                                                                    // flexDirection: "row", justifyContent: 'flex-end',
                                                                }}>
                                                                {/* <AntDesign name="rightcircleo" size={24} color="orange" style={{ top: "55%", right: -60 }} /> */}
                                                            </TouchableOpacity>}
                                                    </View>
                                                </View>
                                            }
                                        </View>)}
                                </ScrollView>}
                        </View>

                        {recipeForm.recipePicture.length < 3 &&
                            <View style={[styles.genericButton, { marginTop: 0 }]}>
                                {recipeForm.recipePicture.length < 3 &&
                                    <TouchableOpacity>
                                        <Text onPress={pickImage}>Add an image. {recipeForm.recipePicture.length}/3</Text>
                                    </TouchableOpacity>}
                            </View>
                        }

                        <View style={styles.cookInfo}>
                            <View style={styles.cookItem}>
                                <Text>Prep.Time</Text>
                                <View style={styles.logoInput}>
                                    <Entypo name="stopwatch" size={24} color="black" />
                                    <TextInput
                                        value={recipeForm.prepTime}
                                        style={styles.numberInput}
                                        keyboardType='numeric'
                                        onChangeText={text => handleOnChange('prepTime', text)}
                                    />
                                    <Text>min</Text>
                                </View>
                            </View>

                            <View style={styles.cookItem}>
                                <Text>Cook Time</Text>
                                <View style={styles.logoInput}>
                                    <Entypo name="stopwatch" size={24} color="black" />
                                    <TextInput
                                        value={recipeForm.cookTime}
                                        style={styles.numberInput}
                                        keyboardType='numeric'
                                        onChangeText={text => handleOnChange('cookTime', text)}
                                    />
                                    <Text>min</Text>
                                </View>
                            </View>

                            <View style={styles.cookItem}>
                                <Text style={styles.cookText}>Difficulty</Text>
                                <View style={styles.logoInput}>
                                    <MaterialCommunityIcons name="chef-hat" size={24} color="black" />

                                    <View style={styles.centeredView}>
                                        <Modal
                                            animationType="fade"
                                            transparent={true}
                                            visible={modalVisible}
                                        >
                                            <View style={styles.centeredView}>
                                                <View style={styles.modalView}>
                                                    <FlatList
                                                        data={difficulty}
                                                        showsVerticalScrollIndicator={false}
                                                        renderItem={({ item }) => <Pressable
                                                            style={[styles.button, styles.buttonClose]}
                                                        >
                                                            <Text style={styles.textStyle}
                                                                onPress={(text) => handleDifficulty(text)}
                                                            >{item.value}</Text>
                                                        </Pressable>

                                                        }
                                                        keyExtractor={item => item.key}
                                                    />
                                                </View>
                                            </View>
                                        </Modal>
                                        <Pressable
                                            style={[styles.button, styles.buttonOpen]}
                                            backgroundColor={difficultyColor}
                                            onPress={() => setModalVisible(true)}
                                        >
                                            {(recipeForm.difficulty === "")
                                                ? <Text style={styles.textStyle}>Dif</Text>
                                                : <Text style={styles.textStyle}>{recipeForm.difficulty.split(" ")[0].slice(0, 1)}{recipeForm.difficulty.split(" ")[1]?.slice(0, 1)}</Text>}
                                        </Pressable>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.cookItem}>
                                <Text style={styles.cookText}>Serves</Text>
                                <View style={styles.logoInput}>
                                    <Ionicons name="ios-people-circle-outline" size={24} color="black" />
                                    <TextInput
                                        value={recipeForm.forHowMany}
                                        style={styles.numberInput}
                                        keyboardType='numeric'
                                        onChangeText={text => handleOnChange('forHowMany', text)}
                                    />
                                    <Text>ppl.</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.specialDiet}>
                            <View style={styles.specialDietLogo}>
                                {recipeForm.specialDiet.map(item => {
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
                                })}
                            </View>

                            <Pressable
                                style={[styles.button, styles.buttonOpen2]}
                                onPress={() => setModalVisible2(true)}>

                                <Text style={[styles.textStyle, styles.textStyle2]}>S.Diet</Text>
                            </Pressable>

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible2}>

                                <View style={styles.centeredView}>
                                    <View style={[styles.modalView, { height: 370 }]}>
                                        <FlatList
                                            data={logos}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => <Pressable
                                                style={[styles.button, styles.buttonClose]}>

                                                <Text style={[styles.textStyle]}
                                                    onPress={(text) => handleSpecialDiet(text)}>
                                                    {item.name}</Text>
                                            </Pressable>
                                            }
                                            keyExtractor={item => item.name}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </View>

                        <View style={{ flexDirection: "row", width: '90%', marginBottom: 10 }}>
                            <View style={{ backgroundColor: 'white', width: '78%', height: 40, borderRadius: 10 }}>
                                <Pressable onPress={() => setRecipeForm({ ...recipeForm, foodCourse: "" })}>
                                    <Text style={{ width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center', fontSize: 16, fontWeight: '500' }}>
                                        {recipeForm.foodCourse}
                                    </Text>
                                </Pressable>
                            </View>

                            <Pressable
                                style={[styles.button, styles.buttonOpen2, { width: 70, marginLeft: 10 }]}
                                onPress={() => setModalVisible4(true)}>

                                <Text style={[styles.textStyle, styles.textStyle2, { width: 70 }]}>Course</Text>
                            </Pressable>

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible4}>

                                <View style={styles.centeredView}>
                                    <View style={[styles.modalView, { height: 370 }]}>
                                        <FlatList
                                            data={foodCourses}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => <Pressable
                                                style={{
                                                    width: 280,
                                                    height: 45,
                                                    borderColor: '#307ecc',
                                                    borderWidth: 1,
                                                    borderRadius: 30,
                                                    marginVertical: 5,
                                                    backgroundColor: '#307ecc',
                                                    // borderWidth: 0,
                                                    color: '#FFFFFF',
                                                    alignItems: 'center',
                                                }}>

                                                <Text style={[{ width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center' }, styles.buttonTextStyle]}
                                                    onPress={(text) => handleFoodCourse(text)}>
                                                    {item.value}</Text>
                                            </Pressable>
                                            }
                                            keyExtractor={item => item.key}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </View>

                        <View style={styles.inputTags}>
                            <TouchableOpacity onPress={() => Alert.alert(
                                'HashTag',
                                'Just press "space" or "," to enter your HashTag, \nNo need for #. \nMaximum 20 Characters.\nTo delete one just click on it.',
                                [
                                    { text: "OK" }
                                ])}>
                                <FontAwesome5 name="hashtag" size={24} color="black" />
                            </TouchableOpacity>

                            <TextInput
                                value={tagsValue}
                                style={{ width: "90%", paddingLeft: 10 }}
                                placeholder='Enter Your Tags'
                                maxLength={21}
                                onChangeText={text => handleOnChange('tags', text)} />
                        </View>

                        <View style={styles.outputTags} >
                            <FlatList
                                data={recipeForm.tags}
                                // horizontal={true}
                                // showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <Text
                                    onPress={(text) => remove(text, "tags")}>{item}, </Text>}
                                keyExtractor={item => item}
                            />
                            {/* {recipeForm.tags.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "tags")}>{item}, </Text>)} */}
                        </View>

                        <View style={[styles.outputTags, { marginBottom: 20, position: "relative" }]}>
                            <TextInput
                                style={{ height: 120, textAlignVertical: 'top', }}
                                placeholder='Free Text max 256 char.'
                                value={recipeForm.freeText}
                                onChangeText={text => handleOnChange('freeText', text)}
                                keyboardType="default"
                                maxLength={256}
                                multiline={true}
                            />
                            <Text style={{ position: "absolute", bottom: 0, right: 0 }}>{recipeForm?.freeText?.length}/256</Text>
                        </View>
                    </View>
                </ScrollView>
                {/* /// ingredients */}
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: windowHeight - 140,
                    // maxHeight: 500,
                    width: windowWidth
                }}>

                    <Text style={styles.banner}>Ingredients</Text>

                    <SpSheet text={"Open Units Convertor"} heightValue={550}><Conversions /></SpSheet>

                    <View style={styles.inputIngredients}>

                        <TextInput
                            value={ingredients.quantity}
                            style={styles.quantity}
                            keyboardType='numeric'
                            placeholder='qty'
                            onChangeText={text => handleIngredients('quantity', text)} />

                        <View style={styles.centeredView}>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible3}
                            >
                                <View style={styles.centeredView}>
                                    <View style={[styles.modalView, styles.modalView2]}>
                                        <FlatList
                                            data={units}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => <Pressable
                                                style={[styles.button, styles.buttonClose]}>
                                                <Text style={styles.textStyle}
                                                    onPress={(text) => handleIngredients('units', text)}>
                                                    {item.unit}
                                                </Text>
                                            </Pressable>
                                            }
                                            keyExtractor={item => item.product}
                                        />
                                    </View>
                                </View>
                            </Modal>

                            <Pressable
                                style={[styles.button3]}
                                onPress={() => setModalVisible3(true)}
                            >
                                {(ingredients.units === "")
                                    ? <Text style={styles.textStyle}>Un.</Text>
                                    // : <Text style={styles.textStyle}>{ingredients.units}</Text>}
                                    : <Text style={styles.textStyle}>{units.map(unit => unit.unit === ingredients.units && unit.abreviation)}</Text>}
                            </Pressable>
                        </View>

                        <TextInput
                            value={ingredients.product}
                            style={styles.product}
                            placeholder='Ingredients'
                            onChangeText={text => handleIngredients('product', text)} />

                        <TextInput
                            value={ingredients.remarks}
                            style={styles.remarks}
                            placeholder='Remarks'
                            onChangeText={text => handleIngredients('remarks', text)} />

                        <TouchableOpacity
                            onPress={addIngredient}
                            style={{
                                width: 45,
                                height: '100%',
                                backgroundColor: '#66ccff'
                            }}>
                            <Text style={{
                                width: '100%',
                                height: '100%',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontWeight: '500'
                            }}>ADD</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={recipeForm.ingredients}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <View style={styles.outputIngredients}>
                            <Text style={styles.quantity}>{item.quantity}</Text>
                            <Text style={styles.units}>{units.map(unit => unit.unit === item.units && unit.abreviation)}</Text>
                            <Text style={styles.product}>{item.product}</Text>
                            <Text style={styles.remarks}>{item.remarks}</Text>

                            <View style={styles.buttons}>
                                <TouchableOpacity style={styles.validation} onPress={() => editIngredient(item.product)}>
                                    <Feather name="edit-3" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.validation} onPress={() => delIngredient(item.product, "ingredient")}>
                                    <AntDesign name="delete" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                        </View>
                        }
                        keyExtractor={item => item.product}
                    />
                </View>
                {/* /// preparation */}
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: windowHeight - 400,
                    // height: 650,
                    width: windowWidth
                }}>

                    <View style={{ flex: 0.97 }}>
                        <Text style={styles.banner}>Preparation</Text>

                        <View style={[styles.inputPreparation, styles.inputIngredients]}>

                            <TextInput
                                value={preparation.preparation}
                                style={styles.preparation}
                                keyboardType='ascii-capable'
                                placeholder='Preparation Step'
                                onChangeText={text => handlePreparation(text)}
                            // multiline
                            // numberOfLines={2}
                            />
                            <TouchableOpacity
                                onPress={addStep}
                                style={{
                                    width: 45,
                                    height: '100%',
                                    backgroundColor: '#66ccff'
                                }}>
                                <Text style={{
                                    width: '100%',
                                    height: '100%',
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    fontWeight: '500'
                                }}>ADD</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={recipeForm.preparation}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => <View style={styles.outputPreparation} >
                                <Text style={styles.step} >Step {item.step}</Text>
                                <Text style={styles.prep} >{item.preparation}</Text>

                                <View style={styles.buttons} >
                                    <TouchableOpacity style={styles.validation} onPress={() => editStep(item.step)}>
                                        <Feather name="edit-3" size={24} color="black" />
                                    </TouchableOpacity>
                                    {(recipeForm.preparation[recipeForm.preparation.length - 1].step === item.step) &&
                                        <TouchableOpacity style={styles.validation} onPress={() => delStep(item.step)}>
                                            <AntDesign name="delete" size={24} color="black" />
                                        </TouchableOpacity>
                                    }
                                </View>

                            </View>
                            }
                            keyExtractor={item => item.preparation}
                        />
                    </View>

                    <SwitchButton text01="Public" text02="Private" show={show} setShow={setShow} />

                    < View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }} >
                        <TouchableOpacity style={styles.genericButton} onPress={clearForm}>
                            <Text>Clear Form</Text>
                        </TouchableOpacity>
                        {(route.params === undefined)
                            ? <TouchableOpacity style={styles.genericButton} onPress={handleAdd}>
                                <Text>Add Recipe to My Book</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity style={styles.genericButton} onPress={handleEdit}>
                                <Text>Update Recipe</Text>
                            </TouchableOpacity>
                        }
                    </View>

                    {/* {showPopUp && <PopUp message={redux?.recipe.message} type="success" />} */}
                    {/* <PopUp message={redux?.recipe.message} type="success" /> */}
                </View>

                <PopupModal message={redux?.recipe.message} popupModal={popupModal} />

            </ScrollView>
            {/* </KeyboardAvoidingView> */}
            {/* </ScrollView > */}
        </TouchableWithoutFeedback >
    )
}

const styles = StyleSheet.create({
    banner: {
        width: 350,
        height: 40,
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        fontSize: 18,
        marginVertical: 10,
        backgroundColor: "orange",
        // color: 'white',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 150
    },
    buttonOpen: {
        width: 40,
        height: 40, fontWeight: '500', fontSize: 18
    },
    buttonOpen2: {
        backgroundColor: "#66ccff",
        width: 70,
        height: 40,

    },
    button3: {
        width: 50,
        height: "100%",
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    buttons: {
        width: 50,
        flexDirection: "row",
        alignSelf: 'center',
        justifyContent: 'center'
    },
    buttonClose: {
        backgroundColor: "#307ecc",
        marginVertical: 5
    },
    buttonStyle: {
        backgroundColor: '#66ccff',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        width: 100,
    },
    buttonTextStyle: {
        color: 'black',
        paddingVertical: 10,
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
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
    },
    cookText: {
        alignSelf: 'center'
    },
    delImg: {
        position: 'absolute',
        bottom: 15,
        right: 10,
        zIndex: 10, elevation: 10,
    },
    genericButton: {
        marginVertical: 15,
        width: 170,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#66ccff',
    },
    input: {
        width: "100%",
        height: 40,
        borderRadius: 10,
        backgroundColor: "white",
        paddingLeft: 10,
    },
    inputIngredients: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        marginBottom: 10,
        borderRadius: 10
    },
    inputLogo: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "90%",
        minHeight: 45,
        borderRadius: 10,
    },
    inputPreparation: {
        minHeight: 40
    },
    inputTags: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: "90%",
        width: "90%",
        backgroundColor: "white",
        height: 45,
        borderRadius: 10,
        paddingStart: 10,
        fontSize: 16
    },
    logoInput: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%"
    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 320,
        maxHeight: 400,
    },
    modalView2: {
        maxHeight: 600,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    numberInput: {
        width: 30,
        height: 40,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        textAlign: "center"
    },
    outputIngredients: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 25,
        marginBottom: 5,
        borderRadius: 5,
    },
    outputPreparation: {
        width: "90%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 25,
        marginBottom: 5,
        textAlignVertical: 'center',
        borderRadius: 5,
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
    prep: {
        width: 240,
        textAlignVertical: 'center',
        justifyContent: 'flex-start',
    },
    preparation: {
        width: "88%",
        paddingLeft: 10,
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
    remarks: {
        width: 110,
        textAlignVertical: 'center',
        paddingLeft: 5
    },
    specialDiet: {
        marginVertical: 10,
        flexDirection: "row",
        alignItems: 'center',
        width: "90%",
        justifyContent: 'space-between'
    },
    specialDietLogo: {
        justifyContent: 'flex-start',
        width: "78%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 5,
        minHeight: 55,
        flexDirection: "row",
        textAlignVertical: 'center',
        flexWrap: 'wrap',
    },
    showTags: {
        width: "80%",
        backgroundColor: "white",
        minHeight: 45,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        paddingLeft: 10,
        textAlignVertical: 'center'
    },
    step: {
        width: 60,
        paddingLeft: 10,
        textAlignVertical: 'center',

    },
    textStyle: {
        color: "black",
        fontWeight: "500",
        textAlign: "center"
    },
    textStyle2: {
        width: 50,
        alignSelf: 'center'

    },
    units: {
        width: 50,
        textAlignVertical: 'center',
        textAlign: 'center'

    },
})