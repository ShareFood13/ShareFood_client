import React from 'react';
import { View, Text, Image } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Footer/Home';
import LovedOnes from '../screens/Footer/LovedOnes';
import MyBook from '../screens/Footer/MyBook';
import NewRecipe from '../screens/Footer/NewRecipe';
import Search from '../screens/Footer/Search';
import Feed from '../screens/Footer/Feed'

import RecipeDetail from '../screens/Footer/RecipeDetail';

import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    const dispatch = useDispatch()
    const redux = useSelector((state) => state)
    // console.log("Home redux", redux?.auth?.authData?.result?.profile?.profilePicture)


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60,
                    // height: 80,
                    headerShown: false,
                },
                headerLeftLabelVisibler: false,
            }}>
            <Tab.Screen
                name="Home1"
                component={Home}
                options={{
                    //Home2
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {/* <AntDesign
                                name="home"
                                size={40}
                                style={{ color: focused ? '#e32f45' : '#748c94' }}
                            /> */}
                            <Image
                                // source={require("../assets/images/user-profile.jpeg")}
                                source={{ uri: redux?.auth?.authData?.result?.profile?.profilePicture.base64 }}
                                // source={{ uri: userContext?.profilePicture }}
                                style={{ height: 40, width: 40, borderRadius: 45 }}

                            />
                            {/* <Text
                                style={{
                                    color: focused ? '#e32f45' : '#748c94',
                                    fontSize: 12,
                                }}>
                                HOME
                            </Text> */}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign
                                name="search1"
                                size={40}
                                style={{ color: focused ? '#e32f45' : '#748c94' }}
                            />
                            {/* <Text
                                style={{
                                    color: focused ? '#e32f45' : '#748c94',
                                    fontSize: 12,
                                }}>
                                SEARCH
                            </Text> */}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="NewRecipe"
                component={NewRecipe}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: 15, backgroundColor: 'white', borderRadius: 50 }}>
                            {focused ? (
                                <AntDesign name="pluscircle" size={55} color="#e32f45" />
                            ) : (
                                <AntDesign name="pluscircleo" size={55} color="#748c94" />
                            )}
                            {/* <Text
                                style={{
                                    color: focused ? '#e32f45' : '#748c94',
                                    fontSize: 12,
                                }}>
                                NEW RECIPE
                            </Text> */}
                        </View>
                    ),
                    // title: 'New Recipe'
                }}
            />
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{
                    //Home2
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign
                                name="home"
                                size={40}
                                style={{ color: focused ? '#e32f45' : '#748c94' }}
                            />
                            {/* <Text
                                style={{
                                    color: focused ? '#e32f45' : '#748c94',
                                    fontSize: 12,
                                }}>
                                Feed
                            </Text> */}
                        </View>
                    ),
                }}
            />
            {/* <Tab.Screen
                name="LovedOnes"
                component={LovedOnes}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {focused ? (
                                <AntDesign name="heart" size={40} color="#e32f45" />
                            ) : (
                                <AntDesign name="hearto" size={40} color="#748c94" />
                            )}
                            <Text
                                style={{
                                    color: focused ? '#e32f45' : '#748c94',
                                    fontSize: 12,
                                }}>
                                LOVED ONES
                            </Text>
                        </View>
                    ),
                }}
            /> */}
            <Tab.Screen
                name="MyBookStackScreen"
                component={MyBookStackScreen}
                // initialParams={{ fromNewRecipe: false }}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialIcons
                                name="menu-book"
                                size={40}
                                style={{ color: focused ? '#e32f45' : '#748c94' }}
                            />
                            {/* <Text
                                style={{
                                    color: focused ? '#e32f45' : '#748c94',
                                    fontSize: 12,
                                }}>
                                MY BOOK
                            </Text> */}
                        </View>
                    ),
                    title: 'My Book',
                }}
            />
        </Tab.Navigator>
    );
}

const MyBookStack = createNativeStackNavigator();
const MyBookStackScreen = () => (
    <MyBookStack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
        <MyBookStack.Screen
            name="MyBook"
            component={MyBook}
            initialParams={{ fromNewRecipe: false }}
            options={{
                // headerTitleAlign: "center",
                // headerTitle: 'test',
                // headerShown: true,
                // title: 'My Book',
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons
                            name="menu-book"
                            size={40}
                            style={{ color: focused ? '#e32f45' : '#748c94' }}
                        />
                        <Text
                            style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                            MY BOOK
                        </Text>
                    </View>
                ),
            }}
        />
        <MyBookStack.Screen
            name="RecipeDetail"
            component={RecipeDetail}
            options={{ title: 'RecipeDetail ' }}
        />
    </MyBookStack.Navigator>
);