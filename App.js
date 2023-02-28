// navigation.navigate('Root', {screen: 'Settings',params: {screen: 'Sound',params: {screen: 'Media'}}})

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Wellcome from "./screens/pages/Wellcome"

import SignUp from "./screens/Logs/SignUp"
import LogIn from "./screens/Logs/LogIn";
import RecipeDetail from "./screens/Footer/RecipeDetail"
import ShowShopList from "./screens/pages/ShopList2"
import ShowEventDetail from "./screens/Drawer/ShowEventDetail"
import ForgetPass from './screens/Logs/ForgetPass';
import TermsConditions from './screens/Logs/TermsConditions';
import ShowOtherUser from './screens/pages/ShowOtherUser'

import MyDrawer from './routes/DrawerNavigator';
import MyFooter from './routes/FooterNavigator'

import { Provider as UserProvider } from './context/UserContext'

import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { legacy_createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from "./Redux/reducers"

import * as SecureStore from 'expo-secure-store';

const store = legacy_createStore(reducers, compose(applyMiddleware(thunk)))

// console.log("APP", store.getState());

const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen
      name="LogIn"
      component={LogIn}
      options={{ title: "LogIn" }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUp}
      options={{ title: "SignUp " }}
    />
    <AuthStack.Screen
      name="ForgetPass"
      component={ForgetPass}
      options={{ title: "Forget Password" }}
    />
    <AuthStack.Screen
      name="TermsConditions"
      component={TermsConditions}
      options={{ title: "Terms & Conditions" }}
    />
  </AuthStack.Navigator>
);
////////////////////////////

const MainStack = createNativeStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <MainStack.Screen
      name="MyDrawer"
      component={MyDrawer}
      options={{
        animationEnabled: false
      }}
    />
    <MainStack.Screen
      name="MyFooter"
      component={MyFooter}
      options={{
        animationEnabled: false
      }}
    />
    <MainStack.Screen
      name="ShowShopList"
      component={ShowShopList}
      options={{ title: "Shop List" }}
    />
    <MainStack.Screen
      name="RecipeDetail"
      component={RecipeDetail}
      options={{ title: "Recipe Detail" }}
    />
    <MainStack.Screen
      name="ShowEventDetail"
      component={ShowEventDetail}
      options={{ title: "Show Event Detail" }}
    />
    <MainStack.Screen
      name="ShowOtherUser"
      component={ShowOtherUser}
      options={{ title: "Show Other User" }}
    />
  </MainStack.Navigator>
)
//////////////////

const RootStack = createNativeStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none"
    initialRouteName={userToken}
    screenOptions={{
      headerShown: false,
    }}>
    <RootStack.Screen
      name="Main"
      component={MainStackScreen}
      options={{
        animationEnabled: false
      }}
    />
    <RootStack.Screen
      name="Auth"
      component={AuthStackScreen}
      options={{
        animationEnabled: false
      }}
    />
  </RootStack.Navigator>
);

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const result = JSON.parse(await SecureStore.getItemAsync('storageData')).token
    setUserToken(result ? "Main" : "Auth")
  }

  if (isLoading) {
    return <Wellcome />;
  }

  return (
    <ReduxProvider store={store}>
      <UserProvider>
        <NavigationContainer>
          <RootStackScreen userToken={userToken} />
        </NavigationContainer>
      </UserProvider>
    </ReduxProvider>
  )
}