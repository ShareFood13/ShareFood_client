import React from 'react';
import { Button, View, Text, Image, ImageBackground } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarHeightCallbackContext, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Home from "./screens/Footer/Home";
import Search from "./screens/Footer/Search";
import NewRecipe from "./screens/Footer/NewRecipe";
import LovedOnes from "./screens/Footer/LovedOnes";
import MyBook from "./screens/Footer/MyBook";

import MyProfile from "./screens/Drawer/MyProfile";
import MySettings from "./screens/Drawer/MySettings";
import MyCallendar from "./screens/Drawer/MyCallendar";
import Share from "./screens/Drawer/Share";
import MyMeals from "./screens/Drawer/MyMeals";
import MyFriends from "./screens/Drawer/MyFriends";
import ContactUs from "./screens/Drawer/ContactUs";
import Donations from "./screens/Drawer/Donations";

import LogOut from "./screens/Logs/LogOut";
import SignIn from "./screens/Logs/SignIn"
import LogIn from "./screens/Logs/LogIn";

import { AntDesign, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

const userName = "Shaul Chaim Tzyon"

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={Home} />
  </HomeStack.Navigator>
);

const Tab = createBottomTabNavigator();
function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          headerShown: false,
        }
      }}>
      < Tab.Screen name="Home2" component={Home} options={{
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}
      contentContainerStyle={{ backgroundColor: 'white' }}>
      <ImageBackground
        source={require('./assets/images/menu-bg.jpeg')}
        style={{ padding: 20, marginBottom: 10 }}>
        <Image
          source={require("./assets/images/user-profile.jpeg")}
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

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"

      screenOptions={{

        drawerLabelStyle: { display: "none" }
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
      <Drawer.Screen name="MyProfile" component={MyProfile} options={{
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
      <Drawer.Screen name="MySettings" component={MySettings} options={{
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
      <Drawer.Screen name="MyCallendar" component={MyCallendar} options={{
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
      <Drawer.Screen name="MyMeals" component={MyMeals} options={{
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
      <Drawer.Screen name="MyFriends" component={MyFriends} options={{
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
      <Drawer.Screen name="ContactUs" component={ContactUs} options={{
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
      <Drawer.Screen name="DonateMeal" component={Donations} options={{
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
export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  )
}