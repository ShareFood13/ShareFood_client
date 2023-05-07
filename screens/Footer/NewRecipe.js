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
import Banner from '../../components/Banner';
import { SelectList } from 'react-native-dropdown-select-list';
import { SelectCountry } from 'react-native-element-dropdown';
import ImagesSwipe from '../../components/ImagesSwipe';



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
    cookTime: "0",
    creator: '',
    creatorId: '',
    difficulty: '',
    donwloads: [],
    foodCourse: "",
    forHowMany: "0",
    freeText: "",
    ingredients: [],
    likes: [],
    preparation: [],
    prepTime: "0",
    recipeComments: [],
    recipeName: '',
    // recipePicture: { normal: [], small: [] },
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
    { unit: 'MilliLiters', abreviation: 'ml' },
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

const productList = [
    { key: 1, value: 'Acorn Squash', weight: 600 },
    { key: 2, value: 'Apple', weight: 150 },
    { key: 3, value: 'Apricot', weight: 35 },
    { key: 4, value: 'Artichoke', weight: 200 },
    { key: 5, value: 'Asparagus', weight: 50 },
    { key: 6, value: 'Avocado', weight: 150 },
    { key: 7, value: 'Banana', weight: 120 },
    { key: 8, value: 'Beet', weight: 150 },
    { key: 9, value: 'Beetroot', weight: 150 },
    { key: 10, value: 'Bell Pepper', weight: 150 },
    { key: 11, value: 'Black Beans', weight: 100 },
    { key: 12, value: 'Blackberries', weight: 75 },
    { key: 13, value: 'Blueberries', weight: 50 },
    { key: 14, value: 'Broccoli', weight: 500 },
    { key: 15, value: 'Brussels Sprouts', weight: 20 },
    { key: 16, value: 'Butternut Squash', weight: 1000 },
    { key: 17, value: 'Cabbage', weight: 800 },
    { key: 18, value: 'Cantaloupe', weight: 1000 },
    { key: 19, value: 'Carambola (Starfruit)', weight: 120 },
    { key: 20, value: 'Carrot', weight: 70 },
    { key: 21, value: 'Cauliflower', weight: 700 },
    { key: 22, value: 'Celery', weight: 150 },
    { key: 23, value: 'Cherries', weight: 50 },
    { key: 24, value: 'Cherry', weight: 5 },
    { key: 25, value: 'Cherry Tomato', weight: 15 },
    { key: 26, value: 'Chickpeas', weight: 100 },
    { key: 27, value: 'Coconut', weight: 1400 },
    { key: 28, value: 'Corn', weight: 150 },
    { key: 29, value: 'Cucumber', weight: 150 },
    { key: 30, value: 'Dates', weight: 12 },
    { key: 31, value: 'Edamame', weight: 150 },
    { key: 32, value: 'Eggplant', weight: 400 },
    { key: 33, value: 'Fennel', weight: 200 },
    { key: 34, value: 'Figs', weight: 50 },
    { key: 35, value: 'Garlic', weight: 5 },
    { key: 36, value: 'Ginger', weight: 25 },
    { key: 37, value: 'Ginger Root', weight: 30 },
    { key: 38, value: 'Grapefruit', weight: 400 },
    { key: 39, value: 'Grapes', weight: 100 },
    { key: 40, value: 'Green Apple', weight: 150 },
    { key: 41, value: 'Green Beans', weight: 100 },
    { key: 42, value: 'Green Bell Pepper', weight: 150 },
    { key: 43, value: 'Green Onion', weight: 15 },
    { key: 44, value: 'Green Peas', weight: 100 },
    { key: 45, value: 'Hass Avocado', weight: 200 },
    { key: 46, value: 'Honeydew Melon', weight: 1200 },
    { key: 47, value: 'Jalapeno Pepper', weight: 15 },
    { key: 48, value: 'Kale', weight: 100 },
    { key: 49, value: 'Kidney Beans', weight: 100 },
    { key: 50, value: 'Kiwi', weight: 75 },
    { key: 51, value: 'Lemon', weight: 60 },
    { key: 52, value: 'Lentils', weight: 50 },
    { key: 53, value: 'Lettuce', weight: 150 },
    { key: 54, value: 'Lime', weight: 30 },
    { key: 55, value: 'Mango', weight: 300 },
    { key: 56, value: 'Mung Beans', weight: 50 },
    { key: 57, value: 'Mushroom', weight: 20 },
    { key: 58, value: 'Navel Orange', weight: 150 },
    { key: 59, value: 'Navy Beans', weight: 100 },
    { key: 60, value: 'Nectarine', weight: 100 },
    { key: 61, value: 'Onion', weight: 150 },
    { key: 62, value: 'Orange', weight: 150 },
    { key: 63, value: 'Papaya', weight: 800 },
    { key: 64, value: 'Peach', weight: 150 },
    { key: 65, value: 'Pear', weight: 180 },
    { key: 66, value: 'Pineapple', weight: 1500 },
    { key: 67, value: 'Pinto Beans', weight: 100 },
    { key: 68, value: 'Plum', weight: 60 },
    { key: 69, value: 'Pomegranate', weight: 250 },
    { key: 70, value: 'Potato', weight: 150 },
    { key: 71, value: 'Pumpkin', weight: 3000 },
    { key: 72, value: 'Radish', weight: 20 },
    { key: 73, value: 'Raspberries', weight: 50 },
    { key: 74, value: 'Red Apple', weight: 180 },
    { key: 75, value: 'Red Bell Pepper', weight: 150 },
    { key: 76, value: 'Red Cabbage', weight: 700 },
    { key: 77, value: 'Red Grapes', weight: 150 },
    { key: 78, value: 'Red Onion', weight: 200 },
    { key: 79, value: 'Red Potato', weight: 150 },
    { key: 80, value: 'Red Radish', weight: 20 },
    { key: 81, value: 'Red Seedless Grapes', weight: 150 },
    { key: 82, value: 'Romaine Lettuce', weight: 450 },
    { key: 83, value: 'Snow Peas', weight: 100 },
    { key: 84, value: 'Spinach', weight: 100 },
    { key: 85, value: 'Strawberries', weight: 25 },
    { key: 86, value: 'Strawberry', weight: 12 },
    { key: 87, value: 'Sugar Snap Peas', weight: 100 },
    { key: 88, value: 'Sun-Dried Tomatoes', weight: 50 },
    { key: 89, value: 'Sweet Potato', weight: 200 },
    { key: 90, value: 'Tangerine', weight: 85 },
    { key: 91, value: 'Tomato', weight: 150 },
    { key: 92, value: 'Watermelon', weight: 5000 },
    { key: 93, value: 'Yellow Bell Pepper', weight: 150 },
    { key: 94, value: 'Yellow Onion', weight: 150 },
    { key: 95, value: 'Yellow Potato', weight: 150 },
    { key: 96, value: 'Yellow Squash', weight: 300 },
    { key: 97, value: 'Yellow Tomato', weight: 100 },
    { key: 98, value: 'Zucchini', weight: 200 },
]

