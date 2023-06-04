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
    ImageBackground
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';

import ShowOtherUser from '../pages/ShowOtherUser'

import { Context } from "../../context/UserContext";
import Banner from '../../components/Banner';
import { useIsFocused } from '@react-navigation/native';

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

export default function MyFriends({ navigation }) {
    const windowWidth = Dimensions.get('window').width;
    const { userContext, setUserContext } = useContext(Context)
    const dispatch = useDispatch()

    const [refreshing, setRefreshing] = useState(false)
    const [myFriends, setMyFriends] = useState([])
    const isFocused = useIsFocused()
    const redux = useSelector((state) => state)

    const [language, setLanguage] = useState("en")
    const [theme, setTheme] = useState("stylesLight")
    const [fontStyle, setFontStyle] = useState("Montserrat")
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

    const otherUsersList = redux?.other?.otherUsers

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // setMyRecipes(userContext?.result?.recipesId)
        wait(3000).then(() => setRefreshing(false))//.then(() => dispatch(getUserInfo(userId)))
    }, []);

    useEffect(() => {
        var result = []
        otherUsersList.map(user => redux?.auth?.authData?.result?.profile?.following?.includes(user._id) && result.push(user))
        console.log(result)
        setMyFriends(result)
    }, [isFocused])

    const openOtherUser = (userInfo) => {
        navigation.navigate("Main", { screen: "ShowOtherUser", params: { userInfo } })
        // navigation.navigate("ShowOtherUser",{ userInfo })
        // .setOptions({ title: 'Updated!' })
        // navigation.navigate('Main', { screen: 'ShowShopList', params: { recipe: mealToShopList, showType: "meals", mealName: meal.mealName } })

    }

    return (
        <View style={[styles.container, { backgroundColor: GlobalStyles[theme].background }]}>
            {/* <Banner title={trans[language].MY_FRIENDS} /> */}
            {/* {otherUsersList.map(user => redux?.auth?.authData?.result?.profile?.following?.includes(user._id) &&
                <TouchableOpacity onPress={() => openOtherUser(user._id)} key={user._id}>
                    <View style={{ width: windowWidth / 3, height: 150, borderRadius: 10, borderWidth: 1, borderColor: 'black', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Image
                            source={require("../../assets/images/user-profile.jpeg")}
                            // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                            // source={{ uri: userContext?.profilePicture }}
                            style={{ height: 70, width: 70, borderRadius: 35, marginBottom: 5, borderWidth: 0.5, borderColor: 'black' }}
                        />
                        <Text style={{ marginBottom: 5 }}>{user.userName}</Text>
                    </View>
                </TouchableOpacity> */}
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                    />
                }
                data={myFriends}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                initialNumToRender={9}
                maxToRenderPerBatch={9}
                renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => openOtherUser(item)} key={item._id}>
                        <View style={{
                            width: windowWidth / 3 - 10,
                            height: 150,
                            margin: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            borderWidth: 0.5,
                            borderColor: GlobalStyles[theme].borderColor,
                            backgroundColor: GlobalStyles[theme].paperColor,
                        }}>
                            <ImageBackground
                                // source={require('../assets/images/menu-bg.jpeg')}
                                // source={{ uri: redux?.auth?.authData?.result?.profile?.backgroundPicture }}
                                source={{ uri: userContext?.backgroundPicture?.base64 }}
                                style={{ width: '100%', height: 90, justifyContent: 'center', }}
                            >
                                <Image
                                    source={require("../../assets/images/user-profile.jpeg")}
                                    // source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture }}
                                    // source={{ uri: userContext?.profilePicture }}
                                    style={{
                                        height: 65,
                                        width: 65,
                                        borderRadius: 35,
                                        borderWidth: 0.5,
                                        borderColor: GlobalStyles[theme].borderColor,
                                        marginLeft: 5
                                    }}
                                />
                            </ImageBackground>
                            <Text style={{
                                width: '100%',
                                height: 40,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontSize: 16,
                                marginBottom: 5,
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            }}>
                                {item.userName}
                            </Text>
                        </View>
                    </TouchableOpacity>

                }
                key={'_'}
                keyExtractor={item => "_" + item._id}
            />
            {/* )} */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 0
    }
})