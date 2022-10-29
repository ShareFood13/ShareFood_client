import React, { useEffect } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

import { AuthContext } from "../../context";

import { LOGOUT } from "../../Redux/constants/constantsTypes.js"

import { useDispatch } from 'react-redux';


export default function LogOut({ navigation }) {
    // const { signOut } = React.useContext(AuthContext);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch({ type: LOGOUT })
        navigation.navigate('LogIn')
    }, [])
    const logOut = () => {
        alert("Todo LogOut")
        // dispatch({ type: LOGOUT })
        // setUser(null)
        // navigation.navigate('LogIn')
    }

    return (
        <View>
            <Text>Log Out</Text>
            {/* <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
            <Button title="Sign Out" onPress={() => logOut()} /> */}
        </View>
    );
};