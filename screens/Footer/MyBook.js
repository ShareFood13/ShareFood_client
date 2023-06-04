import React, { useEffect, useState, useCallback, useContext } from 'react'
import {
    TextInput,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View
} from 'react-native'
import Constants from 'expo-constants';


import { useIsFocused } from '@react-navigation/native';

import { Context } from "../../context/UserContext";
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_MSG } from "../../Redux/constants/constantsTypes.js"
import { getMyRecipes } from '../../Redux/actions/recipes';

import RecipeCard from '../../components/RecipeCard';
import PopupModal from '../../components/PopupModal';

import * as SecureStore from 'expo-secure-store';

// import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

var courses = ['All'];
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
import trans from '../../Language'
import GlobalStyles from '../../GlobalStyles';

export default function MyBook({ route, navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const [popupModal, setPopupModal] = useState(false)
    const [userId, setUserId] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const [filter, setFilter] = useState('All');
    const [theme, setTheme] = useState('stylesLight')
    const [newList, setNewList] = useState([]);
    const [language, setLanguage] = useState("en");
    const [fontStyle, setFontStyle] = useState("Montserrat");
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


    const redux = useSelector((state) => state)
    const [myRecipes, setMyRecipes] = useState(redux.recipe.recipes)
    // console.log("myBook redux", redux.recipe.recipes)
    // console.log(fromNewRecipe)

    useEffect(() => {
        setMyRecipes(redux.recipe.recipes)
        if (redux?.recipe.message !== "") {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
            }, 2500)
        }
    }, [redux, isFocused])

    useEffect(() => {
        // getItem()
        // console.log("params", route.params.fromNewRecipe)
        setUserId(redux?.auth?.authData?.result?._id)
    }, [])

    async function getItem() {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    useEffect(() => {
        if (route.params.fromNewRecipe === true) {
            // console.log("65", route.params.fromNewRecipe)
            onRefresh()
            route.params.fromNewRecipe = false
        }
    }, [route.params.fromNewRecipe === true])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // console.log({ userId })
        userId !== null && dispatch(getMyRecipes(userId))
        wait(3000).then(() => setRefreshing(false))
    }, []);

    useEffect(() => {
        redux.recipe.recipes.map(
            (item) =>
                !courses.includes(item.foodCourse) && courses.push(item.foodCourse)
        );
    }, []);

    // useEffect(() => {
    //     console.log({ filter })
    //     if (filter === 'All') {
    //         // setNewList([...redux.recipe.recipes]);
    //         setMyRecipes([...redux.recipe.recipes])
    //     } else {
    //         const result = redux.recipe.recipes.filter((item) => item.foodCourse === filter);
    //         // setNewList([...result]);
    //         setMyRecipes([...result])
    //     }
    // }, [filter]);

    const pageFilter = (item) => {
        setFilter(item)
        if (item === 'All') {
            setMyRecipes([...redux.recipe.recipes])
        } else {
            const result = redux.recipe.recipes.filter((prod) => prod.foodCourse === item);
            setMyRecipes([...result])
        }
    }

    function onChangeSearch(text) {
        const list = []
        var result = []

        if (filter !== "All") {
            result = redux.recipe.recipes.filter((prod) => prod.foodCourse === filter)
            result.map(recipe => recipe.recipeName.toLowerCase().includes(text.toLowerCase()) && list.push(recipe))
        } else {
            redux.recipe.recipes.map(recipe => recipe.recipeName.toLowerCase().includes(text.toLowerCase()) && list.push(recipe))
        }
        setMyRecipes(list)
    }

    return (
        <View style={[styles.container, { backgroundColor: GlobalStyles[theme].background }]}>

            <TextInput
                onChangeText={text => onChangeSearch(text)}
                placeholder={trans[language].SEARCH}
                placeholderTextColor={GlobalStyles[theme].fontColor}
                style={[{
                    width: "100%",
                    height: 40,
                    paddingLeft: 15,
                    marginBottom: 10,
                    alignSelf: 'center',
                    fontSize: 15,
                    borderBottomWidth: 2,
                    borderRadius: 10,
                    borderWidth: 0.5,
                }, {
                    color: GlobalStyles[theme].fontColor,
                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                    borderColor: GlobalStyles[theme].fontColor,
                    backgroundColor: GlobalStyles[theme].paperColor,
                }]}
            />

            <ScrollView
                style={styles.pagination}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {courses.map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            {
                                width: 130,
                                height: 50,
                                marginBottom: 3,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 0.5,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            },
                            { backgroundColor: filter === item ? GlobalStyles[theme].buttonColor : GlobalStyles[theme].lightBlue },
                            { borderBottomColor: filter === item ? GlobalStyles[theme].buttonColor : GlobalStyles[theme].fontColor },
                        ]}
                        onPress={() => pageFilter(item)}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 16,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            color: filter === item ? GlobalStyles[theme].fontColor : GlobalStyles[theme].fontColor
                        }}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {<FlatList
                data={myRecipes}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ backgroundColor: GlobalStyles[theme].background }}
                style={[{ backgroundColor: GlobalStyles[theme].background }]}
                renderItem={({ item }) => !item?.isDeleted &&
                    <RecipeCard recipe={item} key={item._id} navigation={navigation} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }
                keyExtractor={item => item?._id}
            />}

            {/* <ScrollView style={styles.recipes} showsVerticalScrollIndicator={false}>
                {myRecipes.map((item) => !item?.isDeleted && <RecipeCard recipe={item} key={item._id} navigation={navigation} />
                )}
            </ScrollView> */}

            <PopupModal message={redux?.recipe.message} popupModal={popupModal} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'flex-start',
        padding: 10
    },
    // search: {
    //     width: "100%",
    //     height: 40,
    //     paddingLeft: 15,
    //     borderBottomWidth: 2,
    //     borderBottomColor: 'black',
    //     borderRadius: 10,
    //     marginBottom: 10,
    //     alignSelf: 'center',
    //     backgroundColor: '#eee',
    //     fontWeight: 'bold',
    //     fontSize: 15
    // },
    pagination: {
        height: 0,
        width: windowWidth
    },
    // page: {
    //     width: 130,
    //     height: 50,
    //     // backgroundColor: 'cyan',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderColor: 'black',
    //     borderWidth: 0.5,
    //     borderTopLeftRadius: 20,
    //     borderTopRightRadius: 20,
    //     marginBottom: 3
    // },
    // card: {
    //     height: 70,
    //     width: windowWidth * 0.95,
    //     borderColor: 'black',
    //     borderWidth: 0.5,
    //     borderRadius: 12,
    //     backgroundColor: 'white',
    //     marginVertical: 6,
    //     paddingLeft: 10,
    //     justifyContent: 'center',
    // },
    // recipes: {
    //     height: 500,
    //     windowWidth,
    //     backgroundColor: '#ecf0f1',
    //     // alignItems: 'center',
    // },
    //     container: {
    //         flex: 1,
    //         justifyContent: 'center',
    //         alignItems: 'center'
    //     },
    //     image: {
    //         borderRadius: 10,
    //         borderWidth: 1,
    //         borderStyle: 'solid',
    //     },
    //     left: {
    //         justifyContent: 'space-around',
    //         width: "57%"
    //     },
    //     recipeCard: {
    //         width: "90%",
    //         height: 100,
    //         borderRadius: 10,
    //         borderStyle: 'solid',
    //         borderWidth: 1,
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         alignSelf: 'center',
    //         marginVertical: 10,
    //         backgroundColor: 'white',
    //         shadowColor: "#000",
    //         shadowOffset: {
    //             width: 0,
    //             height: 2
    //         },
    //         shadowOpacity: 0.25,
    //         shadowRadius: 4,
    //     },
    //     subCard: {
    //         flexDirection: "row",
    //         width: "95%",
    //         justifyContent: 'space-between'
    //     },
})