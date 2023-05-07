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




const TodoList = ({ navigation, answer, openShopListId, title }) => {
    const [shopList, setShopList] = useState({})
    const [newList, setNewList] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [userId, setUserId] = useState("")
    const [toDelete, setToDelete] = useState(false)


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
                flexDirection: "column", height: 150, justifyContent: 'space-around', bottom: 0, position: "relative"
            }}>
                <View style={{
                    flexDirection: 'row', width: "100%", justifyContent: 'space-around', alignItems: 'center'
                }}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]}
                        onPress={saveShop}
                    >
                        <Text style={{ fontWeight: 'bold', color: "white" }}>Save Shop List!</Text>
                    </TouchableOpacity>
                    {answer?.list?.some(item => item.isDone === true || item.isDone === false) &&
                        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]}
                            onPress={openDeleteModal}>
                            <Text style={{ fontWeight: 'bold', color: "white" }}>Delete Shop List!</Text>
                        </TouchableOpacity>}
                </View>
                <View>
                    <TouchableOpacity style={[styles.button, { backgroundColor: "blue" }]}
                        onPress={() => navigation.navigate('MyDrawer', { screen: 'Home' })}
                    >
                        <Text style={{ fontWeight: 'bold', color: "white" }}>Back Home!</Text>
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
            {/* <Header /> */}
            <Banner title={answer?.list === undefined ? title : answer?.shopListName} />
            {/* <Banner title={answer?.list === undefined ? title : answer?.shopListName} /> */}
            <FlatList
                data={newList}
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                }}
                ItemSeparatorComponent={ItemSeparatorView}
                // ListHeaderComponent={<Header />}
                renderItem={({ item }) =>
                    <TouchableOpacity style={{ flexDirection: 'row', height: 35, width: "90%", justifyContent: 'center', alignSelf: 'center', alignItems: 'center', backgroundColor: 'white' }}
                        // onPress={() => setChecked(!checked)}>
                        onPress={() => handleCheck(item._id)}>
                        {item.isDone ?
                            <MaterialIcons name="check-box" size={30} color="green" style={{ width: "15%", height: 30, justifyContent: 'center', backgroundColor: 'white' }} />
                            : <MaterialIcons name="check-box-outline-blank" size={30} color="red" style={{ width: "15%", height: 30, justifyContent: 'center', backgroundColor: 'white' }} />}
                        <View style={{ flexDirection: 'row', width: "85%", justifyContent: 'center', }}>
                            <Text style={{ width: "100%", textAlign: 'left', textAlignVertical: 'center', textDecorationLine: item.isDone ? 'line-through' : 'none' }}>
                                {/* Qty: {item.quantity} Un: {item.units} Prod: {item.product} */}
                                {item.quantity} {item.units} of {item.product}
                            </Text>
                        </View>
                    </TouchableOpacity>}
                keyExtractor={item => item._id}
                // extraData={selectedId}
                // ListFooterComponent={<Footer />}
                ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end", backgroundColor: 'red' }}
            />
            <Footer />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        {!toDelete &&
                            <TouchableOpacity style={{
                                width: "100%",
                                alignItems: 'flex-end',
                                marginTop: 0,
                                marginRight: 30,
                                // marginBottom: 20
                            }}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <EvilIcons name="close-o" size={30} color="black" />
                            </TouchableOpacity>
                        }

                        {toDelete
                            ? <View style={{
                                height: "70%", width: "90%", justifyContent: 'space-around', alignItems: 'center',
                            }}>
                                <Text>Are you sure do you want to Delete It?</Text>
                                <View style={{
                                    flexDirection: 'row', width: "90%", justifyContent: 'space-around', alignItems: 'center',
                                }}>
                                    <TouchableOpacity style={{
                                        width: "40%",
                                        height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderColor: 'red',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        backgroundColor: "red",

                                    }}
                                        onPress={() => { setModalVisible(false), setToDelete(false) }
                                        }>
                                        <Text style={{ fontWeight: 'bold', color: 'white' }}>No</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        width: "40%",
                                        height: 30,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderColor: 'green',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        backgroundColor: "green",

                                    }}
                                        onPress={deleteShop}>
                                        <Text style={{ fontWeight: 'bold', color: 'white' }}>Yes</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                            : answer?.list?.some(item => item.isDone === true || item.isDone === false)
                                ? <>
                                    <Text style={{ width: "85%" }}>Submit your shop progress?</Text>
                                    <View style={{ height: 50 }} />
                                </>
                                : <>
                                    <Text style={{ width: "85%" }}>Enter Shop List Name:</Text>
                                    <TextInput
                                        style={styles.outPuts}
                                        placeholder="Shop List Name"
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
                            <Text style={{ color: 'blue' }}>Submit</Text>
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
        width: 150,
        height: 50,
        borderRadius: 5,
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
        backgroundColor: 'white',
        borderColor: 'black', borderStyle: 'solid', borderWidth: 0.2,
    },
    separator: {
        backgroundColor: 'blue',
        height: 20,
    }
})