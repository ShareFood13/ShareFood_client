import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Pressable,
    Modal,
    ScrollView,
    Image,
    Dimensions,
    Alert,
    FlatList,
} from 'react-native'

import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import Banner from '../../components/Banner';

import PopupModal from '../../components/PopupModal';
import { CLEAR_MSG } from '../../Redux/constants/constantsTypes';


export default function MyShopLists({ navigation }) {
    const dispatch = useDispatch()
    const redux = useSelector((state) => state)
    // console.log("MyShopLists redux.shopList.message", redux.shopList.message)

    const [userId, setUserId] = useState("")
    const [popupModal, setPopupModal] = useState(false)

    useEffect(() => {
        if (redux?.shopList.message !== "") {
            setPopupModal(true)
            setTimeout(() => {
                setPopupModal(false)
                dispatch({ type: CLEAR_MSG })
                navigation.navigate('Home1')
            }, 2500)
        }
    }, [redux])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    const openShopList = (list) => {
        navigation.push('ShowShopList', { openShopList: list })
        // navigation.navigate('Main', { screen: 'ShowShopList', params: { openShopList: list } })
        // navigation.navigate('Main', { screen: 'ShowShopList', params: { openShopList: list } })

    }

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 1,
                    width: '90%',
                    backgroundColor: '#C8C8C8',
                    alignSelf: 'center'
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            {/* <Header /> */}
            <Banner title="My Shop Lists" />
            <FlatList
                data={redux.shopList.shopLists}
                showsVerticalScrollIndicator={false}
                style={{ width: '100%', marginBottom: 120 }}
                // ListHeaderComponent={<Header />}
                ItemSeparatorComponent={ItemSeparatorView}

                renderItem={({ item }) =>
                    <TouchableOpacity style={{ flexDirection: 'row', height: 30, width: "90%", justifyContent: 'center', alignSelf: 'center', alignItems: 'center', backgroundColor: 'white' }}
                        // onPress={() => setChecked(!checked)}>
                        onPress={() => openShopList(item)}>
                        <Text>{item.shopListName}</Text>
                    </TouchableOpacity>}
                keyExtractor={item => item._id}
            // extraData={selectedId}
            // ListFooterComponent={<Footer />}
            />

            <PopupModal message={redux?.shopList?.message} popupModal={popupModal} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})