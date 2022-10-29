import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";


import { AuthContext } from "./context";

import Home from "./screens/Footer/Home";
import Search from "./screens/Footer/Search";
import NewRecipe from "./screens/Footer/NewRecipe";
import LovedOnes from "./screens/Footer/LovedOnes";
import MyBook from "./screens/Footer/MyBook";

import MyProfile from "./screens/Drawer/MyProfile";
import MySettings from "./screens/Drawer/MySettings";
import MyCallendar from "./screens/Drawer/MyCallendar";
import MyActivities from "./screens/Drawer/MyActivity";
import MyMeals from "./screens/Drawer/MyMeals";
import MyFriends from "./screens/Drawer/MyFriends";
import ContactUs from "./screens/Drawer/ContactUs";
import Donations from "./screens/Drawer/Donations";

import LogOut from "./screens/Logs/LogOut";
import SignIn from "./screens/Logs/SignIn"
import LogIn from "./screens/Logs/LogIn";

import Loading from "./screens/Loading";
import { Text } from "react-native";

const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ title: "Sign In" }}
    />
    <AuthStack.Screen
      name="LogIn"
      component={LogIn}
      options={{ title: "Log In" }}
    />
  </AuthStack.Navigator>
);


const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={Home} />
  </HomeStack.Navigator>
);

const SearchStack = createNativeStackNavigator();
const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="Search" component={Search} />
  </SearchStack.Navigator>
);

// const ProfileStack = createNativeStackNavigator();
// const ProfileStackScreen = () => (
//   <ProfileStack.Navigator>
//     <ProfileStack.Screen name="MyProfile" component={MyProfile} />
//   </ProfileStack.Navigator>
// );

const Footer = createBottomTabNavigator();
const FooterScreen = () => (
  <Footer.Navigator>
    < Footer.Screen name="Home" component={HomeStackScreen} options={{
      tabBarIcon: ({ focused }) => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./assets/images/favicon.png')}
            resizeMode='contain'
            style={{
              width: 35,
              height: 35,
              tintColor: focused ? "#e32f45" : "#748c94"
            }} />

          <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>HOME</Text>
        </View>
      ),
    }} />
    <Footer.Screen name="Search" component={Search} options={{
      tabBarIcon: ({ focused }) => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./assets/images/favicon.png')}
            resizeMode='contain'
            style={{
              width: 35,
              height: 35,
              tintColor: focused ? "#e32f45" : "#748c94"
            }} />

          <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>SEARCH</Text>
        </View>
      ),
    }} />
    <Footer.Screen name="NewRecipe" component={NewRecipe} options={{
      tabBarIcon: ({ focused }) => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./assets/images/favicon.png')}
            resizeMode='contain'
            style={{
              width: 35,
              height: 35,
              tintColor: focused ? "#e32f45" : "#748c94"
            }} />

          <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>NEW RECIPE</Text>
        </View>
      ),
      title: 'New Recipe'
    }} />
    <Footer.Screen name="LovedOnes" component={LovedOnes} options={{
      tabBarIcon: ({ focused }) => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./assets/images/favicon.png')}
            resizeMode='contain'
            style={{
              width: 35,
              height: 35,
              tintColor: focused ? "#e32f45" : "#748c94"
            }} />

          <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>LOVED ONES</Text>
        </View>
      ),
      title: 'Loved Ones'
    }} />
    <Footer.Screen name="MyBook" component={MyBook} options={{
      tabBarIcon: ({ focused }) => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./assets/images/favicon.png')}
            resizeMode='contain'
            style={{
              width: 35,
              height: 35,
              tintColor: focused ? "#e32f45" : "#748c94"
            }} />

          <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize: 12 }}>MY BOOK</Text>
        </View>
      ), title: 'My Book'
    }} />
  </Footer.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="MyProfile">
    <Drawer.Screen name="Home" component={FooterScreen} />
    <Drawer.Screen name="MyProfile" component={MyProfile} options={{ title: 'My Profile' }} />
    <Drawer.Screen name="MySettings" component={MySettings} options={{ title: 'My Settings' }} />
    <Drawer.Screen name="MyCallendar" component={MyCallendar} options={{ title: 'My Callendar' }} />
    <Drawer.Screen name="MyActivity" component={MyActivities} options={{ title: 'My Activity' }} />
    <Drawer.Screen name="MyMeals" component={MyMeals} options={{ title: 'My Meals' }} />
    <Drawer.Screen name="MyFriends" component={MyFriends} options={{ title: 'My Friends' }} />
    <Drawer.Screen name="ContactUs" component={ContactUs} options={{ title: 'Contact Us' }} />
    <Drawer.Screen name="DonateMeal" component={Donations} options={{ title: 'Donate a Meal' }} />
    <Drawer.Screen name="LogOut" component={LogOut} options={{ title: 'Log Out' }} />
  </Drawer.Navigator>
);

const RootStack = createNativeStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={DrawerScreen}
        options={{
          animationEnabled: false
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{
          animationEnabled: false
        }}
      />
    )}
  </RootStack.Navigator>
);

export default () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken("asdf");
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken("asdf");
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null);
      }
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