export default function NewRecipe({ route, navigation }) {
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
    const [selected, setSelected] = useState('');
    const [newObject, setNewObject] = useState();
    const [cloudinaryToDelete, setCloudinaryToDelete] = useState([])


    // const gotoRef = useRef(null)
    const dispatch = useDispatch();
    const isFocused = useIsFocused();


    const redux = useSelector((state) => state)

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const { userContext, setUserContext } = useContext(Context)

    useEffect(() => {
        if (redux?.recipe.message) {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                // navigation.navigate('MyBookStackScreen', { fromNewRecipe: true })
                navigation.navigate('MyBookStackScreen', { screen: 'MyBook', params: { fromNewRecipe: true }, })
                // navigation.navigate('Home1')
            }, 2500)
        }
    }, [redux])

    useEffect(() => {
        // gotoRef.current.focus()

        getItem()
    }, [isFocused])

    async function getItem() {
        setUserData(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    useEffect(() => {
        if (route?.params !== undefined) {
            // console.log("NewRecipe", route?.params?.recipe?.recipePicture?.normal)
            // const recipeToEdit = route?.params?.recipe

            convertToBase64({ recipePicture: route?.params?.recipe?.recipePicture?.normal })
                // .then((result) => setNewObject( result))
                .then((result) => setRecipeForm({ ...route.params.recipe, ...result }))
                .catch((err) => console.error(err));

            // setRecipeForm(route.params.recipe)
        }
    }, [route.params])
    // console.log("322", recipeForm)
    useEffect(() => {
        setRecipeForm({ ...recipeForm, status: show })
    }, [show])

    useEffect(() => {
        setCloudinaryToDelete([])
    }, [])

    // Função para converter uma URL do Cloudinary em uma representação base64
    async function toBase64(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    }

    // Função principal para converter o objeto de URLs de imagem do Cloudinary em um objeto com representações base64 e caminhos originais
    async function convertToBase64(obj) {
        const keys = Object.keys(obj);
        const result = {};
        for (const key of keys) {
            const urls = obj[key];
            const base64Promises = urls.map((url) => toBase64(url));
            const base64Array = await Promise.all(base64Promises);
            const output = base64Array.map((base64, index) => ({
                base64: base64,
                path: urls[index],
            }));
            result[key] = output;
        }
        return result;
    }

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
            const result1 = recipeForm.recipePicture.filter((item, index) => item.path.includes("cloudinary") && index === product)
            setCloudinaryToDelete([...cloudinaryToDelete, result1[0]?.path])
            // console.log("NewRecipe1", result1[0].path)
            const result2 = recipeForm.recipePicture.filter((item, index) => index !== product)
            // console.log("NewRecipe2", result2)
            setRecipeForm({ ...recipeForm, recipePicture: result2 })
            setShowImage(0)
        }
    }
    // console.log("recipeForm", recipeForm)
    // console.log("NewRecipe3", cloudinaryToDelete)
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

    ///// backend CRUD
    const handleAdd = () => {
        // gotoRef.current.focus()
        console.log(recipeForm)

        dispatch(createRecipe(recipeForm));
        clearForm()
    }

    const handleEdit = () => {
        console.log(recipeForm)
        dispatch(updateRecipe(recipeForm._id, { recipeForm, cloudinaryToDelete }));
        // dispatch(deleteFromCloudinary(cloudinaryToDelete))
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

    const Footer = () => {
        return (

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
        )
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

                        <Banner title={(route.params === undefined) ? "New Recipe" : "Update Recipe"} />

                        <View style={styles.inputLogo}>
                            <TextInput
                                // ref={gotoRef}
                                value={recipeForm.recipeName}
                                style={styles.input}
                                placeholder='Recipe Name'
                                onChangeText={text => handleOnChange('recipeName', text)}
                            />
                        </View>

                        {/* <Image source={{ uri: 'https://res.cloudinary.com/dqnf2qxk8/image/upload/v1681839804/sharefood_test/xewa0xxyffvayocvvtkx.png' }}
                            style={{
                                width: 113,
                                height: 80,
                                marginBottom: 10,
                                position: 'absolute'
                            }} /> */}

                        <ImagesSwipe recipeFormRecipePicture={recipeForm.recipePicture} setShowImage={setShowImage} showImage={showImage} delIngredient={delIngredient} />

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
                                        // value={JSON.stringify(recipeForm.prepTime)}
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
                                        // value={JSON.stringify(recipeForm.cookTime)}
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
                                        // value={JSON.stringify(recipeForm.forHowMany)}
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
                            {/* <FlatList
                                // ListHeaderComponent={<Header />}
                                data={recipeForm.tags}
                                // horizontal={true}
                                // showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <Text
                                    onPress={(text) => remove(text, "tags")}>{item}, </Text>}
                                keyExtractor={item => item}
                            // ListFooterComponent={<Footer />}
                            /> */}
                            {recipeForm.tags.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "tags")}>{item}, </Text>)}
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
                    width: windowWidth,
                    position: 'relative'
                }}>

                    <Banner title="Ingredients" />

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
                                            keyExtractor={item => uuid.v4()}
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

                        {/* <TextInput
                            value={ingredients.product}
                            style={styles.product}
                            placeholder='Ingredients'
                            onChangeText={text => handleIngredients('product', text)} /> */}

                        <SelectCountry
                            style={styles.dropdown}
                            containerStyle={styles.containerList}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholderStyle={styles.placeholderStyle}
                            // imageStyle={styles.imageStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            search
                            maxHeight={300}
                            value={ingredients.product}
                            data={productList}
                            valueField="key"
                            labelField="value"
                            // imageField="image"
                            placeholder={ingredients?.product === "" ? "ingredients" : ingredients?.product}
                            searchPlaceholder="Search..."
                            onChange={(item) => handleIngredients('product', item.value)}

                        />

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

                    {recipeForm.ingredients.map(item =>
                        <View style={styles.outputIngredients} key={uuid.v4()}>
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

                        </View>)}
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

                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: "80%" }}>

                        <Banner title="Preparation" />

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
                            renderItem={({ item }) =>
                                <View style={styles.outputPreparation} >
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

                    <SwitchButton text01="Public" text02="Private" show={(route.params === undefined) ? show : recipeForm.status} setShow={setShow} />

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

                </View>

                <PopupModal message={redux?.recipe.message} popupModal={popupModal} />

            </ScrollView>
            {/* </KeyboardAvoidingView> */}
            {/* </ScrollView > */}
        </TouchableWithoutFeedback >
    )
}

