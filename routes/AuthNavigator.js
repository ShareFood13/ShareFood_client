import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from '../screens/Logs/SignUp';
import LogIn from '../screens/Logs/LogIn';
import ForgetPass from '../screens/Logs/ForgetPass';
import TermsConditions from '../screens/Logs/TermsConditions';

export default function MyAuth() {
    const AuthStack = createNativeStackNavigator();

    return (
        <AuthStack.Navigator
        // screenOptions={{
        //   headerShown: false,
        // }}
        >
            <AuthStack.Screen
                name="LogIn"
                component={LogIn}
                options={{ title: 'Log In' }}
            />
            <AuthStack.Screen
                name="SignUp"
                component={SignUp}
                options={{ title: 'Sign Up' }}
            />
            <AuthStack.Screen
                name="ForgetPass"
                component={ForgetPass}
                options={{ title: 'Forget Password' }}
            />
            <AuthStack.Screen
                name="TermsConditions"
                component={TermsConditions}
                options={{ title: 'Terms & Conditions' }}
            />
        </AuthStack.Navigator>
    );
}
