import React from 'react'
import { View, Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Footer/Home';
import LovedOnes from '../screens/Footer/LovedOnes';
import MyBook from '../screens/Footer/MyBook';
import NewRecipe from '../screens/Footer/NewRecipe';
import Search from '../screens/Footer/Search';

import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 80,
                    headerShown: false,
                },
                headerLeftLabelVisibler: false,
            }}>
            < Tab.Screen name="Home2" component={Home} options={{ //Home2
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign
                            name="home"
                            size={35}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>HOME</Text>
                    </View>
                ),
            }} />
            <Tab.Screen name="Search" component={Search} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign
                            name="search1"
                            size={35}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>SEARCH</Text>
                    </View>
                ),
            }} />
            <Tab.Screen name="NewRecipe" component={NewRecipe} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {focused ?
                            <AntDesign name="pluscircle" size={35} color="#e32f45" />
                            : <AntDesign name="pluscircleo" size={35} color="#748c94" />
                        }
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>NEW RECIPE</Text>
                    </View>
                ),
                // title: 'New Recipe'
            }} />
            <Tab.Screen name="LovedOnes" component={LovedOnes} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {focused ?
                            <AntDesign name="heart" size={35} color="#e32f45" />
                            : <AntDesign name="hearto" size={35} color="#748c94" />
                        }
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>LOVED ONES</Text>
                    </View>
                ),
            }} />
            <Tab.Screen name="MyBook" component={MyBook} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons
                            name="menu-book"
                            size={35}
                            style={{ color: focused ? "#e32f45" : "#748c94" }} />
                        <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>MY BOOK</Text>
                    </View>
                ), title: 'My Book'
            }} />
        </Tab.Navigator >
    );
}