const styles = StyleSheet.create({
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
        width: 60,
        flexDirection: "row",
        alignSelf: 'center',
        justifyContent: 'space-around'
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
        width: "95%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        marginVertical: 10,
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
        width: "95%",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 35,
        marginBottom: 5,
        borderRadius: 5,
    },
    outputPreparation: {
        width: "100%",
        backgroundColor: "white",
        flexDirection: "row",
        // justifyContent: "space-between",
        minHeight: 25,
        marginBottom: 5,
        textAlignVertical: 'center',
        borderRadius: 5,
        alignContent: "center"
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
        width: 250,
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
    dropdown: {
        height: 40,
        width: 130,
        paddingLeft: 5,
        // borderBottomColor: 'gray',
        // borderBottomWidth: 0.5,
        // backgroundColor: 'red',
    },
    containerList: {
        // backgroundColor: "blue",
        width: 200,
    },
    imageStyle: {
        width: 24,
        height: 24,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        width: "93%"
    },
})

{/* <View style={{ position: 'absolute', zIndex: 999, }}>
                        <SelectList
                            onSelect={() => handleIngredients('product', selected)}

                            setSelected={(val) => setSelected(val)}
                            data={productList}
                            save="value"
                            dropdownStyles={{
                                backgroundColor: 'white'
                            }}
                        />
                    </View> */}

