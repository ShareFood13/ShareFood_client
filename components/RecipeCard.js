import React, { useEffect, useState, useCallback, useContext } from 'react'

import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    TextInput,
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
    ActivityIndicator,
    FlatList,
    SafeAreaView
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

const logos = [
    { name: "Vegan", image: require('../assets/images/logo/vegan.png') },
    { name: "Organic", image: require('../assets/images/logo/organic.png') },
    { name: "Gluten Free", image: require('../assets/images/logo/glutenFree.png') },
    { name: "Lactose Free", image: require('../assets/images/logo/lactoseFree.png') },
    { name: "Egg Free", image: require('../assets/images/logo/eggFree2.png') },
    { name: "Nut Free", image: require('../assets/images/logo/nutFree.png') },
    { name: "Less Sugar", image: require('../assets/images/logo/lessSugar.png') },
    { name: "Low Fat", image: require('../assets/images/logo/lowFat.png') },
    { name: "Contain Nuts", image: require('../assets/images/logo/containNuts.png') },
    { name: "No Molluses", image: require('../assets/images/logo/noMolluses.png') },
    { name: "Zero Fat", image: require('../assets/images/logo/zeroFat.png') },
    { name: "Raw Food", image: require('../assets/images/logo/rawFood.png') },
    { name: "Safe For Kids", image: require('../assets/images/logo/safeForKids.png') },
    { name: "Spicy", image: require('../assets/images/logo/spicy.png') },
    { name: "Constain Soybean", image: require('../assets/images/logo/constainSoybean.png') },
    { name: "Contain Custacean", image: require('../assets/images/logo/containCustacean.png') },
    { name: "Halal", image: require('../assets/images/logo/chalal.png') },
    { name: "Kosher", image: require('../assets/images/logo/kosher.png') },

    // { name: "Gluten Free2", image: require('../assets/images/logo/glutenFree2.png') },
    // { name: "Milk Free2", image: require('../assets/images/logo/milkFree2.png') },
    // { name: "Sugar Free2", image: require('../assets/images/logo/sugarFree2.png') },
    // { name: "Vegan2", image: require('../assets/images/logo/vegan2.png') },
    // { name: "Wheat Free2", image: require('../assets/images/logo/wheatFree2.png') },
]
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe } from '../Redux/actions/recipes';
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
import GlobalFontStyles from '../GlobalFontStyles';
import GlobalStyles from '../GlobalStyles';
import trans from '../Language'
import { Context } from '../context/UserContext';
var theme = ""
var language = ""
var fontStyle = ""
export default function RecipeCard({ recipe, navigation }) {
    const dispatch = useDispatch()
    // const [language, setLanguage] = useState("en")
    // const [theme, setTheme] = useState("stylesLight")
    // const [fontStyle, setFontStyle] = useState("Montserrat")
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
    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])
    const openRecipe = (recipe) => {
        // navigation.push('RecipeDetail', { recipeData: recipe })
        // console.log("RecipeCard", recipe._id)
        // dispatch(getRecipe(recipe._id))

        // navigation.push('RecipeDetail', { recipeId: recipe._id })
        navigation.push('RecipeDetail', { recipeFromHome: recipe, recipeDetailFlag: false })

    }
    // console.log(recipe?.recipePicture?.small)
    return (
        <View style={[styles.container, { backgroundColor: GlobalStyles[theme]?.background }]}>
            <View style={[styles.recipeCard, { backgroundColor: GlobalStyles[theme]?.paperColor, borderColor: GlobalStyles[theme]?.borderColor }]}>
                <View style={styles.subCard}>

                    <TouchableOpacity style={styles.left} onPress={() => openRecipe(recipe)}>
                        <Text style={{ width: "100%", textAlign: 'center', fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>{recipe?.recipeName}</Text>

                        <View style={{
                            flexDirection: 'row',
                            width: "100%",
                            paddingLeft: 0,
                            overflow: 'hidden',
                        }}>
                            <View style={{ height: 45 }} >
                                <FlatList
                                    data={recipe?.specialDiet}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return logos.map(logo =>
                                            (logo.name === item)
                                                ? <Image
                                                    key={logo.name}
                                                    resizeMode='contain'
                                                    source={logo.image}
                                                    style={{ height: 35, width: 35, margin: 5 }} />
                                                : null
                                        )
                                    }}
                                    keyExtractor={item => item}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', width: 170, justifyContent: 'space-between', alignSelf: 'center' }}>
                            <Text style={{ fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>
                                <AntDesign name="like2" size={24} color={GlobalStyles[theme]?.fontColor} />
                                {recipe?.likes?.length}
                            </Text>
                            <Text style={{ fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>
                                <AntDesign name="hearto" size={24} color={GlobalStyles[theme]?.fontColor} />
                                {recipe?.downloads?.length}
                            </Text>
                            <Text style={{ fontFamily: GlobalFontStyles[fontStyle]?.fontStyle, color: GlobalStyles[theme]?.fontColor }}>
                                <Entypo name="stopwatch" size={24} color={GlobalStyles[theme]?.fontColor} />
                                {Number(recipe?.cookTime) + Number(recipe?.prepTime)}
                            </Text>
                        </View>

                    </TouchableOpacity>

                    <View style={styles.image}>
                        {recipe?.recipePicture?.small?.length > 0 && <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ width: 140, height: 70 }}>
                            {recipe?.recipePicture?.small?.map((image, index) =>
                                <View key={index} style={{ position: 'relative' }}>
                                    <Image source={{ uri: image }} style={{ width: 140, height: "100%", resizeMode: "cover", borderRadius: 10 }} />
                                </View>)}
                        </ScrollView>}
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
    image: {
        borderRadius: 10,
        borderWidth: 0.5,
        borderStyle: 'solid',
        height: "100%",
        // width: "40%"
    },
    left: {
        justifyContent: 'space-around',
        width: "60%",
        height: "95%"
    },
    recipeCard: {
        width: "100%",
        height: 100,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
    },
    subCard: {
        flexDirection: "row",
        width: "100%",
        height: "100%",
        justifyContent: 'space-between'
    },
})