import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, Dimensions } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

import ContactUs from '../screens/Drawer/ContactUs';
import MyMails from '../screens/Drawer/MyMails';
import Donations from '../screens/Drawer/Donations';
import Share from '../screens/Drawer/Share';
import MyCallendar from '../screens/Drawer/MyCallendar';
import MyFriends from '../screens/Drawer/MyFriends';
import MyMeals from '../screens/Drawer/MyMeals';
import MyProfile from '../screens/Drawer/MyProfile';
import MySettings from '../screens/Drawer/MySettings';
import Conversions from '../screens/Drawer/Conversions';
import LogOut from '../screens/Drawer/LogOut';
import Help from '../screens/Drawer/Help';

import MealDetail from '../screens/Drawer/MealDetail';
import EventDetail from '../screens/Drawer/ShowEventDetail';

import HomeScreen from './FooterNavigator';

import { Context } from "../context/UserContext";

// import Share2 from "react-native-share"

import {
    AntDesign,
    MaterialIcons,
    Feather,
    FontAwesome5,
    MaterialCommunityIcons,
    Fontisto,
    Entypo,
    FontAwesome
} from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_STATE } from "../Redux/constants/constantsTypes.js"
import { getUserInfo } from '../Redux/actions/auth';
import { useIsFocused } from '@react-navigation/native';
import MyShopLists from '../screens/Drawer/MyShopLists';

const windowWidth = Dimensions.get('window').width;

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
import trans from '../Language'
import GlobalStyles from '../GlobalStyles';

export default function MyDrawer({ navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const [userData, setUserData] = useState()
    const [mailsQuantity, setMailsQuantity] = useState(0)
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const redux = useSelector(state => state)
    // console.log(redux?.auth?.authData?.result?.profile?.profilePicture.base64)
    // console.log(redux?.auth?.authData?.result?.profile?.backgroundPicture.base64)

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

    useEffect(() => {
        var mailsQty = 0
        redux?.myMail?.myMails?.map(mail => !mail.isOpen && mailsQty++)
        setMailsQuantity(mailsQty)
    }, [redux?.myMail?.myMails?.length])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserData(JSON.parse(await SecureStore.getItemAsync('storageData')))
    }

    useEffect(() => {
        (userData && userData?.userId !== undefined) && dispatch(getUserInfo(userData?.userId))
    }, [userData])

    const Drawer = createDrawerNavigator();
    function CustomDrawerContent(props) {
        return (
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{
                    backgroundColor: GlobalStyles[theme].paperColor,
                    borderRightColor: GlobalStyles[theme].borderColor,
                    borderRightWidth: 2
                }}>
                <ImageBackground
                    // source={require('../assets/images/menu-bg.jpeg')}
                    source={{ uri: redux?.auth?.authData?.result?.profile?.backgroundPicture.base64 }}
                    // source={{ uri: userContext?.backgroundPicture?.base64 }}
                    style={{ padding: 20, marginBottom: 10 }}
                >
                    <Image
                        // source={require("../assets/images/user-profile.jpeg")}
                        source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture.base64 }}
                        // source={{ uri: userContext?.profilePicture?.base64 }}
                        style={{ height: 90, width: 90, borderRadius: 45, marginBottom: 10 }}
                    />
                </ImageBackground>
                <Text
                    style={{
                        fontSize: 18,
                        marginBottom: 10,
                        marginLeft: 15,
                        color: GlobalStyles[theme].fontColor,
                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                    }}>
                    {/* {userData?.userName}, ({userData?.userUserName}) */}
                    {userContext?.name}, ({userContext?.userName})
                </Text>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        );
    }

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
                drawerLabelStyle: { display: 'none' },
                headerTitle: 'Share Food',
                // headerLeftContainerStyle: { paddingLeft: 10 },
                headerTitleStyle: {fontSize: 25 },
                headerTitleAlign: 'center'

                // headerStatusBarHeight: 100,
                // headerShown: false,
                // drawerActiveBackgroundColor: '#aa18ea',
                // drawerActiveTintColor: '#fff',
                // drawerInactiveTintColor: '#333',
                // drawerLabelStyle: {
                //   marginLeft: -25,
                // fontFamily: 'Roboto-Medium',
                // fontSize: 15,
                // }
            }}
            useLegacyImplementation
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <AntDesign
                                name="home"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].HOME}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="My Profile"
                component={MyProfile}
                options={{
                    headerTitle: trans[language].MY_PROFILE,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <AntDesign
                                name="profile"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].MY_PROFILE}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="My Mails"
                component={MyMails}
                options={{
                    headerTitle: trans[language].MY_MAILS,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <Fontisto
                                name="email"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].MY_MAILS}
                            </Text>
                            <Text style={{
                                borderColor: 'red',
                                borderWidth: 1,
                                borderRadius: 20,
                                backgroundColor: 'red',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 10,
                                width: 20,
                                height: 20,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                marginLeft: 5,
                                marginBottom: 10,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            }}>
                                {mailsQuantity}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="My Settings"
                component={MySettings}
                options={{
                    headerTitle: trans[language].MY_SETTINGS,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <Feather
                                name="settings"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].MY_SETTINGS}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Units Converter"
                component={Conversions}
                options={{
                    headerTitle: trans[language].UNITS_CONVERTOR,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <MaterialCommunityIcons
                                name="scale-balance"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].UNITS_CONVERTOR}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="My Callendar"
                component={MyCallendarStackScreen}
                options={{
                    headerTitle: trans[language].MY_CALENDAR,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <AntDesign
                                name="calendar"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].MY_CALENDAR}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="My Meals"
                component={MyMealsStackScreen}
                options={{
                    headerTitle: trans[language].MY_MEALS,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <MaterialIcons
                                name="dinner-dining"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].MY_MEALS}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="My Shop Lists"
                component={MyShopLists}
                options={{
                    headerTitle: trans[language].MY_SHOP_LIST,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <FontAwesome
                                name="list"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].MY_SHOP_LIST}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="My Friends"
                component={MyFriends}
                options={{
                    headerTitle: trans[language].MY_FRIENDS,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <FontAwesome5
                                name="user-friends"
                                size={16}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].MY_FRIENDS}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Contact Us"
                component={ContactUs}
                options={{
                    headerTitle: trans[language].CONTACT_US,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <MaterialIcons
                                name="connect-without-contact"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].CONTACT_US}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Donate a Meal"
                component={Donations}
                options={{
                    headerTitle: trans[language].DONATE_A_MEAL,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <FontAwesome5
                                name="donate"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].DONATE_A_MEAL}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Share"
                component={Share}
                // listeners={async ({ navigation }) => {

                //     const shareOptions = {
                //         message: "test message",
                //         // url: need to be on base64,
                //         // urls: [the same]
                //     }

                //     try {

                //         const ShareResponse = await Share2.open(shareOptions)
                //         console.log(JSON.stringify(ShareResponse))
                //     } catch (error) {

                //         console.log("Error --> ", error)
                //     }
                // }}
                options={{
                    headerTitle: trans[language].TELL_YOUR_FRIENS,
                    drawerIcon: ({ focused }) => (
                        <View>
                            <View
                                style={{
                                    borderTopWidth: 1,
                                    borderTopColor: 'grey',
                                    borderStyle: 'dotted',
                                    width: 300,
                                    // marginTop: '10%',
                                    marginBottom: 20,
                                }}
                            />
                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                }}>
                                <AntDesign
                                    name="sharealt"
                                    size={20}
                                    style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                                />
                                <Text
                                    style={{
                                        color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        fontSize: 12,
                                        marginLeft: 20,
                                    }}>
                                    {trans[language].TELL_YOUR_FRIENS}
                                </Text>
                            </View>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="LogOut"
                component={LogOut}
                listeners={async ({ navigation }) => {

                    try {

                        await SecureStore.deleteItemAsync('storageData')
                    } catch (error) {

                        console.log(error)
                    }

                    setUserContext(null)

                    dispatch({ type: CLEAR_STATE, navigation })

                    navigation.navigate('Auth', { screen: 'LogIn' })
                }}
                options={{
                    headerTitle: trans[language].LOG_OUT,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <AntDesign
                                name="logout"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].LOG_OUT}
                            </Text>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Help"
                component={Help}
                options={{
                    headerTitle: trans[language].HELP,
                    drawerIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                            <Entypo
                                name="help"
                                size={20}
                                style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                            />
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                    fontSize: 12,
                                    marginLeft: 20,
                                }}>
                                {trans[language].HELP}
                            </Text>
                        </View>
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}

