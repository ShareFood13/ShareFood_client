import React, { useEffect, useState, useContext } from 'react'
import { Text, View, Button, Image, StyleSheet } from 'react-native'

import { useDispatch, useSelector } from 'react-redux';

import * as SecureStore from 'expo-secure-store';
import { Context } from "../../context/UserContext";
import { getotherusers } from '../../Redux/actions/others';
import { getMyRecipes, getotherrecipes } from '../../Redux/actions/recipes';
import { getMyMails } from '../../Redux/actions/mymails';
import { getUserInfo } from '../../Redux/actions/auth';
import { getMeals } from '../../Redux/actions/meals';
import { fetchEvents } from '../../Redux/actions/events';
import { getAllShopList } from '../../Redux/actions/shopList';



export default function Wellcome({ navigation }) {
    const { userContext, setUserContext } = useContext(Context)
    const [userId, setUserId] = useState(null)

    const dispatch = useDispatch()
    const redux = useSelector((state) => state)

    useEffect(() => {
        getItem()
    }, [])

    async function getItem() {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    useEffect(() => {
        redux?.auth?.authData?.result?.profile && setUserContext(redux.auth.authData.result.profile)
    }, [redux])

    useEffect(() => {
        (userId && userId !== undefined) && (
            dispatch(getotherusers(userId)),
            dispatch(getotherrecipes()),
            dispatch(getMyMails(userId)),
            dispatch(getUserInfo(userId)),
            dispatch(getMyRecipes(userId)),
            dispatch(getMeals(userId)),
            dispatch(fetchEvents(userId)),
            dispatch(getAllShopList(userId)))

    }, [userId])


    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={{ height: 250, width: 250 }} />
            {/* <Text style={{ fontSize: 24, fontWeight: 'bold' }}>ShareFood</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#30D5C8",
        justifyContent: "center",
        alignItems: "center"
    }
})