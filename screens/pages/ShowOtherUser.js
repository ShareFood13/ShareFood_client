import React, { useEffect, useState, useCallback, useContext } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Dimensions,
    ImageBackground,
    SafeAreaView
} from 'react-native'

import {
    Entypo,
    MaterialIcons,
    Foundation,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome5
} from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import Banner from '../../components/Banner';


import { Context } from "../../context/UserContext";
import { startFollowing, stopFollowing } from '../../Redux/actions/auth';
import GlobalStyles from '../../GlobalStyles';
import BannerFollowers from '../../components/BannerFollowers';
import UserAbout from '../../components/UserAbout';
import { useIsFocused } from '@react-navigation/native';


import { useFonts } from 'expo-font';
// import StylesText from "../../components/StylesText"
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';
import PopupModal from '../../components/PopupModal';
import GridList from '../../components/GridList';
import trans from '../../Language';

var theme = ""
var language = ""
var fontStyle = ""

const ShowOtherUser = ({ navigation, route }) => {
    var countRecipe = 0
    const { userInfo } = route.params
    navigation.setOptions({ title: userInfo.userName }) // TODO causa um warning Cannot update a component while rendering a diff comp
    const isFocused = useIsFocused();
    const dispatch = useDispatch()

    const [userId, setUserId] = useState()
    const [popupModal, setPopupModal] = useState(false)
    // const [language, setLanguage] = useState("en")
    // const [theme, setTheme] = useState("stylesLight")
    const [showPictures, setShowPictures] = useState("grid")
    const [moreHeight, setMoreHeight] = useState(true)

    const redux = useSelector((state) => state)
    userInfo.recipesId?.map(recipe => !recipe.isDeleted && countRecipe++)
    
    // console.log("ShowOtherUsers", userInfo)
    // console.log("ShowOtherUser redux", redux?.auth?.authData?.message)
    
    const { userContext, setUserContext } = useContext(Context)
    useEffect(() => {
        if (userContext) {
            theme = userContext?.settings?.theme
            language = userContext?.settings?.language?.value
            fontStyle = userContext?.settings?.fontStyle
        }
    }, [userContext])


    useEffect(() => {
        if (redux?.auth?.message !== "") {
            setPopupModal(true)
            setTimeout(async () => {
                dispatch({ type: CLEAR_MSG })
                setPopupModal(false)
                navigation.navigate("Home")
            }, 2500)
        }
    }, [redux, isFocused])

    useEffect(() => {
        // getItem()
        setUserId(redux.auth.authData.result._id)
    }, [redux])

    // async function getItem() {
    //     setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    // }

    const startFollowingFn = (follow_id) => {
        dispatch(startFollowing({ userId, follow_id }))
    }

    const stopFollowingFn = (follow_id) => {
        dispatch(stopFollowing({ userId, follow_id }))
    }

    const Header = () => {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center', backgroundColor: GlobalStyles[theme]?.background }}>

                {!userContext.profile.following.includes(userInfo._id)
                    ? <TouchableOpacity
                        onPress={() => startFollowingFn(userInfo._id)}
                        style={{
                            height: 30,
                            borderWidth: 1,
                            borderColor: 'black',
                            paddingHorizontal: 7,
                            backgroundColor: GlobalStyles[theme]?.lightBlue,
                            // marginBottom: 20
                        }}>
                        <Text style={{ 
                              height: '100%', 
                              fontSize: 18, 
                              textAlign: 'center', 
                              textAlignVertical: 'center' ,
                              color: GlobalStyles[theme]?.fontColor,
                            }}>
                                {trans[language]?.START_FOLLOWING}
                            </Text>
                    </TouchableOpacity>
                    : <TouchableOpacity
                        onPress={() => stopFollowingFn(userInfo._id)}
                        style={{
                            height: 40,
                            borderBottomWidth: 0.5,
                            borderColor: GlobalStyles[theme]?.borderColor,
                            paddingHorizontal: 7,
                            backgroundColor: GlobalStyles[theme]?.lightBlue,
                            // marginBottom: 20
                        }}>
                        <Text style={{ 
                            height: '100%', 
                            fontSize: 18, 
                            textAlign: 'center', 
                            textAlignVertical: 'center' ,
                            color: GlobalStyles[theme]?.fontColor,
                            }}>{trans[language]?.STOP_FOLLOWING}</Text>
                    </TouchableOpacity>
                }

                {/* <Banner title={userInfo.userName} /> */}

                {/* <View style={{
                    height: 40,
                    left: 100,
                    position: 'absolute',
                    top: 35,
                    zIndex: 100,
                    margin: 10,
                    // justifyContent: 'center',
                    // alignItems: 'flex-start',
                    // alignSelf: 'center',
                    // backgroundColor: "red"
                }}> */}
                {/* <StylesText title={userInfo.userName} style00={{ fontFamily: "Miniver_400Regular" }} /> */}
                {/* <Text style={{ fontSize: 30, fontFamily: 'BalsamiqSans_400Regular', letterSpacing: 1.3 }}>{userInfo.userName}</Text> */}
                {/* </View> */}

                <BannerFollowers
                    countRecipe={countRecipe}
                    userInfo={userInfo}
                // userImage={redux?.auth?.authData?.result?.profile?.profilePicture.base64}
                // userContext={userContext.profile}
                />

                {/* OLD BannerFollowers */}
                {/* <View style={{ 
                flexDirection: "row", 
                height: 100, 
                width: "100%", 
                justifyContent: 'space-around', 
                alignItems: 'center', 
                marginTop: 0, 
                backgroundColor: 'white', 
                alignContent: 'center' 
                }}>
                <Image
                    source={require("../../assets/images/user-profile.jpeg")}
                    // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                    // source={{ uri: userInfo?.profile?.profilePicture.base64 }}
                    style={{ height: 90, width: 90, borderRadius: 45 }}
                />
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{countRecipe}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Recipes</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userInfo?.profile?.followers?.length}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Followers</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userInfo?.profile?.following?.length}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Following</Text>
                </View>
            </View> */}

                <UserAbout userContext={userContext?.profile} setMoreHeight={setMoreHeight} moreHeight={moreHeight} />

                {/* OLD userAbout */}
                {/* <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 10, paddingVertical: 10 }}>
                    <View style={moreHeight && { maxHeight: 100, overflow: 'hidden' }}>
                        <Text style={{ width: '95%', textAlign: 'justify', alignSelf: 'center', marginBottom: 5 }}>
                            {userInfo?.profile?.personalDescription}
                        </Text>

                        {userInfo?.profile?.socialMediaHandles?.facebook &&
                            <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                                <Entypo name="facebook" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                <Text>{userInfo?.profile?.socialMediaHandles?.facebook}</Text>
                            </View>
                        }
                        {userInfo?.profile?.socialMediaHandles?.instagram &&
                            <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                                <Entypo name="instagram" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                <Text>{userInfo?.profile?.socialMediaHandles?.instagram}</Text>
                            </View>
                        }
                        {userInfo?.profile?.socialMediaHandles?.pinterest &&
                            <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                                <Entypo name="pinterest" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                <Text>{userInfo?.profile?.socialMediaHandles?.pinterest}</Text>
                            </View>
                        }
                        {userInfo?.profile?.socialMediaHandles?.tiktok &&
                            <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                                <FontAwesome5 name="tiktok" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                <Text>{userInfo?.profile?.socialMediaHandles?.tiktok}</Text>
                            </View>
                        }
                        {userInfo?.profile?.socialMediaHandles?.blog &&
                            <View style={{ flexDirection: 'row', marginVertical: 5, paddingLeft: 10 }}>
                                <FontAwesome5 name="blogger" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                                <Text>{userInfo?.profile?.socialMediaHandles?.blog}</Text>
                            </View>
                        }
                    </View>
                    <TouchableOpacity onPress={() => setMoreHeight(!moreHeight)} style={{ width: "100%", alignContent: 'flex-end' }}>
                        {moreHeight
                            ? <Text style={{ width: "95%", textAlign: 'right' }}>...more</Text>
                            : <Text style={{ width: "95%", textAlign: 'right' }}>...less</Text>}
                    </TouchableOpacity>
                </View> */}


                <GridList showPictures={showPictures} setShowPictures={setShowPictures} />

                {/* OLD GridList */}
                {/* <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-around', alignSelf: 'center', height: 40, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'black', marginBottom: 15 }}>
                    <TouchableOpacity onPress={() => setShowPictures("grid")}>
                        <MaterialIcons name="grid-on" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowPictures("list")}>
                        <Foundation name="list" size={24} color={GlobalStyles[theme]?.fontColor} style={{ width: 40, textAlign: 'center' }} />
                    </TouchableOpacity>

                </View> */}

            </SafeAreaView>)
    }

    return (

        <View style={{ flex: 1, marginTop: 0 }}>
            {showPictures === "grid" ?
                <FlatList
                    ListHeaderComponent={<Header />}
                    data={userInfo?.recipesId}
                    contentContainerStyle={{backgroundColor: GlobalStyles[theme]?.background}}
                    style={{backgroundColor: GlobalStyles[theme]?.background}}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    initialNumToRender={9}
                    maxToRenderPerBatch={9}
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
                    ListHeaderComponent={<Header />}
                    data={userInfo?.recipesId}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
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

            <PopupModal message={redux?.auth?.authData?.message} popupModal={popupModal} />

        </View>
    )
}

export default ShowOtherUser

const styles = StyleSheet.create({

})