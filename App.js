import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Wellcome from "./screens/Wellcome"

import SignUp from "./screens/Logs/SignUp"
import LogIn from "./screens/Logs/LogIn";
import Home from './screens/Footer/Home';
import RecipeDetail from "./screens/pages/RecipeDetail.js"
import ShowShopList from "./screens/pages/ShopList2"
import ShowEventDetail from "./screens/pages/ShowEventDetail"


import MyDrawer from './routes/DrawerNavigator';

import { AuthContext } from "./context";

import { Provider } from 'react-redux';
import { legacy_createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from "./Redux/reducers"

import AsyncStorage from '@react-native-async-storage/async-storage';
import decode from "jwt-decode"

import ForgetPass from './screens/Logs/ForgetPass';
import TermsConditions from './screens/Logs/TermsConditions';


const store = legacy_createStore(reducers, compose(applyMiddleware(thunk)))

// console.log(store.getState());

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
      options={{ title: "Log In" }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUp}
      options={{ title: "SignUp " }}
    />
    <AuthStack.Screen
      name="ForgetPass"
      component={ForgetPass}
      options={{ title: "SignUp " }}
    />
    <AuthStack.Screen
      name="TermsConditions"
      component={TermsConditions}
      options={{ title: "SignUp " }}
    />
    <AuthStack.Screen
      name="RecipeDetail"
      component={RecipeDetail}
      options={{ title: "RecipeDetail " }}
    />
    <AuthStack.Screen
      name="ShowEventDetail"
      component={ShowEventDetail}
      options={{ title: "ShowEventDetail " }}
    />
    <AuthStack.Screen
      name="ShowShopList"
      component={ShowShopList}
      options={{ title: "Shop List " }}
    />
    <AuthStack.Screen
      name="Home3"
      component={MyDrawer}
      options={{ title: "SignUp " }}
    />
  </AuthStack.Navigator>
);
////////////////////////////

// const NewRecipe = createNativeStackNavigator();
// const NewRecipeScreen = () => (
//   <NewRecipe.Navigator>
//     <NewRecipe.Screen name="NewRecipe" component={NewRecipe} />
//   </NewRecipe.Navigator>
// );

////////////////////////from app copy 2

const RootStack = createNativeStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none"
    screenOptions={{
      headerShown: false,
    }}>
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={MyDrawer}
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

export default function App() {

  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  // const authContext = React.useMemo(() => {
  //   return {
  //     logIn: () => {
  //       setIsLoading(false);
  //       setUserToken("asdf");
  //     },
  //     signUp: () => {
  //       setIsLoading(false);
  //       setUserToken("asdf");
  //     },
  //     signOut: () => {
  //       setIsLoading(false);
  //       setUserToken(null);
  //     }
  //   };
  // }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    async () => { setUserToken(JSON.parse(await AsyncStorage.getItem('profile'))) }
  }, [])

  if (isLoading) {
    return <Wellcome />;
  }

  // console.log('====================================');
  // console.log("App.js 146 userToken", userToken);
  // console.log('====================================');
  return (
    <Provider store={store}>
      {/* <AuthContext.Provider value={authContext}> */}
      <NavigationContainer>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
      {/* </AuthContext.Provider> */}
    </Provider>
  )
}