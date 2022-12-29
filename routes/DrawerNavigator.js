import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground } from 'react-native';

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

import ContactUs from '../screens/Drawer/ContactUs';
import MyMails from '../screens/Drawer/MyMails';
import Donations from "../screens/Drawer/Donations";
import Share from "../screens/Drawer/Share";
import MyCallendar from '../screens/Drawer/MyCallendar';
import MyFriends from '../screens/Drawer/MyFriends';
import MyMeals from '../screens/Drawer/MyMeals';
import MyProfile from '../screens/Drawer/MyProfile';
import MySettings from '../screens/Drawer/MySettings';
import Conversions from '../screens/Drawer/Conversions';
import LogOut from '../screens/Logs/LogOut'

import HomeScreen from "./FooterNavigator";

import { AntDesign, MaterialIcons, Feather, FontAwesome5, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function MyDrawer() {
    const [user, setUser] = useState(null)
    const userName = user?.result?.name

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        setUser(JSON.parse(await AsyncStorage.getItem('profile')))
    }

    const Drawer = createDrawerNavigator();
    function CustomDrawerContent(props) {
        return (
            <DrawerContentScrollView {...props}
                contentContainerStyle={{ backgroundColor: 'white' }}>
                <ImageBackground
                    source={require('../assets/images/menu-bg.jpeg')}
                    style={{ padding: 20, marginBottom: 10 }}>
                    <Image
                        source={require("../assets/images/user-profile.jpeg")}
                        style={{ height: 90, width: 90, borderRadius: 45, marginBottom: 10 }}
                    />
                </ImageBackground>
                <Text
                    style={{
                        color: 'black',
                        fontSize: 18,
                        // fontFamily: 'Roboto-Medium',
                        // marginTop: 5,
                        marginBottom: 10,
                        marginLeft: 15
                    }}>
                    {userName}
                </Text>
                <DrawerItemList {...props} />
                <DrawerItem label="Help" onPress={() => alert('Link to help')} />
            </DrawerContentScrollView>
        );
    }

    return (
        <Drawer.Navigator
            initialRouteName="Home"

            screenOptions={{

                drawerLabelStyle: { display: "none" },
                headerTitle: 'Share Food',
                headerLeftContainerStyle: { paddingLeft: 10 },
                headerTitleStyle: { paddingLeft: 65 }
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
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Home" component={HomeScreen} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row" }}>
                        <AntDesign
                            name="home"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>Home</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="My Profile" component={MyProfile} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row" }}>
                        <AntDesign
                            name="profile"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>My Profile</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="My Mails" component={MyMails} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row" }}>
                        <Fontisto
                            name="email"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>My Mails</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="My Settings" component={MySettings} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <Feather
                            name="settings"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>My Settings</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="Units Converter" component={Conversions} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <MaterialCommunityIcons
                            name="scale-balance"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>Units Converter</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="My Callendar" component={MyCallendar} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <AntDesign
                            name="calendar"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>My Calendar</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="My Meals" component={MyMeals} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <MaterialIcons
                            name="dinner-dining"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>My Meals</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="My Friends" component={MyFriends} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <FontAwesome5
                            name="user-friends"
                            size={16}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>My Friends</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="Contact Us" component={ContactUs} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <MaterialIcons
                            name="connect-without-contact"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>Contact Us</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="Donate a Meal" component={Donations} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <FontAwesome5
                            name="donate"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>Donate a Meal</Text>
                    </View>
                ),
            }} />
            <Drawer.Screen name="Share" component={Share} options={{
                drawerIcon: ({ focused }) => (
                    <View>
                        <View style={{ borderTopWidth: 1, borderTopColor: "grey", borderStyle: "dotted", width: 300, marginTop: "30%", marginBottom: 20 }} />
                        <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                            <AntDesign
                                name="sharealt"
                                size={20}
                                style={{ color: focused ? "#e32f45" : "#748c94" }} />
                            <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>Share</Text>
                        </View >
                    </View >
                ),
            }} />
            <Drawer.Screen name="LogOut" component={LogOut} options={{
                drawerIcon: ({ focused }) => (
                    <View style={{ justifyContent: "flex-start", alignItems: 'center', flexDirection: "row" }}>
                        <AntDesign
                            name="logout"
                            size={20}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12, marginLeft: 20 }}>Log Out</Text>
                    </View>
                ),
            }} />
        </Drawer.Navigator>
    );
}