import React, { useEffect, useState, useContext } from 'react'
import { Context } from "../../context/UserContext";

import {
    View,
    Text,
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

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import * as ImagePicker from 'expo-image-picker';

import SwitchButton from '../../components/SwitchButton';
import SpSheet from '../../components/SpSheet';
import PopupModal from '../../components/PopupModal';
import Banner from '../../components/Banner';
import Conversions from '../Drawer/Conversions';
import ImagesSwipe from '../../components/ImagesSwipe';

import { useDispatch, useSelector } from 'react-redux';
import { createRecipe, updateRecipe } from '../../Redux/actions/recipes';
import { CLEAR_MSG } from "../../Redux/constants/constantsTypes.js"

import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import { SelectCountry } from 'react-native-element-dropdown';

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
    cookTime: "",
    creator: '',
    creatorId: '',
    difficulty: '',
    donwloads: [],
    foodCourse: "",
    forHowMany: "",
    freeText: "",
    ingredients: [],
    likes: [],
    preparation: [],
    prepTime: "",
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
import GlobalTextStyles from '../../GlobalTextStyles';
import trans from '../../Language'

export default function NewRecipe({ route, navigation }) {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
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
    const [popupModal, setPopupModal] = useState(false)
    const [userData, setUserData] = useState(null)
    const [cloudinaryToDelete, setCloudinaryToDelete] = useState([])
    const [text, setText] = useState('normalText')
    const [language, setLanguage] = useState("en")
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
    // const gotoRef = useRef(null)
    // const [yOffset, setYOffset] = useState(0)

    const redux = useSelector((state) => state)

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
                setDifficultyColor(GlobalStyles[theme].green)
                break
            case "Easy":
                setDifficultyColor(GlobalStyles[theme].yesColor)
                break
            case "Medium":
                setDifficultyColor("orange")
                break
            case "Hard":
                setDifficultyColor("salmon")
                break
            case "Super Hard":
                setDifficultyColor(GlobalStyles[theme].noColor)
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
        setIngredients(initialIngredients)
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
        setDifficultyColor(GlobalStyles[theme]?.buttonColor)
        route.params = undefined
    }

    // Floating Button Test
    const handleScroll = (event) => {
        setYOffset(event.nativeEvent.contentOffset.y)
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={{
                    width: windowWidth,
                    maxHeight: windowHeight - 118,
                    backgroundColor: GlobalStyles[theme].background
                }}
            >
                <ScrollView
                    // scrollView das 3 paginas
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {/* /// general page // */}
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{
                            position: 'relative',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: windowWidth,
                            padding: 10
                        }}>

                            <Banner title={(route.params === undefined) ? trans[language].NEW_RECIPE : trans[language].UPDATE_RECIPE} />

                            <TextInput
                                value={recipeForm.recipeName}
                                style={[{
                                    flexDirection: "row",
                                    width: "100%",
                                    minHeight: 40,
                                    borderRadius: 10,
                                    paddingLeft: 10,
                                }, {
                                    fontSize: 20,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    color: GlobalStyles[theme].fontColor,
                                    backgroundColor: GlobalStyles[theme].paperColor
                                }]}
                                placeholder={trans[language].RECIPE_NAME}
                                placeholderTextColor={GlobalStyles[theme].fontColor}
                                onChangeText={text => handleOnChange('recipeName', text)}
                            />

                            <ImagesSwipe
                                recipeFormRecipePicture={recipeForm.recipePicture}
                                setShowImage={setShowImage}
                                showImage={showImage}
                                delIngredient={delIngredient}
                            />

                            {recipeForm.recipePicture.length < 3 &&
                                <View style={[{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                    borderStyle: 'solid',
                                    borderWidth: 0.5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 30,
                                    marginBottom: 10,
                                    marginTop: 0,
                                }, {
                                    borderColor: GlobalStyles[theme].borderColor,
                                    backgroundColor: GlobalStyles[theme].buttonColor
                                }]}>
                                    {recipeForm.recipePicture.length < 3 &&
                                        <TouchableOpacity>
                                            <Text style={{
                                                fontSize: GlobalTextStyles[text].fontSize,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                color: GlobalStyles[theme].fontColor
                                            }} onPress={pickImage}>
                                                {trans[language].ADD_A_IMAGE} {recipeForm.recipePicture.length}/3
                                            </Text>
                                        </TouchableOpacity>}
                                </View>
                            }

                            {/* // Cook Time Area //  */}
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
                                        <TextInput
                                        
                                            value={recipeForm.prepTime}
                                            placeholder="0"
                                            placeholderTextColor={GlobalStyles[theme].fontColor}
                                            style={[{
                                                width: 30,
                                                textAlign: "center",
                                                borderStyle: 'solid',
                                                borderBottomWidth: 0.5,
                                            }, {
                                                borderBottomColor: GlobalStyles[theme].borderColor,
                                                fontSize: GlobalTextStyles[text].fontSize,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                color: GlobalStyles[theme].fontColor
                                            }]}
                                            keyboardType='numeric'
                                            onChangeText={text => handleOnChange('prepTime', text)}
                                        />
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
                                        <TextInput
                                        placeholder="0"
                                        placeholderTextColor={GlobalStyles[theme].fontColor}
                                            value={recipeForm.cookTime}
                                            style={[{
                                                width: 30,
                                                textAlign: "center",
                                                borderStyle: 'solid',
                                                borderBottomWidth: 0.5,
                                            }, {
                                                borderBottomColor: GlobalStyles[theme].borderColor,
                                                fontSize: GlobalTextStyles[text].fontSize,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                color: GlobalStyles[theme].fontColor
                                            }]}
                                            keyboardType='numeric'
                                            onChangeText={text => handleOnChange('cookTime', text)}
                                        />
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

                                        <TouchableOpacity
                                            style={[{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                padding: 10,
                                                elevation: 2,
                                                borderWidth: 0.5,
                                                fontSize: 18,
                                                backgroundColor: difficultyColor,
                                                borderColor: GlobalStyles[theme].borderColor,
                                            }]}
                                            // backgroundColor={difficultyColor}
                                            onPress={() => setModalVisible(true)}
                                        >
                                            {(recipeForm.difficulty === "")
                                                ? <Text style={[{
                                                    color: "black",
                                                    fontWeight: "500",
                                                    textAlign: "center"
                                                }, { fontSize: GlobalTextStyles[text].fontSize, fontFamily: GlobalFontStyles[fontStyle].fontStyle, color: GlobalStyles[theme].fontColor }]}>{trans[language].DIF}</Text>
                                                : <Text style={[{
                                                    color: "black",
                                                    fontWeight: "500",
                                                    textAlign: "center"
                                                }, { fontSize: GlobalTextStyles[text].fontSize, fontFamily: GlobalFontStyles[fontStyle].fontStyle, color: GlobalStyles[theme].fontColor }]}>{recipeForm.difficulty.split(" ")[0].slice(0, 1)}{recipeForm.difficulty.split(" ")[1]?.slice(0, 1)}</Text>}
                                        </TouchableOpacity>
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
                                        <TextInput
                                            placeholder="0"
                                            placeholderTextColor={GlobalStyles[theme].fontColor}
                                            value={recipeForm.forHowMany}
                                            style={[{
                                                width: 30,
                                                textAlign: "center",
                                                borderStyle: 'solid',
                                                borderBottomWidth: 0.5,
                                            }, {
                                                borderBottomColor: GlobalStyles[theme].borderColor,
                                                fontSize: GlobalTextStyles[text].fontSize,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                color: GlobalStyles[theme].fontColor
                                            }]}
                                            keyboardType='numeric'
                                            onChangeText={text => handleOnChange('forHowMany', text)}
                                        />
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

                            {/* // Food Courses Area // */}
                            <View style={{
                                width: "100%",
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                marginBottom: 10,
                                backgroundColor: GlobalStyles[theme].paperColor,
                            }}>
                                {recipeForm.foodCourse !== "" ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
                                        <TouchableOpacity onPress={() => setModalVisible4(true)}
                                            style={{
                                                width: '90%',
                                            }}>
                                            <Text style={{
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                                fontSize: 16,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                                color: GlobalStyles[theme].fontColor
                                            }}>
                                                {recipeForm.foodCourse}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                width: "10%",
                                                alignItems: 'center',
                                                justifyContent: "center",
                                            }}
                                            onPress={() => setRecipeForm({ ...recipeForm, foodCourse: "" })}>
                                            <EvilIcons name="close-o" size={30} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity onPress={() => setModalVisible4(true)}
                                        style={{ width: "100%" }}>
                                        <Text style={{
                                            textAlignVertical: 'center',
                                            textAlign: 'left',
                                            // alignContent: 'center',
                                            height: '100%',
                                            width: '100%',
                                            fontSize: 15,
                                            paddingLeft: 15,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor,
                                        }}>
                                            {trans[language].FOOD_COURSE}
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </View>

                            {/* // Special Diet Area // */}
                            <View style={{
                                flexDirection: "row",
                                width: "100%",
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 10,
                            }}>
                                <View style={[{
                                    width: "79%",
                                    justifyContent: 'flex-start',
                                    borderRadius: 10,
                                    paddingHorizontal: 5,
                                    height: 40,
                                    flexDirection: "row",
                                    textAlignVertical: 'center',
                                    flexWrap: 'wrap',
                                }, { backgroundColor: GlobalStyles[theme].paperColor, }]}>
                                    {recipeForm.specialDiet.length > 0 ?
                                        recipeForm.specialDiet.map(item => {
                                            return logos.map(logo =>
                                                (logo.name === item) &&
                                                <TouchableOpacity key={uuid.v4()}
                                                    onPress={() => remove(`${logo.name}`, "specialDiet")}>
                                                    <Image
                                                        resizeMode='contain'
                                                        source={logo.image}
                                                        style={{ height: 35, width: 35, margin: 2.5 }}
                                                    />
                                                </TouchableOpacity>
                                            )
                                        }) :
                                        <Text style={{
                                            textAlignVertical: 'center',
                                            alignContent: 'center',
                                            height: '100%',
                                            fontSize: 15,
                                            paddingLeft: 10,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }}>
                                            {trans[language].SPECIAL_DIET}
                                        </Text>
                                    }
                                </View>

                                <TouchableOpacity
                                    style={[{
                                        width: 70,
                                        height: 40,
                                        borderRadius: 10,
                                        padding: 10,
                                        elevation: 2,
                                        borderWidth: 0.5,
                                    }, {
                                        borderColor: GlobalStyles[theme].borderColor,
                                        backgroundColor: GlobalStyles[theme].buttonColor,
                                    }]}
                                    onPress={() => setModalVisible2(true)}>

                                    <Text style={[{
                                        width: 50,
                                        textAlign: "center",
                                        alignSelf: 'center'
                                    }, {
                                        fontSize: GlobalTextStyles[text].fontSize,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        color: GlobalStyles[theme].fontColor
                                    }]}>
                                        {trans[language].SDIET}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            {/* // Tags Input // */}
                            <View style={[{
                                flexDirection: 'row',
                                width: "100%",
                                height: 40,
                                alignItems: 'center',
                                borderRadius: 10,
                                paddingStart: 10,
                                fontSize: 15
                            }, {
                                backgroundColor: GlobalStyles[theme].paperColor,
                            }]}>
                                <TouchableOpacity onPress={() => Alert.alert(
                                    trans[language].HASHTAG,
                                    trans[language].HASHTAG_INFO,
                                    [
                                        { text: trans[language].OK }
                                    ])}>
                                    <FontAwesome5 name="hashtag" size={24} color={GlobalStyles[theme].fontColor} />
                                </TouchableOpacity>

                                <TextInput
                                    value={tagsValue}
                                    style={{
                                        width: "100%",
                                        paddingLeft: 10,
                                        fontSize: GlobalTextStyles[text].fontSize,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        color: GlobalStyles[theme].fontColor
                                    }}
                                    placeholder={trans[language].ENTER_YOUR_TAGS}
                                    placeholderTextColor={GlobalStyles[theme].fontColor}
                                    maxLength={21}
                                    onChangeText={text => handleOnChange('tags', text)} />
                            </View>

                            {/* // Tags Output // */}
                            <View style={[{
                                minWidth: "100%",
                                maxWidth: "100%",
                                minHeight: 40,
                                borderRadius: 10,
                                marginTop: 10,
                                fontSize: 15,
                                padding: 10,
                            }, {
                                backgroundColor: GlobalStyles[theme].paperColor,
                            }]} >
                                {recipeForm.tags.map(item =>
                                    <Text
                                        key={uuid.v4()}
                                        onPress={(text) => remove(text, "tags")}
                                        style={{
                                            marginBottom: 5,
                                            fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }}
                                    >
                                        {item},
                                    </Text>
                                )}
                            </View>

                            {/* // Free Text // */}
                            <View style={[{
                                position: "relative",
                                minWidth: "100%",
                                maxWidth: "100%",
                                minHeight: 40,
                                borderRadius: 10,
                                fontSize: 15,
                                padding: 10,
                                marginTop: 10,
                                marginBottom: 0,
                            }, {
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TextInput
                                    style={{
                                        height: 120,
                                        textAlignVertical: 'top',
                                        fontSize: GlobalTextStyles[text].fontSize,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        color: GlobalStyles[theme].fontColor
                                    }}
                                    placeholder={trans[language].FREE_TEXT_MAX}
                                    placeholderTextColor={GlobalStyles[theme].fontColor}
                                    value={recipeForm.freeText}
                                    onChangeText={text => handleOnChange('freeText', text)}
                                    keyboardType="default"
                                    maxLength={256}
                                    multiline={true}
                                />
                                <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 5,
                                        right: 10,
                                        fontSize: GlobalTextStyles[text].fontSize,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        color: GlobalStyles[theme].fontColor
                                    }}>
                                    {recipeForm?.freeText?.length}/256
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* /// ingredients page // */}
                    <View 
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-start',

                    }}>
                        <ScrollView showsVerticalScrollIndicator={false}
                            // onScroll={handleScroll}
                            style={{
                                position: 'relative',
                                height: windowHeight - 140,
                                width: windowWidth,
                                padding: 10,
                                backgroundColor: GlobalStyles[theme].background
                            }}>

                            <Banner title={trans[language].INGREDIENTS} />

                            <SpSheet text={trans[language].OPEN_UNITS_CONVERTOR} heightValue={550}><Conversions /></SpSheet>

                            <View style={[{
                                height: 50,
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginVertical: 10,
                                borderRadius: 10
                            }, {
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>

                                <TextInput
                                    value={ingredients.quantity}
                                    style={[{
                                        width: "15%",
                                        height: "100%",
                                        // width: 50,
                                        // paddingLeft: 10,
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        textAlignVertical: 'center',
                                        alignSelf: 'center',


                                    }, {
                                        fontSize: GlobalTextStyles[text].fontSize,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        color: GlobalStyles[theme].fontColor,
                                    }]}
                                    keyboardType='numeric'
                                    placeholder={trans[language].QTY}
                                    placeholderTextColor={GlobalStyles[theme].fontColor}
                                    onChangeText={text => handleIngredients('quantity', text)}
                                />

                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "10%",
                                    // width: 40,
                                }}>
                                    <TouchableOpacity
                                        style={[{
                                            width: "100%",
                                            justifyContent: 'center',
                                            textAlignVertical: 'center',

                                        }]}
                                        onPress={() => setModalVisible3(true)}
                                    >
                                        {(ingredients.units === "")
                                            ? <Text style={{
                                                textAlign: "center",
                                                color: GlobalStyles[theme].fontColor,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            }}>{trans[language].UN}</Text>
                                            : <Text style={{
                                                textAlign: "center",
                                                color: GlobalStyles[theme].fontColor,
                                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                            }}>{units.map(unit => unit.unit === ingredients.units && unit.abreviation)}</Text>}
                                    </TouchableOpacity>
                                </View>

                                <SelectCountry
                                    style={{
                                        height: "100%",
                                        width: "35%",
                                        paddingLeft: 5,
                                    }}
                                    containerStyle={{
                                        width: 200,
                                        borderRadius: 10,
                                        backgroundColor: GlobalStyles[theme].paperColor,
                                        borderColor: GlobalStyles[theme].borderColor,
                                        color: GlobalStyles[theme].fontColor,
                                    }}
                                    selectedTextStyle={{
                                        fontSize: 15,
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}
                                    placeholderStyle={{
                                        fontSize: 15,
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}
                                    // imageStyle={styles.imageStyle}
                                    inputSearchStyle={{
                                        height: 40,
                                        fontSize: 16,
                                        width: "94%",
                                        color: 'black',
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}
                                    iconStyle={{
                                        width: 20,
                                        height: 20,
                                        tintColor: 'white'
                                    }}
                                    search
                                    maxHeight={300}
                                    value={ingredients.product}
                                    data={productList}
                                    valueField="key"
                                    labelField="value"
                                    placeholder={ingredients?.product === "" ? "ingredients" : ingredients?.product}
                                    searchPlaceholder={trans[language].SEARCH}
                                    onChange={(item) => handleIngredients('product', item.value)}
                                />

                                <TextInput
                                    value={ingredients.remarks}
                                    style={{
                                        // width: "42%",
                                        width: "26%",
                                        textAlignVertical: 'center',
                                        paddingLeft: 5,
                                        fontSize: 15,
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}
                                    placeholder='Remarks'
                                    placeholderTextColor={GlobalStyles[theme].fontColor}
                                    onChangeText={text => handleIngredients('remarks', text)}
                                />

                                <TouchableOpacity
                                    onPress={addIngredient}
                                    style={{
                                        width: 50,
                                        // paddingVertical: 10,
                                        // paddingHorizontal: 20,
                                        backgroundColor: GlobalStyles[theme].buttonColor,
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10,
                                    }}>
                                    <Text style={{
                                        width: '100%',
                                        height: '100%',
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}>{trans[language].ADD}</Text>
                                </TouchableOpacity>

                            </View>

                            {recipeForm.ingredients.map(item =>
                                <View style={[{
                                    width: "100%",
                                    height: 45,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: 10,
                                    borderRadius: 10,
                                }, {
                                    backgroundColor: GlobalStyles[theme].paperColor
                                }]} key={uuid.v4()}>
                                    <Text style={{
                                        width: "15%",
                                        paddingLeft: 10,
                                        justifyContent: 'center',
                                        textAlignVertical: 'center',
                                        textAlign: 'center',
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}>{item.quantity}</Text>
                                    <Text style={{
                                        width: "13%",
                                        textAlignVertical: 'center',
                                        textAlign: 'center',
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}>{units.map(unit => unit.unit === item.units && unit.abreviation)}</Text>
                                    <Text style={{
                                        width: "30%",
                                        paddingLeft: 5,
                                        textAlignVertical: 'center',
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}>{item.product}</Text>
                                    <Text style={{
                                        width: "27%",
                                        textAlignVertical: 'center',
                                        paddingLeft: 5,
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}>{item.remarks}</Text>

                                    <View style={{
                                        width: "15%",
                                        flexDirection: "row",
                                        alignSelf: 'center',
                                        justifyContent: 'space-around'
                                    }}>
                                        <TouchableOpacity style={styles.validation} onPress={() => editIngredient(item.product)}>
                                            <Feather name="edit-3" size={24} color={GlobalStyles[theme].fontColor} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.validation} onPress={() => delIngredient(item.product, "ingredient")}>
                                            <AntDesign name="delete" size={24} color={GlobalStyles[theme].fontColor} />
                                        </TouchableOpacity>
                                    </View>

                                </View>)}


                        </ScrollView>
                    </View>

                    {/* /// preparation page // */}
                    <View 
                    style={{
                        flex: 1,
                        minHeight: windowHeight - 400,
                        width: windowWidth,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10,
                        backgroundColor: GlobalStyles[theme].background,
                    }}>

                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: "80%" }}>

                            <Banner title={trans[language].PREPARATION} />

                            <View style={[{
                                minHeight: 50,
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginVertical: 10,
                                borderRadius: 10
                            }, { backgroundColor: GlobalStyles[theme].paperColor }]}>

                                <TextInput
                                    value={preparation.preparation}
                                    style={{
                                        width: "88%",
                                        paddingLeft: 10,
                                        paddingVertical: 5,
                                        fontSize: 15,
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    }}
                                    keyboardType='ascii-capable'
                                    placeholder={trans[language].PREPARATION_STEP}
                                    placeholderTextColor={GlobalStyles[theme].fontColor}
                                    onChangeText={text => handlePreparation(text)}
                                    multiline
                                />
                                <TouchableOpacity
                                    onPress={addStep}
                                    style={{
                                        width: 45,
                                        minHeight: 40,
                                        justifyContent: 'center',
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10,
                                        backgroundColor: GlobalStyles[theme].buttonColor,

                                    }}>
                                    <Text style={{
                                        width: '100%',
                                        minHeight: 40,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}>{trans[language].ADD}</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={recipeForm.preparation}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) =>
                                    <View style={[{
                                        flexDirection: "row",
                                        width: "100%",
                                        minHeight: 25,
                                        textAlignVertical: 'center',
                                        alignContent: "center",
                                        marginBottom: 10,
                                        borderRadius: 10,
                                    }, { backgroundColor: GlobalStyles[theme].paperColor }]} >
                                        <Text style={[{
                                            width: 60,
                                            paddingLeft: 10,
                                            textAlignVertical: 'center',
                                            paddingVertical: 5,
                                        }, {
                                            color: GlobalStyles[theme].fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        }]} >{trans[language].STEP} {item.step}</Text>
                                        <Text style={[{
                                            width: windowWidth - 140,
                                            textAlignVertical: 'center',
                                            justifyContent: 'flex-start',
                                            paddingVertical: 5,
                                        }, {
                                            color: GlobalStyles[theme].fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        }]} >{item.preparation}</Text>

                                        <View style={{
                                            width: 60,
                                            flexDirection: "row",
                                            alignSelf: 'center',
                                            justifyContent: 'space-around'
                                        }} >
                                            <TouchableOpacity style={styles.validation} onPress={() => editStep(item.step)}>
                                                <Feather name="edit-3" size={24} color={GlobalStyles[theme].fontColor} />
                                            </TouchableOpacity>
                                            {(recipeForm.preparation[recipeForm.preparation.length - 1].step === item.step) &&
                                                <TouchableOpacity style={styles.validation} onPress={() => delStep(item.step)}>
                                                    <AntDesign name="delete" size={24} color={GlobalStyles[theme].fontColor} />
                                                </TouchableOpacity>
                                            }
                                        </View>

                                    </View>
                                }
                                keyExtractor={item => item.preparation}
                            />
                        </View>

                        <SwitchButton text01={trans[language].PUBLIC} text02={trans[language].PRIVATE} show={(route.params === undefined) ? show : recipeForm.status} setShow={setShow} />

                        < View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }} >
                            <TouchableOpacity style={[{
                                marginBottom: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                borderStyle: 'solid',
                                borderWidth: 0.5,
                                paddingVertical: 10,
                                paddingHorizontal: 20
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].noColor
                            }]} onPress={clearForm}>
                                <Text style={{
                                    color: GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                }}>
                                    {trans[language].CLEAR_FORM}
                                </Text>
                            </TouchableOpacity>
                            {(route.params === undefined)
                                ? <TouchableOpacity style={[{
                                    marginBottom: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                    borderStyle: 'solid',
                                    borderWidth: 0.5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20
                                }, {
                                    borderColor: GlobalStyles[theme].borderColor,
                                    backgroundColor: GlobalStyles[theme].buttonColor
                                }]} onPress={handleAdd}>
                                    <Text style={{
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}>
                                        {trans[language].ADD_RECIPE_TO_MY_BOOK}
                                    </Text>
                                </TouchableOpacity>
                                : <TouchableOpacity style={[{
                                    marginBottom: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                    borderStyle: 'solid',
                                    borderWidth: 0.5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 30
                                }, {
                                    borderColor: GlobalStyles[theme].borderColor,
                                    backgroundColor: GlobalStyles[theme].buttonColor
                                }]} onPress={handleEdit}>
                                    <Text style={{
                                        color: GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}>{trans[language].UPDATE_RECIPE}</Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </View>

                    {/* // Difficulty Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 340,
                                padding: 35,
                                paddingVertical: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity style={{
                                    position: 'absolute',
                                    width: "100%",
                                    alignItems: 'flex-end',
                                    marginTop: 20,
                                    marginRight: 20,
                                    top: 0,
                                    right: 0
                                }}
                                    onPress={() => setModalVisible(false)}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <FlatList
                                    data={difficulty}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            minWidth: 150,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={(text) => handleDifficulty(text)}
                                        >{item.value}</Text>
                                    </TouchableOpacity>

                                    }
                                    keyExtractor={item => item.key}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // Food Courses Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible4}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => setModalVisible4(false)}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <FlatList
                                    data={foodCourses}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            minWidth: 150,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={(text) => handleFoodCourse(text)}>
                                            {item.value}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.key}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // Special Diet Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible2}>

                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => setModalVisible2(false)}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <FlatList
                                    data={logos}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <TouchableOpacity
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            minWidth: 150,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
                                            onPress={(text) => handleSpecialDiet(text)}>
                                            {item.name}</Text>
                                    </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.name}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* // Units Modal // */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible3}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <View style={[{
                                borderRadius: 10,
                                maxHeight: 400,
                                padding: 35,
                                paddingTop: 45,
                                alignItems: "center",
                                elevation: 5,
                                borderWidth: 0.5,
                            }, {
                                borderColor: GlobalStyles[theme].borderColor,
                                backgroundColor: GlobalStyles[theme].paperColor
                            }]}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 20,
                                        marginRight: 20,
                                        top: 0,
                                        right: 0
                                    }}
                                    onPress={() => setModalVisible3(false)}>
                                    <EvilIcons name="close-o" size={30} color="red" />
                                </TouchableOpacity>
                                <FlatList
                                    data={units}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <Pressable
                                        style={[{
                                            borderRadius: 10,
                                            paddingHorizontal: 20,
                                            paddingVertical: 10,
                                            minWidth: 150,
                                            borderWidth: 0.5,
                                            marginVertical: 5,
                                            elevation: 2,
                                        }, {
                                            borderColor: GlobalStyles[theme].borderColor,
                                            backgroundColor: GlobalStyles[theme].buttonColor
                                        }]}
                                    >
                                        <Text style={[{
                                            textAlign: "center"
                                        }, {
                                            fontSize: GlobalTextStyles[text].fontSize,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                            color: GlobalStyles[theme].fontColor
                                        }]}
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

                    <PopupModal message={redux?.recipe.message} popupModal={popupModal} />

                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback >
    )
}

const styles = StyleSheet.create({})

{/* // Food Courses Area // */ }
{/* <View style={{
    flexDirection: "row",
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-between'
}}>
    <View style={{
        backgroundColor: GlobalStyles[theme].paperColor,
        width: '79%',
        height: 40,
        borderRadius: 10
    }}>
        {recipeForm.foodCourse !== "" ?
            <TouchableOpacity onPress={() => setRecipeForm({ ...recipeForm, foodCourse: "" })}>
                <Text style={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 16,
                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                    color: GlobalStyles[theme].fontColor
                }}>
                    {recipeForm.foodCourse}
                </Text>
            </TouchableOpacity>
            : <Text style={{
                height: '100%',
                textAlignVertical: 'center',
                fontSize: 15,
                paddingLeft: 15,
                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                color: GlobalStyles[theme].fontColor
            }}>
                {trans[language].FOOD_COURSE}
            </Text>}
    </View>

    <TouchableOpacity
        style={[{
            width: 70,
            height: 40,
            borderRadius: 10,
            padding: 10,
            elevation: 2,
            borderWidth: 0.5,
        }, {
            color: GlobalStyles[theme].fontColor,
            borderColor: GlobalStyles[theme].borderColor,
            backgroundColor: GlobalStyles[theme].buttonColor
        }]}
        onPress={() => setModalVisible4(true)}>

        <Text style={[{
            width: 70,
            textAlign: "center",
            alignSelf: 'center',
        }, {
            fontSize: GlobalTextStyles[text].fontSize,
            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
            color: GlobalStyles[theme].fontColor
        }]}>
            {trans[language].COURSE}
        </Text>
    </TouchableOpacity>

</View> */}

// Fixed Button
{/* <TouchableOpacity
 onPress={addIngredient}
 style={{
     position: "absolute",
     top: 530 + yOffset,
     right: 70,
     paddingVertical: 10,
     paddingHorizontal: 20,
     backgroundColor: GlobalStyles[theme].buttonColor,
     borderRadius: 10,
 }}>
 <Text style={{
     width: '100%',
     height: '100%',
     textAlign: 'center',
     textAlignVertical: 'center',
     color: GlobalStyles[theme].fontColor,
     fontFamily: GlobalFontStyles[fontStyle].fontStyle
 }}>{trans[language].ADD}</Text>
</TouchableOpacity> */}