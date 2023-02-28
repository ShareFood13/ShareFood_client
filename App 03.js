import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Wellcome from './screens/pages/Wellcome';
import ShopList2 from './screens/pages/ShopList2'
import LogIn from './screens/Logs/LogIn';
// import Home from './screens/Footer/Home'

import MyAuth from './routes/AuthNavigator';
import MyDrawer from './routes/DrawerNavigator';
// import MyFooter from './routes/FooterNavigator';

import { Provider as UserProvider, } from './context/UserContext'

import { Provider as ReduxProvider } from 'react-redux';
import { legacy_createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from "./Redux/reducers"

import AsyncStorage from '@react-native-async-storage/async-storage';

const store = legacy_createStore(reducers, compose(applyMiddleware(thunk)))

// console.log(store.getState());

const MainStack = createNativeStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <MainStack.Screen
      name="Drawer"
      component={MyDrawer}
      options={{
        animationEnabled: false,
      }}
    />
    {/* <MainStack.Screen
      name="Footer"
      component={MyFooter}
      options={{
        animationEnabled: false,
      }}
    /> */}
    <MainStack.Screen
      name="ShowShopList"
      component={ShopList2}
      options={{
        title: "Shop List ",
        animationEnabled: false,
      }}
    />
    <MainStack.Screen
      name="LogIn"
      component={LogIn}
      options={{
        animationEnabled: false,
      }}
    />
  </MainStack.Navigator>
);

////////////////////////////

const RootStack = createNativeStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator
    headerMode="none"
    screenOptions={{
      headerShown: false,
    }}>
    {!userToken ?
      <RootStack.Screen
        name="Auth"
        component={MyAuth}
        options={{
          animationEnabled: false,
        }}
      />
      :
      <RootStack.Screen
        name="MainStack"
        component={MainStackScreen}
        options={{
          animationEnabled: false,
        }}
      />
    }
  </RootStack.Navigator>
);

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    // setUser(JSON.parse(await AsyncStorage.getItem('profile')))
    setUserToken(JSON.parse(await AsyncStorage.getItem('token')))
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

//user?.token