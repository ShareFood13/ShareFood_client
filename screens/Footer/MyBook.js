import React, { useEffect, useState, useCallback, useContext } from 'react'

import { useIsFocused } from '@react-navigation/native';

import {
    TextInput,
    Dimensions,
    FlatList,
    RefreshControl,
} from 'react-native'

import { useDispatch, useSelector } from 'react-redux';
import { Context } from "../../context/UserContext";
import { CLEAR_MSG } from "../../Redux/constants/constantsTypes.js"

import RecipeCard from '../../components/RecipeCard';
import PopupModal from '../../components/PopupModal';

import { getMyRecipes } from '../../Redux/actions/recipes';

import * as SecureStore from 'expo-secure-store';

// import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function MyBook({ navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const [popupModal, setPopupModal] = useState(false)
    const [myRecipes, setMyRecipes] = useState()
    const [userId, setUserId] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const [showFlatlist, setShowFlatlist] = useState(false)

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const redux = useSelector((state) => state)
    // console.log("MyBook redux", redux)
    // console.log("MyBook redux", redux?.recipe?.recipes)
    // console.log("userContext", userContext)
    // console.log("MyBook myRecipes", myRecipes)

    useEffect(() => {
        if (redux?.recipe.recipes) {
            setMyRecipes(redux.recipe.recipes)
        }
        if (redux?.recipe.message !== "") {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
            }, 2500)
        }
    }, [redux, isFocused])

    useEffect(() => {
        getItem()
    }, [isFocused])

    async function getItem() {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    useEffect(() => {
        onRefresh()
        dispatch(getMyRecipes(userId, navigation))
    }, [userId, isFocused])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setShowFlatlist(false)
        // setMyRecipes(userContext?.result?.recipesId)
        wait(3000).then(() => setRefreshing(false)).then(() => setShowFlatlist(true))
    }, []);

    const onChangeSearch = (text) => {
        const list = []
        userContext?.result?.recipesId.map(recipe => recipe.recipeName.toLowerCase().includes(text.toLowerCase()) && list.push(recipe))
        setMyRecipes(list)
    }

    return (
        <>
            <TextInput
                onChangeText={text => onChangeSearch(text)}
                placeholder="Search for a recipe..."
                style={{
                    backgroundColor: 'white',
                    width: windowWidth * 0.9,
                    height: 40,
                    paddingLeft: 15,
                    borderBottomWidth: 2,
                    borderBottomColor: 'black',
                    borderRadius: 10,
                    marginVertical: 10,
                    alignSelf: 'center'
                }}
            />
            {showFlatlist &&
                <FlatList
                    data={myRecipes}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => !item?.isDeleted && <RecipeCard recipe={item} navigation={navigation} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh()}
                        />
                    }
                    keyExtractor={item => item?._id}
                />
            }
            <PopupModal message={redux?.recipe.message} popupModal={popupModal} />
        </>
    )
}

// const styles = StyleSheet.create({
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
// })