const MyMealsStack = createNativeStackNavigator();
const MyMealsStackScreen = () => (
    <MyMealsStack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
        <MyMealsStack.Screen
            name="MyMeals"
            component={MyMeals}
            options={{
                drawerIcon: ({ focused }) => (
                    <View
                        style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <MaterialIcons
                            name="dinner-dining"
                            size={20}
                            style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                        />
                        <Text
                            style={{
                                color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                fontSize: 12,
                                marginLeft: 20,
                            }}>
                            {trans[language].MY_MEALS}My Meals
                        </Text>
                    </View>
                ),
            }}
        />
        <MyMealsStack.Screen
            name="MealDetail"
            component={MealDetail}
            options={{ title: 'MealDetail ' }}
        />
    </MyMealsStack.Navigator>
);

const MyCallendarStack = createNativeStackNavigator();
const MyCallendarStackScreen = () => (
    <MyCallendarStack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
        <MyCallendarStack.Screen
            name="MyCallendar"
            component={MyCallendar}
            options={{
                drawerIcon: ({ focused }) => (
                    <View
                        style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <AntDesign
                            name="calendar"
                            size={20}
                            style={{ color: focused ? '#e32f45' : GlobalStyles[theme].fontColor }}
                        />
                        <Text
                            style={{
                                color: focused ? '#e32f45' : GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                fontSize: 12,
                                marginLeft: 20,
                            }}>
                            {trans[language].MY_CALENDAR}My Calendar
                        </Text>
                    </View>
                ),
            }}
        />
        <MyCallendarStack.Screen
            name="EventDetail"
            component={EventDetail}
            options={{ title: 'Event Detail ' }}
        />
    </MyCallendarStack.Navigator>
);
