import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList, RefreshControl, Dimensions } from 'react-native'
import React, { useState, useContext, useEffect, useCallback } from 'react'

import { useIsFocused } from '@react-navigation/native';

import { Entypo, MaterialIcons, Foundation, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';

import { Context } from "../../context/UserContext";
import { getUserInfo, startFollowing } from '../../Redux/actions/auth';
import { getotherusers } from '../../Redux/actions/others';
import { getotherrecipes } from '../../Redux/actions/recipes';

import PopupModal from '../../components/PopupModal';
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';


export default function Home({ navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const dispatch = useDispatch()
    const [showPictures, setShowPictures] = useState("grid")
    const windowWidth = Dimensions.get('window').width;

    var countRecipe = 0

    const [userToken, setUserToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [popupModal, setPopupModal] = useState(false)
    const [refreshing, setRefreshing] = useState(false)



    const isFocused = useIsFocused();

    const redux = useSelector((state) => state)
    // console.log("Home redux user", redux?.auth?.authData?.result?.profile)
    // console.log("Home redux user", redux)

    redux?.auth?.authData?.result?.recipesId?.map(recipe => !recipe.isDeleted && countRecipe++)

    // redux?.auth?.authData?.result?.recipesId?.map(recipe => !recipe.isDeleted && console.log(recipe.recipePicture[0]))

    useEffect(() => {
        if (redux?.auth?.message) {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                onRefresh()
            }, 2500)
        }
    }, [redux, isFocused])

    useEffect(() => {
        redux?.auth?.authData?.result?.profile && setUserContext(redux.auth.authData.result.profile)
    }, [redux])

    // console.log("Home redux otherUsers", redux?.other?.otherUsers)
    // console.log("userContext", userContext)

    const otherUsersList = redux?.other?.otherUsers

    useEffect(() => {
        getItem()
    }, [userContext])

    async function getItem() {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    useEffect(() => {
        dispatch(getotherusers(userId))//.then(dispatch(getotherrecipes()))
        dispatch(getotherrecipes())
    }, [userId, isFocused])

    useEffect(() => {
        userId && dispatch(getUserInfo(userId))
    }, [userId, isFocused])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // setMyRecipes(userContext?.result?.recipesId)
        wait(3000).then(() => setRefreshing(false))//.then(() => dispatch(getUserInfo(userId)))
    }, []);

    const openOtherUser = (otherUserID) => {
        console.log(otherUserID)
    }

    const openRecipe = (recipe) => {
        navigation.push('RecipeDetail', { recipeData: recipe })
    }

    const startFollowingFn = (follow_id) => {
        dispatch(startFollowing({ userId, follow_id }))
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                />
            }>
            <View style={{ flexDirection: "row", height: 100, width: "100%", justifyContent: 'space-around', alignItems: 'center', marginTop: 15, backgroundColor: 'white', alignContent: 'center' }}>
                <Image
                    source={require("../../assets/images/user-profile.jpeg")}
                    // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                    // source={{ uri: userContext?.profilePicture }}
                    style={{ height: 90, width: 90, borderRadius: 45 }}
                />
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{countRecipe}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Recipes</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userContext?.followers?.length}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Followers</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userContext?.following?.length}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Following</Text>
                </View>
            </View>

            <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 10, paddingVertical: 10 }}>
                <Text style={{ width: '95%', textAlign: 'justify', alignSelf: 'center', marginBottom: 5 }}>
                    {userContext?.personalDescription}
                </Text>
                {userContext?.socialMediaHandles?.facebook &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="facebook" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.facebook}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.instagram &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="instagram" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.instagram}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.pinterest &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <Entypo name="pinterest" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.pinterest}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.tiktok &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <FontAwesome5 name="tiktok" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.tiktok}</Text>
                    </View>
                }
                {userContext?.socialMediaHandles?.blog &&
                    <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                        <FontAwesome5 name="blogger" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                        <Text>{userContext?.socialMediaHandles?.blog}</Text>
                    </View>
                }
            </View>

            {/* {otherUsersList.map(user => <Text key={user._id}>{user.userName}</Text>)} */}
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {otherUsersList.map(user => !redux?.auth?.authData?.result?.profile?.following?.includes(user._id) &&
                    <TouchableOpacity onPress={() => openOtherUser(user._id)} key={user._id}>
                        <View style={{ width: 90, height: 150, borderRadius: 10, borderWidth: 1, borderColor: 'black', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                            <Image
                                source={require("../../assets/images/user-profile.jpeg")}
                                // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                                // source={{ uri: userContext?.profilePicture }}
                                style={{ height: 70, width: 70, borderRadius: 35, marginBottom: 5, borderWidth: 0.5, borderColor: 'black' }}
                            />
                            <Text style={{ marginBottom: 5 }}>{user.userName}</Text>
                            <TouchableOpacity onPress={() => startFollowingFn(user._id)} style={{ borderWidth: 1, borderColor: 'black', paddingHorizontal: 7, marginBottom: 5, backgroundColor: 'cyan' }}>
                                <Text style={{ fontWeight: '500' }}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-around', alignSelf: 'center', height: 40, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'black', marginBottom: 15 }}>
                <TouchableOpacity onPress={() => setShowPictures("grid")}>
                    <MaterialIcons name="grid-on" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPictures("list")}>
                    <Foundation name="list" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                </TouchableOpacity>

            </View>

            {showPictures === "grid" ?
                <FlatList
                    data={redux?.auth?.authData?.result?.recipesId}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    renderItem={({ item }) =>
                        (!item?.isDeleted) ?
                            <TouchableOpacity onPress={() => openRecipe(item)}>
                                <View style={{ width: windowWidth / 3, height: windowWidth / 3, borderWidth: 0.2, borderColor: 'black' }}>
                                    <Image source={{ uri: item?.recipePicture[0]?.base64 }} style={{ width: windowWidth / 3, height: windowWidth / 3 }} />
                                </View>
                            </TouchableOpacity>
                            : null
                    }
                    key={'_'}
                    keyExtractor={item => "_" + item._id}
                /> :
                <FlatList
                    data={redux?.auth?.authData?.result?.recipesId}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) =>
                        (!item?.isDeleted) ?
                            <TouchableOpacity onPress={() => openRecipe(item)}>
                                <View style={{ width: windowWidth, borderWidth: 1, borderColor: 'black' }}>
                                    <Image source={{ uri: item?.recipePicture[0]?.base64 }} style={{ width: windowWidth, height: windowWidth * 3 / 4 }} />
                                    <Text style={{ minHeight: 50, width: windowWidth * 0.9, alignSelf: 'center', paddingVertical: 10, textAlign: 'justify' }}>{item.freeText}</Text>
                                </View>
                            </TouchableOpacity>
                            : null
                    }
                    key={'#'}
                    keyExtractor={item => "#" + item._id}
                />
            }

            <PopupModal message={redux?.auth?.message} popupModal={popupModal} />

        </ScrollView >
    )
}

const styles = StyleSheet.create({})