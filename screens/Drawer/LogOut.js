import React, { useEffect } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

import { AuthContext } from "../../context";

import { LOGOUT } from "../../Redux/constants/constantsTypes.js"

import { useDispatch } from 'react-redux';


export default function LogOut({ navigation }) {
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch({ type: LOGOUT })
    //     navigation.navigate('LogIn')

    // }, [])


    return (
        <View>
            <Text>Log Out</Text>
        </View>
    );
};