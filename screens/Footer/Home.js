//npx pod-install
import React, { useState, useContext, useEffect, useCallback } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Dimensions
} from 'react-native'

import { useIsFocused } from '@react-navigation/native';

import { Entypo, MaterialIcons, Foundation, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';

import { Context } from "../../context/UserContext";
import { getUserInfo, startFollowing } from '../../Redux/actions/auth';
import { getotherusers } from '../../Redux/actions/others';
import { getotherrecipes } from '../../Redux/actions/recipes';
import { getMyMails } from '../../Redux/actions/mymails';

import PopupModal from '../../components/PopupModal';
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';

import GlobalStyles from '../../GlobalStyles';
import BannerFollowers from '../../components/BannerFollowers';
import UserAbout from '../../components/UserAbout';
import UserCarrousel from '../../components/UserCarrousel';


export default function Home({ navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const dispatch = useDispatch()
    const [showPictures, setShowPictures] = useState("grid")
    const windowWidth = Dimensions.get('window').width;
console.log(windowWidth)
    var countRecipe = 0

    const [userId, setUserId] = useState(null)
    const [popupModal, setPopupModal] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [moreHeight, setMoreHeight] = useState(true)
    const [theme, setTheme] = useState("stylesLight")


    const isFocused = useIsFocused();

    const redux = useSelector((state) => state)
    console.log("Home redux", redux?.auth?.authData?.result?._id)
    console.log("Home redux", redux?.auth?.message)

    redux?.recipe?.recipes?.map(recipe => !recipe.isDeleted && countRecipe++)
    // redux?.auth?.authData?.result?.recipesId?.map(recipe => !recipe.isDeleted && countRecipe++)
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
        console.log("userId",userId)
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

    const Header = () => {
        return (<>

            <BannerFollowers
                countRecipe={countRecipe}
                userImage={redux?.auth?.authData?.result?.profile?.profilePicture.base64}
                userContext={userContext}
            />

            {/* OLD BannerFollowers */}
            {/* <View style={{
                flexDirection: "row",
                height: 60,
                width: "100%",
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginVertical: 25,
                backgroundColor: GlobalStyles[theme].background,
                alignContent: 'center',
                position: 'relative',
            }}>
                <Image
                    // source={require("../../assets/images/user-profile.jpeg")}
                    // source={{ uri: userContext?.profilePicture }}
                    source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture.base64 }}
                    style={{ height: 90, width: 90, borderRadius: 45, position: 'absolute', left: 20 }}
                />
                <View style={{ flexDirection: 'row', width: windowWidth - 150, justifyContent: 'space-between', right: 20 }}>
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
            </View> */}

            <UserAbout userContext={userContext} setMoreHeight={setMoreHeight} moreHeight={moreHeight} />

            {/* OLF+D User About */}
            {/* <View style={{
                backgroundColor: GlobalStyles[theme].background,
                marginHorizontal: 10,
                borderRadius: 10,
                marginBottom: 10,
                borderWidth: 0.5,
                borderColor: 'black',
                // paddingVertical: 10
            }}>
                <View style={moreHeight && { maxHeight: 100, overflow: 'hidden' }}>
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
                <TouchableOpacity onPress={() => setMoreHeight(!moreHeight)} style={{ width: "100%", alignContent: 'flex-end' }}>
                    {moreHeight
                        ? <Text style={{ width: "95%", textAlign: 'right' }}>...more</Text>
                        : <Text style={{ width: "95%", textAlign: 'right' }}>...less</Text>}
                </TouchableOpacity>
            </View> */}

            <UserCarrousel otherUsersList={otherUsersList} following={redux?.auth?.authData?.result?.profile?.following} navigation={navigation} userId={userId} />
            
            {/* <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginLeft: 5, marginBottom: 10 }}
            >
                {otherUsersList.map(user => !redux?.auth?.authData?.result?.profile?.following?.includes(user._id) &&
                    <TouchableOpacity onPress={() => openOtherUser(user)} key={user._id}>
                        <View style={{
                            width: 90,
                            height: 150,
                            borderRadius: 10,
                            borderWidth: 0.5,
                            borderColor: 'black',
                            marginHorizontal: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: GlobalStyles[theme].paperColor
                        }}>
                            <Image
                                source={require("../../assets/images/user-profile.jpeg")}
                                // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                                // source={{ uri: userContext?.profilePicture }}
                                style={{ height: 70, width: 70, borderRadius: 35, marginBottom: 5, borderWidth: 0.5, borderColor: 'black' }}
                            />

                            <Text style={{ marginBottom: 5 }}>{user.userName}</Text>

                            <TouchableOpacity
                                onPress={() => startFollowingFn(user._id)}
                                style={{
                                    borderWidth: 0.5,
                                    borderColor: 'black',
                                    borderRadius: 5,
                                    paddingHorizontal: 15,
                                    marginBottom: 5,
                                    backgroundColor: GlobalStyles[theme].lightBlue
                                }}>
                                <Text style={{ fontWeight: '400', }}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView> */}

            <View
                style={{
                    flexDirection: 'row',
                    width: '70%',
                    justifyContent: 'space-around',
                    alignSelf: 'center',
                    height: 30,
                    alignItems: 'flex-start',
                    marginBottom: 10,
                }}
            >
                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: '100%',
                    width: '50%',
                    borderBottomWidth: showPictures === "grid" ? 2 : 0,
                    borderBottomColor: 'black',
                    marginBottom: 10,
                }}>
                    <TouchableOpacity onPress={() => setShowPictures("grid")}>
                        <MaterialIcons name="grid-on" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    justifyContent: 'flex-start',
                    // alignSelf: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '50%',
                    borderBottomWidth: showPictures === "grid" ? 0 : 2,
                    borderBottomColor: 'black',
                    marginBottom: 10,
                }}>
                    <TouchableOpacity onPress={() => setShowPictures("list")}>
                        <Foundation name="list" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>
                </View>
            </View>

        </>)
    }

    return (<>
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

    </>
    )
}

const styles = StyleSheet.create({})

// const Main = () => {
//     const renderItem= (item, index) => {
//       return (
//         <Recipe
//         key={index}
//         recipe={item}>
//       )
//     }
//     return (
//       <FlatList
//         ListHeaderComponent={
//         <>
//           <CoverPhoto src={images[0]} />
//           <Title>Welcome</Title>
//           <Text>Take a look at the list of recipes below:</Text>
//         </>}
//         data={recipes}
//         renderItem={renderItem}
//         ListFooterComponent={
//           <Footer/>
//         }/>
//     );
//   };