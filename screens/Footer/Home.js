//npx pod-install
import React, { useState, useContext, useEffect, useCallback } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Dimensions
} from 'react-native'

import { useIsFocused } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';

import { Context } from "../../context/UserContext";

import PopupModal from '../../components/PopupModal';
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';

import GlobalStyles from '../../GlobalStyles';
import BannerFollowers from '../../components/BannerFollowers';
import UserAbout from '../../components/UserAbout';
import UserCarrousel from '../../components/UserCarrousel';

import { useFonts } from 'expo-font';
import {
    // Roboto_400Regular,
    // Lato_400Regular,
    Montserrat_400Regular,
    // Oswald_400Regular,
    // SourceCodePro_400Regular,
    // Slabo27px_400Regular,
    // Poppins_400Regular,
    // Lora_400Regular,
    // Rubik_400Regular,
    // PTSans_400Regular,
    // Karla_400Regular
} from '@expo-google-fonts/dev';
import GlobalFontStyles from '../../GlobalFontStyles';
import GridList from '../../components/GridList';

import * as SplashScreen from 'expo-splash-screen';

export default function Home({ navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const dispatch = useDispatch()
    const [showPictures, setShowPictures] = useState("grid")
    const windowWidth = Dimensions.get('window').width;
    var countRecipe = 0
    const isFocused = useIsFocused();

    const [userId, setUserId] = useState(null)
    const [popupModal, setPopupModal] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [moreHeight, setMoreHeight] = useState(true)
    const [theme, setTheme] = useState("stylesLight")
    const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
        // Roboto_400Regular,
        // Lato_400Regular,
        Montserrat_400Regular,
        // Oswald_400Regular,
        // SourceCodePro_400Regular,
        // Slabo27px_400Regular,
        // Poppins_400Regular,
        // Lora_400Regular,
        // Rubik_400Regular,
        // PTSans_400Regular,
        // Karla_400Regular
    })

    SplashScreen.preventAutoHideAsync();

    const redux = useSelector((state) => state)

    redux?.recipe?.recipes?.map(recipe => !recipe.isDeleted && countRecipe++)
    var otherUsersList = redux?.other?.otherUsers

    useEffect(() => {
        if (redux?.auth?.message !== "") {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                // onRefresh()
            }, 2500)
        }
    }, [redux, isFocused])

    useEffect(() => {
        redux?.auth?.authData?.result?.profile && setUserContext(redux.auth.authData.result.profile)
    }, [redux])

    useEffect(() => {
        // getItem()
        setUserId(redux?.auth?.authData?.result?._id)
    }, [redux])

    // async function getItem() {
    //     setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    // }

    // useEffect(() => {
    //     userId !== undefined && dispatch(getotherusers(userId))//.then(dispatch(getotherrecipes()))
    //     dispatch(getotherrecipes())
    //     userId !== undefined && dispatch(getMyMails(userId))

    // }, [userId, isFocused])

    // useEffect(() => {
    //     userId !== undefined && dispatch(getUserInfo(userId))
    // }, [userId, isFocused])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // setMyRecipes(userContext?.result?.recipesId)
        // console.log("userId", userId)
        // userId !== null && dispatch(getotherusers(userId))
        // userId !== null && dispatch(getUserInfo(userId))
        wait(3000).then(() => setRefreshing(false))//.then(() => dispatch(getUserInfo(userId)))
    }, []);

    // const openOtherUser = (userInfo) => {
    //     navigation.navigate("ShowOtherUser", { userInfo })
    // }

    // const startFollowingFn = (follow_id) => {
    //     dispatch(startFollowing({ userId, follow_id }))
    // }

    const openRecipe = (recipe) => {
        navigation.push('RecipeDetail', { recipeFromHome: recipe, recipeDetailFlag: true })
    }

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const Header = () => {
        return (<>

            <BannerFollowers
                countRecipe={countRecipe}
                userImage={redux?.auth?.authData?.result?.profile?.profilePicture.base64}
                userContext={userContext}
            />

            <UserAbout userContext={userContext} setMoreHeight={setMoreHeight} moreHeight={moreHeight} />

            <UserCarrousel otherUsersList={otherUsersList} following={redux?.auth?.authData?.result?.profile?.following} navigation={navigation} userId={userId} />

            <GridList showPictures={showPictures} setShowPictures={setShowPictures} />

        </>)
    }

    return (<View style={{ backgroundColor: GlobalStyles[theme].background }} onLayout={onLayoutRootView}>
        {showPictures === "grid" ?
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }
                ListHeaderComponent={<Header />}
                data={redux?.recipe?.recipes}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                initialNumToRender={9}
                maxToRenderPerBatch={9}
                renderItem={({ item }) =>
                    (!item?.isDeleted) ?
                        <TouchableOpacity onPress={() => openRecipe(item)}>
                            <View style={{ width: windowWidth / 3, height: windowWidth / 3, borderWidth: 0.2, borderColor: 'black' }}>
                                <Image source={{ uri: item?.recipePicture?.normal[0] }} style={{ width: windowWidth / 3, height: windowWidth / 3, resizeMode: "cover", }} />
                            </View>
                        </TouchableOpacity>
                        : null
                }
                key={'_'}
                keyExtractor={item => "_" + item._id}
            /> :
            <FlatList
                ListHeaderComponent={<Header />}
                data={redux?.recipe?.recipes}
                showsVerticalScrollIndicator={false}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                renderItem={({ item }) =>
                    (!item?.isDeleted) ?
                        <TouchableOpacity onPress={() => openRecipe(item)}>
                            <View style={{ width: windowWidth, borderWidth: 1, borderColor: 'black' }}>
                                <Image source={{ uri: item?.recipePicture?.normal[0] }} style={{ width: windowWidth, height: windowWidth * 3 / 4, resizeMode: "cover", }} />
                                <Text
                                    style={{
                                        minHeight: 50,
                                        width: windowWidth,
                                        alignSelf: 'center',
                                        paddingVertical: 10,
                                        textAlign: 'justify',
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        fontSize: GlobalFontStyles[fontStyle].fontSize,
                                        backgroundColor: GlobalStyles[theme].paperColor,
                                        paddingHorizontal: 10,
                                        color: GlobalStyles[theme].fontColor
                                    }}>
                                    {item.freeText}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        : null
                }
                key={'#'}
                keyExtractor={item => "#" + item._id}
            />
        }

        <PopupModal message={redux?.auth?.message} popupModal={popupModal} />

    </View>
    )
}

const styles = StyleSheet.create({})