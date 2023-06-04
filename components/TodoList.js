import React, { useEffect, useState } from 'react'

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

import { EvilIcons, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

import { useIsFocused } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';
import { delShopList, saveShopList, updateShopList } from '../Redux/actions/shopList';
import Banner from './Banner';
import GlobalStyles from '../GlobalStyles';

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
import GlobalFontStyles from '../GlobalFontStyles';
import trans from '../Language'


const TodoList = ({ navigation, answer, openShopListId, title }) => {
    const [shopList, setShopList] = useState({})
    const [newList, setNewList] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [userId, setUserId] = useState("")
    const [toDelete, setToDelete] = useState(false)
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
    const dispatch = useDispatch()

    // const isFocused = useIsFocused();

    useEffect(() => {
        answer?.list?.some(item => item.isDone === true || item.isDone === false)
            ? setNewList(answer.list)
            : setNewList(answer)
    }, [answer])

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        setUserId(JSON.parse(await SecureStore.getItemAsync('storageData')).userId)
    }

    const handleCheck = (_id) => {
        var result = newList.map(item => item._id === _id ? { ...item, isDone: !item.isDone } : { ...item })
        setNewList(result)
    }

    const saveShop = () => {
        setModalVisible(true)
        answer?.list?.some(item => item.isDone === true || item.isDone === false)
            ? setShopList({ shopListName: answer.shopListName, userId: answer.userId, list: newList })
            : setShopList({ list: newList })
    }

    const openDeleteModal = () => {
        setToDelete(true)

        setModalVisible(true)
    }

    const deleteShop = () => {
        setModalVisible(false)
        setToDelete(false)
        dispatch(delShopList(openShopListId))
    }

    const handleOnChange = (name, text) => {
        setShopList({ ...shopList, [name]: text, userId: userId })
    }

    const submitShopList = () => {
        setModalVisible(false)

        answer?.list?.some(item => item.isDone === true || item.isDone === false)
            ? dispatch(updateShopList(openShopListId, shopList))
            : dispatch(saveShopList(shopList))

        navigation.navigate('Home1')
    }

    const Footer = () => {
        return (
            <View style={{
                width: "100%",flexDirection: "column", height: 150, justifyContent: 'space-around', bottom: 0, position: "relative"
            }}>
                <View style={{
                    flexDirection: 'row', width: "100%", justifyContent: 'space-around', alignItems: 'center'
                }}>
                    <TouchableOpacity style={[{
                        width: 170,
                        minHeight: 40,
                        borderRadius: 10,
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        // shadowRadius: 60,
                        // shadowColor: '#F02A4B',
                        // shadowOpacity: 0.3,
                        // shadowOffset: { height: 3, width: 0 },
                        // elevation: 10,
                        // zIndex: 10,
                        // bottom: 50,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderStyle: 'solid',
                        borderWidth: 0.5,
                    }, {
                        borderColor: GlobalStyles[theme].borderColor,
                        backgroundColor: GlobalStyles[theme].yesColor
                    }]}
                        onPress={saveShop}
                    >
                        <Text style={{
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].SAVE_SHOP_LIST}
                        </Text>
                    </TouchableOpacity>
                    {answer?.list?.some(item => item.isDone === true || item.isDone === false) &&
                        <TouchableOpacity style={[{
                            Width: 170,
                            minHeight: 40,
                            borderRadius: 10,
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            // shadowRadius: 60,
                            // shadowColor: '#F02A4B',
                            // shadowOpacity: 0.3,
                            // shadowOffset: { height: 3, width: 0 },
                            // elevation: 10,
                            // zIndex: 10,
                            // bottom: 50,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderStyle: 'solid',
                            borderWidth: 0.5,
                        }, {
                            borderColor: GlobalStyles[theme].borderColor,
                            backgroundColor: GlobalStyles[theme].noColor
                        }]}
                            onPress={openDeleteModal}>
                            <Text style={{
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                                {trans[language].DELETE_SHOP_LIST}
                            </Text>
                        </TouchableOpacity>}
                </View>
                <View style={{width: "100%", alignItems: 'center'}}>
                    <TouchableOpacity style={[{
                        width: 170,
                        minHeight: 40,
                        borderRadius: 10,
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        // shadowRadius: 60,
                        // shadowColor: '#F02A4B',
                        // shadowOpacity: 0.3,
                        // shadowOffset: { height: 3, width: 0 },
                        // elevation: 10,
                        // zIndex: 10,
                        // bottom: 50,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderStyle: 'solid',
                        borderWidth: 0.5,
                    }, {
                        borderColor: GlobalStyles[theme].borderColor,
                        backgroundColor: GlobalStyles[theme].buttonColor
                    }]}
                        onPress={() => navigation.navigate('MyDrawer', { screen: 'Home' })}
                    >
                        <Text style={{
                            color: GlobalStyles[theme].fontColor,
                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                        }}>
                            {trans[language].BACK_HOME}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
    // console.log({ answer })
    return (
        <>
            <Banner title={answer?.list === undefined ? title : answer?.shopListName} />

            <FlatList
                data={newList}
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                }}
                ItemSeparatorComponent={ItemSeparatorView}
                // ListHeaderComponent={<Header />}
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        style={[{
                            flexDirection: 'row',
                            height: 40,
                            width: "100%",
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignItems: 'center',
                            backgroundColor: GlobalStyles[theme].paperColor
                        },
                        (index === 0) && {
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        },
                        (index === newList.length - 1) && {
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                        },
                        ]}
                        // onPress={() => setChecked(!checked)}>
                        onPress={() => handleCheck(item._id)}>
                        {item.isDone ?
                            <MaterialIcons name="check-box" size={30} color={GlobalStyles[theme].yesColor} style={{ justifyContent: 'center', backgroundColor: GlobalStyles[theme].paperColor }} />
                            : <MaterialIcons name="check-box-outline-blank" size={30} color={GlobalStyles[theme].noColor} style={{ justifyContent: 'center', backgroundColor: GlobalStyles[theme].paperColor }} />}
                        <View style={{ flexDirection: 'row', width: "85%", justifyContent: 'center', }}>
                            <Text style={{
                                width: "100%",
                                textAlign: 'left',
                                paddingLeft: 5,
                                textAlignVertical: 'center',
                                textDecorationLine: item.isDone ? 'line-through' : 'none',
                                color: GlobalStyles[theme].fontColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                            }}>
                                {/* Qty: {item.quantity} Un: {item.units} Prod: {item.product} */}
                                {item.quantity} {item.units} of {item.product}
                            </Text>
                        </View>
                    </TouchableOpacity>}
                keyExtractor={item => item._id}
                // extraData={selectedId}
                // ListFooterComponent={<Footer />}
                ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end", backgroundColor: GlobalStyles[theme].noColor }}
            />
            <Footer />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={{
                        width: 350,
                        height: 150,
                        borderStyle: 'solid',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 0.5,
                        borderRadius: 10,
                        borderColor: GlobalStyles[theme].borderColor,
                        backgroundColor: GlobalStyles[theme].background,
                    }}>

                        {!toDelete &&
                            <TouchableOpacity style={{
                                width: "100%",
                                alignItems: 'flex-end',
                                marginTop: 0,
                                marginRight: 30,
                                // marginBottom: 20
                            }}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <EvilIcons name="close-o" size={30} color="red" />
                            </TouchableOpacity>
                        }

                        {toDelete
                            ? <View style={{
                                height: "70%", width: "100%", justifyContent: 'space-around', alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: GlobalStyles[theme].fontColor,
                                    fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                }}>
                                    {trans[language].ARE_YOU_SURE}
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    width: "100%",
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}>
                                    <TouchableOpacity style={{
                                        width: "40%",
                                        height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 0.5,
                                        borderRadius: 10,
                                        borderColor: GlobalStyles[theme].borderColor,
                                        backgroundColor: GlobalStyles[theme].noColor,

                                    }}
                                        onPress={() => { setModalVisible(false), setToDelete(false) }
                                        }>
                                        <Text style={{
                                            color: GlobalStyles[theme].fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                        }}>
                                            {trans[language].CANCEL}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        width: "40%",
                                        height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 0.5,
                                        borderRadius: 10,
                                        borderColor: GlobalStyles[theme].borderColor,
                                        backgroundColor: GlobalStyles[theme].yesColor,

                                    }}
                                        onPress={deleteShop}>
                                        <Text style={{
                                            color: GlobalStyles[theme].fontColor,
                                            fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                        }}>
                                            {trans[language].DELETE}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                            : answer?.list?.some(item => item.isDone === true || item.isDone === false)
                                ? <>
                                    <Text style={{
                                        width: "85%",
                                        fontSize: 16,
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle,
                                        color: GlobalStyles[theme].fontColor
                                    }}>
                                        {trans[language].SUBMIT} {trans[language].YOUR_SHOP_PROGRESS}?
                                    </Text>
                                    <View style={{ height: 50 }} />
                                </>
                                : <>
                                    <Text style={{
                                        width: "85%",
                                        fontFamily: GlobalFontStyles[fontStyle].fontStyle
                                    }}>
                                        {trans[language].ENTER} {trans[language].SHOP_LIST_NAME}:
                                    </Text>
                                    <TextInput
                                        style={styles.outPuts}
                                        placeholder={trans[language].SHOP_LIST_NAME}
                                        // value={eventForm.eventName}
                                        onChangeText={text => handleOnChange('shopListName', text)} />
                                </>
                        }
                        {!toDelete && <TouchableOpacity style={{
                            width: "100%",
                            alignItems: 'flex-end',
                            marginTop: 0,
                            marginRight: 80,
                            // marginBottom: 20
                        }}
                            onPress={submitShopList}>
                            <Text style={{
                                fontSize: 15,
                                color: GlobalStyles[theme].buttonColor,
                                fontFamily: GlobalFontStyles[fontStyle].fontStyle
                            }}>
                                {trans[language].SUBMIT}
                            </Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </Modal>

        </>
    )
}

export default TodoList

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        width: 300,
        height: 150,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    outPuts: {
        width: "90%",
        height: 40,
        marginVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        paddingLeft: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20
    },
    button: {
        // position: 'absolute',
        // width: 150,
        // height: 50,
        minWidth: 150,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        // shadowRadius: 60,
        // shadowColor: '#F02A4B',
        // shadowOpacity: 0.3,
        shadowOffset: { height: 3, width: 0 },
        // elevation: 10,
        // zIndex: 10,
        // bottom: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 0.5,
    },
    separator: {
        backgroundColor: 'blue',
        height: 20,
    }
})