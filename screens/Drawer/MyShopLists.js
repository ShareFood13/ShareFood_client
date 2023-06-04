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
import GlobalStyles from '../../GlobalStyles';
import { useFonts } from 'expo-font';
import {
    Roboto_400Regular,
    Lato_400Regular,
    Montserrat_400Regular,
    Oswald_400Regular,
    SourceCodePro_400Regular,
    Slabo27px_400Regular,
    Poppins_400Regular,
    Lora_400Regular,
    Rubik_400Regular,
    PTSans_400Regular,
    Karla_400Regular
} from '@expo-google-fonts/dev';
import GlobalFontStyles from '../../GlobalFontStyles';
import trans from '../../Language'

export default function MyShopLists({ navigation }) {
    const dispatch = useDispatch()
    const redux = useSelector((state) => state)
    // console.log("MyShopLists redux.shopList.message", redux.shopList.message)

    const [userId, setUserId] = useState("")
    const [popupModal, setPopupModal] = useState(false)
    const [language, setLanguage] = useState("en")
    const [theme, setTheme] = useState("stylesLight")
    const [fontStyle, setFontStyle] = useState("Montserrat")
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Lato_400Regular,
        Montserrat_400Regular,
        Oswald_400Regular,
        SourceCodePro_400Regular,
        Slabo27px_400Regular,
        Poppins_400Regular,
        Lora_400Regular,
        Rubik_400Regular,
        PTSans_400Regular,
        Karla_400Regular
    })

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
    }

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 2,
                    width: '100%',
                    backgroundColor: GlobalStyles[theme].fontColor,
                    alignSelf: 'center'
                }}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: GlobalStyles[theme].background }]}>

            {/* <Banner title={trans[language].MY_SHOP_LIST} /> */}

            <FlatList
                data={redux.shopList.shopLists}
                showsVerticalScrollIndicator={false}
                style={{ width: '100%', height: "100%"}}
                // ListHeaderComponent={<Header />}
                ItemSeparatorComponent={ItemSeparatorView}
                contentContainerStyle={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}
                renderItem={({ item, index }) =>
                    <TouchableOpacity style={[{
                        flexDirection: 'row',
                        height: 40,
                        width: "100%",
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        borderWidth: 0.5,
                        borderColor: GlobalStyles[theme].borderColor,
                        backgroundColor: GlobalStyles[theme].paperColor,
                        // {index} === 0)&& borderTopLeftRadius:  10,
                        // borderTopRightRadius: ({index} === 0) && 10,
                        // borderBottomLeftRadius:({index} === redux.shopList.shopLists.lenght -1) &&  10,
                        // borderBottomRightRadius: ({index} === redux.shopList.shopLists.lenght -1)  && 10
                    }, (index === 0) &&
                    {
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10
                    },
                    (index === redux.shopList.shopLists.length - 1) &&
                    {
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10
                    }
                    ]}
                        // onPress={() => setChecked(!checked)}>
                        onPress={() => openShopList(item)}>
                        <Text style={{
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {item.shopListName}
                        </Text>
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
        alignItems: 'center',
        padding: 10,

    },
})