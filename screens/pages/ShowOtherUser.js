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


import { Context } from "../../context/UserContext";
import { startFollowing } from '../../Redux/actions/auth';

const ShowOtherUser = ({ navigation, route }) => {
    const { userInfo } = route.params
    const { userContext, setUserContext } = useContext(Context)
    const [userId, setUserId] = useState()
    const dispatch = useDispatch()


    const [showPictures, setShowPictures] = useState("grid")
    const [moreHeight, setMoreHeight] = useState(true)

    var countRecipe = 0

    const redux = useSelector((state) => state)
    userInfo.recipesId?.map(recipe => !recipe.isDeleted && countRecipe++)

    useEffect(() => {
        getItem()
    }, [userContext])

    async function getItem() {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    const startFollowingFn = (follow_id) => {
        dispatch(startFollowing({ userId, follow_id }))
        navigation.navigate("Home")
    }

    const Header = () => {
        return (<SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center' }}>
            {!userContext.following.includes(userInfo._id) &&
                <TouchableOpacity onPress={() => startFollowingFn(userInfo._id)} style={{ height: 30, borderWidth: 1, borderColor: 'black', paddingHorizontal: 7, backgroundColor: 'cyan' }}>
                    <Text style={{ height: '100%', fontSize: 18, fontWeight: '500', textAlign: 'center', textAlignVertical: 'center' }}>Start Following</Text>
                </TouchableOpacity>}
            <Banner title={userInfo.userName} />

            <View style={{ flexDirection: "row", height: 100, width: "100%", justifyContent: 'space-around', alignItems: 'center', marginTop: 0, backgroundColor: 'white', alignContent: 'center' }}>
                <Image
                    source={require("../../assets/images/user-profile.jpeg")}
                    // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                    // source={{ uri: userInfo?.profile?.profilePicture }}
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
            </View>

            <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 10, paddingVertical: 10 }}>
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
            </View>

            <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-around', alignSelf: 'center', height: 40, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'black', marginBottom: 15 }}>
                <TouchableOpacity onPress={() => setShowPictures("grid")}>
                    <MaterialIcons name="grid-on" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPictures("list")}>
                    <Foundation name="list" size={24} color="black" style={{ width: 40, textAlign: 'center' }} />
                </TouchableOpacity>

            </View>

        </SafeAreaView>)
    }

    return (

        <View style={{ flex: 1, marginTop: 50 }}>
            {showPictures === "grid" ?
                <FlatList
                    ListHeaderComponent={<Header />}
                    data={userInfo?.recipesId}
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

        </View>
    )
}

export default ShowOtherUser

const styles = StyleSheet.create({

})