{/* <FlatList
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
                        keyExtractor={item => uuid.v4()}
                    /> */}

{/* <SelectList
                            onSelect={() => handleIngredients('product', selected)}
                            setSelected={setSelected}
                            // placeholder={mailForm.reciverName ? mailForm.reciverName : "To:"}
                            placeholder="Ingredients"
                            // maxHeight="150"
                            data={productList}
                            search={true}
                            // fontFamily="lato"
                            save="value"
                            boxStyles={{
                                width: 130,
                                borderWidth: 0,
                                // borderBottomWidth: 2,
                                // borderStyle: 'solid',
                                // borderColor: 'black',

                            }}
                            dropdownItemStyles={{
                                // width: 250,
                                marginBottom: 10,

                            }}
                            dropdownStyles={{
                                width: 250,
                                height: 250,
                                alignSelf: 'center',
                                // backgroundColor: 'white',
                                position: 'absolute',
                                elevation: 999,
                                zIndex: 999,
                                top: 35,
                                backgroundColor: 'cyan'
                            }}
                        // dropdownTextStyles={{

                        //     // backgroundColor: 'red'
                        // }}
                        // arrowicon={
                        //   <FontAwesome name="chevron-down" size={12} color={'black'} />
                        // }
                        // searchicon={
                        //   <FontAwesome name="search" size={12} color={'black'} />
                        // }
                        /> */}
{/* <View style={{ position: 'absolute', zIndex: 999, width: 130, left: 130 }}>
                            <SelectList
                                onSelect={() => handleIngredients('product', selected)}

                                setSelected={(val) => setSelected(val)}
                                data={productList}
                                save="value"
                                dropdownStyles={{
                                    backgroundColor: 'white'
                                }}
                                boxStyles={{
                                    backgroundColor: 'white'

                                }}
                            />
                        </View> */}