import React, { useState, useEffect, useCallback } from 'react'

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
    StatusBar,
    RefreshControl,
    ImageBackground,
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';

import uuid from 'react-native-uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo } from '../../Redux/actions/auth'

import { getMeals, createMeal, updateMeal, deleteMeal } from '../../Redux/actions/meals';

import { getMyRecipes } from '../../Redux/actions/recipes';

import SwitchButton from '../../components/SwitchButton'

const initialState = {
    mealName: "",
    specialDiet: [],
    status: "Public",
    tags: [],
}

const specialDiet = [
    "Vegan",
    "Vegetarian",
    "Lactose Free",
    "Peanut Free",
    "Soy Free",
    "Gluten Free",
    "Sea Food",
    "Contain Fish",
    "Contain Nuts",
    "Contain Eggs",
    "No Added Sugar",
    "No Added Salt",
    "Low Fat",
    "Spicy",
    "Halal",
    "Kosher",
]

const logos = [
    { name: "Vegan", image: require('../../assets/images/logo/vegan.png') },
    { name: "Organic", image: require('../../assets/images/logo/organic.png') },
    { name: "Gluten Free", image: require('../../assets/images/logo/glutenFree.png') },
    { name: "Lactose Free", image: require('../../assets/images/logo/lactoseFree.png') },
    { name: "Egg Free", image: require('../../assets/images/logo/eggFree2.png') },
    { name: "Nut Free", image: require('../../assets/images/logo/nutFree.png') },
    { name: "Less Sugar", image: require('../../assets/images/logo/lessSugar.png') },
    { name: "Low Fat", image: require('../../assets/images/logo/lowFat.png') },
    { name: "Contain Nuts", image: require('../../assets/images/logo/containNuts.png') },
    { name: "No Molluses", image: require('../../assets/images/logo/noMolluses.png') },
    { name: "Zero Fat", image: require('../../assets/images/logo/zeroFat.png') },
    { name: "Raw Food", image: require('../../assets/images/logo/rawFood.png') },
    { name: "Safe For Kids", image: require('../../assets/images/logo/safeForKids.png') },
    { name: "Spicy", image: require('../../assets/images/logo/spicy.png') },
    { name: "Constain Soybean", image: require('../../assets/images/logo/constainSoybean.png') },
    { name: "Contain Custacean", image: require('../../assets/images/logo/containCustacean.png') },
    { name: "Halal", image: require('../../assets/images/logo/chalal.png') },
    { name: "Kosher", image: require('../../assets/images/logo/kosher.png') },

    // { name: "Gluten Free2", image: require('../../assets/images/logo/glutenFree2.png') },
    // { name: "Milk Free2", image: require('../../assets/images/logo/milkFree2.png') },
    // { name: "Sugar Free2", image: require('../../assets/images/logo/sugarFree2.png') },
    // { name: "Vegan2", image: require('../../assets/images/logo/vegan2.png') },
    // { name: "Wheat Free2", image: require('../../assets/images/logo/wheatFree2.png') },
]

export default function MyMeals({ navigation }) {
    const [meal, setMeal] = useState()
    const [mealForm, setMealForm] = useState(initialState)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible3, setModalVisible3] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [show, setShow] = useState("Public")
    const [tagsValue, setTagsValue] = useState("")
    const [update, setUpdate] = useState(false)
    const [user, setUser] = useState()
    const [sDietMeal, setSDietMeal] = useState()
    // const [modalVisible2, setModalVisible2] = useState(false)

    const dispatch = useDispatch();

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const mealList = useSelector((state) => state.meal.meals)
    const myRecipes = useSelector((state) => state.recipe.recipes)
    const userInfo = useSelector((state) => state.auth._3.authData)

    console.log("userInfo:", userInfo?.result);

    // console.log("mealForm:", mealForm);
    // console.log("mealForm:", mealForm.specialDiet);

    // console.log("user:", user);
    console.log("mealList:", mealList);
    // console.log("myEvents:", user?.eventsId);
    // console.log("myRecipes:", user?.recipesId);


    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const result = JSON.parse(await AsyncStorage.getItem('profile'))
        setUser(result)
    }

    // useEffect(() => {
    //     console.log('====================================');
    //     console.log('test');
    //     console.log('====================================');
    // }, [userInfo])

    useEffect(() => {
        setMealForm({ ...mealForm, status: show })
    }, [show])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(3000).then(() => setRefreshing(false)).then(dispatch(getUserInfo(user?.result?._id)));
    }, []);

    const handleOnChange = (name, text) => {
        if (name === "tags") {
            if (text.charAt(text.length - 1) === '#') {
                return setTagsValue(text.slice(0, text.length - 1))
            }
            setTagsValue(text)
            if (text.charAt(text.length - 1) === "," || text.charAt(text.length - 1) === " ") {
                if (!mealForm.tags.includes("#" + text.slice(0, text.length - 1).toLowerCase()) && text !== " " && text !== ",")
                    setMealForm({ ...mealForm, tags: [...mealForm.tags, "#" + text.slice(0, text.length - 1).toLowerCase()] })
                setTagsValue("")
            }
        } else {
            setMealForm({ ...mealForm, [name]: text, creatorId: userInfo?.result._id })
        }
    }

    const remove = (text, name) => {
        const result2 = mealForm.tags.filter(item => item !== text._dispatchInstances.pendingProps.children[0])
        setMealForm({ ...mealForm, tags: result2 })
    }

    const closeModal = () => {
        setMealForm(initialState)
        setModalVisible(false)
        setModalVisible3(false)
    }

    const saveMeal = () => {
        dispatch(createMeal(mealForm))
        closeModal()
        onRefresh()
        dispatch(getUserInfo(userInfo?.result._id))
    }

    const openMeal = (mealItem) => {
        const array = []
        console.log("mealItem", userInfo?.result)
        // dispatch(getMeals(user?.result._id))
        // dispatch(getMyRecipes(user?.result._id))
        setModalVisible3(true)
        setMeal(mealItem)
        mealItem?.recipesId.map(recipeId =>
            userInfo?.result.recipesId.map(item => {
                if (item._id === recipeId && item.isDeleted === false) {
                    item.specialDiet.map(sDiet => !array.includes(sDiet) && array.push(sDiet))
                }
            })
        )
        setSDietMeal(array)

    }

    const editMeal = (meal) => {
        setModalVisible(true)
        setMealForm(meal)
        setUpdate(true)
    }

    const updateMealFc = () => {
        dispatch(updateMeal(mealForm, mealForm._id))
        setUpdate(false)
        setModalVisible(false)
        setMealForm(initialState)
        dispatch(getUserInfo(userInfo?.result._id))
    }


    const delMeal = (meal) => {
        console.log("deleteMeal", meal);
        dispatch(deleteMeal(meal._id))
        dispatch(getUserInfo(userInfo?.result._id))
    }

    const createShopList = () => {
        const mealToShopList = []
        meal?.recipesId.map(recipeId =>
            userInfo?.result.recipesId.map(item => {
                if (item._id === recipeId && item.isDeleted === false) {
                    mealToShopList.push(item)
                }
            })
        )
        // console.log("mealToShopList", mealToShopList);
        navigation.navigate('ShowShopList', { recipe: mealToShopList, showType: "meals" })
    }

    return (
        <View style={styles.container}>
            <View style={{
                position: 'absolute',
                width: windowWidth,
                height: 120,
                alignSelf: 'center',
                elevation: 5,
                zIndex: 5

            }}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)} >
                    <View
                        value={mealForm.mealName}
                        style={{
                            width: windowWidth,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                            backgroundColor: '#2596be',
                            borderColor: 'black',
                            borderWidth: 1,
                            borderStyle: 'solid',

                        }}>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }} value={mealForm.specialDiet}>Create a Meal</Text>

                    </View>
                </TouchableOpacity>

                <Text style={styles.banner}>My Meals</Text>

            </View>
            <ScrollView
                style={{ width: windowWidth }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        progressViewOffset={windowHeight / 2 - 70}
                    />
                }
            >




                <View style={{ width: '100%', marginTop: 120 }}>
                    {userInfo?.result?.mealsId?.map(meal =>
                        !meal.isDeleted && <View key={uuid.v4()}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignSelf: 'center',
                                alignItems: 'center',
                                width: '93%',
                                marginVertical: 5,
                                height: 90,
                                borderWidth: 0.5,
                                borderStyle: 'solid',
                                borderColor: 'black',
                                backgroundColor: 'white',
                                borderRadius: 10,
                                paddingHorizontal: 10
                            }}>

                            <TouchableOpacity
                                onPress={() => openMeal(meal)}
                                style={{ width: '90%', height: '75%', }}
                            >
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '700' }}>{meal.mealName} </Text>
                                    <Text style={[styles.outputTags, { width: '100%' }]} >
                                        {meal.tags.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "tags")}>{item}, </Text>)}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{ height: 60, justifyContent: 'space-between', }}>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => editMeal(meal)}>
                                    <Feather name="edit-3" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => Alert.alert(
                                    'Are you sure???',
                                    'You are permantly deleting this meal from your meals!!!',
                                    [
                                        { text: "Cancel", },
                                        { text: "Delete", onPress: () => delMeal(meal) }
                                    ])}>
                                    <AntDesign name="delete" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => closeModal()}
                                style={{
                                    width: "100%",
                                    alignItems: 'flex-end',
                                    marginTop: 20,
                                    marginRight: 40,
                                    marginBottom: 20
                                }}>
                                <EvilIcons name="close-o" size={30} color="black" />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.outPuts}
                                placeholder="Meal Name"
                                value={mealForm.mealName}
                                onChangeText={text => handleOnChange('mealName', text)} />

                            <View style={styles.inputTags}>
                                <TouchableOpacity onPress={() => Alert.alert(
                                    'HashTag',
                                    'Just press "space" or "," to enter your HashTag, \nNo need for #. \nMaximum 20 Characters.\nTo delete one just click on it.',
                                    [
                                        { text: "OK" }
                                    ])}>
                                    <FontAwesome5 name="hashtag" size={24} color="black" />
                                </TouchableOpacity>

                                <TextInput
                                    value={tagsValue}
                                    style={{ width: "90%", paddingLeft: 10 }}
                                    placeholder='Your Tags'
                                    maxLength={21}
                                    onChangeText={text => handleOnChange('tags', text)} />
                            </View>

                            <Text style={styles.outputTags} >
                                {mealForm.tags.map(item => <Text key={uuid.v4()} onPress={(text) => remove(text, "tags")}>{item}, </Text>)}
                            </Text>

                            <SwitchButton text01="Public" text02="Private" show={show} setShow={setShow} />

                            {update ? <TouchableOpacity
                                style={styles.genericButton}
                                onPress={() => updateMealFc()}>
                                <Text style={{ color: 'white', fontWeight: '700' }}>Update</Text>
                            </TouchableOpacity>
                                : <TouchableOpacity
                                    style={styles.genericButton}
                                    onPress={() => saveMeal()}>
                                    <Text style={{ color: 'white', fontWeight: '700' }}>Save</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </Modal>

                {/* <View style={styles.specialDiet}>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible2}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalViewDiet}>
                                <ScrollView style={styles.scrollView}
                                    showsVerticalScrollIndicator={false}>
                                    {specialDiet.map(diet =>
                                        <Pressable
                                            key={uuid.v4()}
                                            style={styles.sDietModalButtons}>

                                            <Text style={styles.textStyle}
                                                onPress={(text) => handleSpecialDiet(text)}>
                                                {diet}</Text>
                                        </Pressable>
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View> */}


                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={modalVisible3}>

                    <View style={styles.centeredView}>
                        <View style={styles.mealCard}>
                            <ImageBackground source={require('../../assets/images/linePaper.png')} style={{ width: '100%', height: 350 }}
                                imageStyle={{ resizeMode: 'cover' }}>
                                <TouchableOpacity onPress={() => closeModal()}
                                    style={{
                                        width: "100%",
                                        alignItems: 'flex-end',
                                        marginTop: 5,
                                        marginRight: 40,
                                        marginBottom: 0
                                    }}>
                                    <EvilIcons name="close-o" size={30} color="black" />
                                </TouchableOpacity>
                                <View style={styles.mealShow}>
                                    <Text style={{ fontSize: 20, marginBottom: 18 }}>{meal?.mealName}</Text>
                                    <View style={{ height: 150, width: '90%', justifyContent: 'space-around', alignItems: 'center' }}>
                                        {meal?.recipesId.map(recipeId =>
                                            userInfo?.result.recipesId.map(item => {
                                                if (item._id === recipeId && item.isDeleted === false) {
                                                    return <Text key={uuid.v4()} style={{ fontSize: 16 }}>{item.recipeName}</Text>
                                                }
                                            })
                                        )}
                                    </View>


                                    {/* {meal?.recipesId?.map(recipe =>
                                        <View style={{
                                            width: '90%',
                                            height: 40,
                                            marginVertical: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }} key={uuid.v4()}>
                                            <Text>{recipe.recipeName}</Text>
                                        </View>)} */}
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            {sDietMeal?.map(item => {
                                return logos.map(logo =>
                                    (logo.name === item)
                                    && <Image
                                        key={uuid.v4()}
                                        resizeMode='contain'
                                        source={logo.image}
                                        style={{
                                            height: 45, width: 45, margin: 5, alignSelf: 'center',
                                        }} />

                                )
                            })}
                        </View>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity onPress={createShopList}>
                            <FontAwesome name="list" size={25} color="red" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    banner: {
        width: 350,
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        fontSize: 18,
        marginBottom: 30,
        backgroundColor: "orange",
        // color: 'white',
    },
    button: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        shadowRadius: 60,
        shadowColor: '#F02A4B',
        shadowOpacity: 0.3,
        shadowOffset: { height: 3, width: 0 },
        elevation: 10,
        zIndex: 10,
        bottom: 50,
        backgroundColor: 'white',
        borderColor: 'black', borderStyle: 'solid', borderWidth: 0.2,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    genericButton: {
        marginBottom: 10,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: '#66ccff',
    },
    inputTags: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: "90%",
        width: "90%",
        backgroundColor: '#e6e6e6',
        height: 45,
        borderRadius: 10,
        paddingStart: 10,
        fontSize: 16,
        borderRadius: 20,
        marginBottom: 10,
        paddingLeft: 15,
    },
    mealCard: {
        width: '95%',
        height: 330,
        // borderStyle: 'solid',
        // borderWidth: 0.3,
        // borderColor: 'black',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    mealShow: {
        justifyContent: 'space-between',
        width: '80%',
        height: 320,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'flex-start',
        marginLeft: 50,
        paddingHorizontal: 10,
    },
    modalView: {
        width: 300,
        height: 330,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    modalViewDiet: {
        width: 300,
        height: 450,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 20
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
    outputTags: {
        width: "90%",
        backgroundColor: '#e6e6e6',
        height: 40,
        borderRadius: 10,
        fontSize: 14,
        padding: 10,
        borderRadius: 15,
        marginVertical: 7,
        paddingLeft: 10,
        overflow: 'hidden',
    },
    specialDietText: {
        backgroundColor: '#e6e6e6',
        width: "100%",
        minHeight: 40,
        borderRadius: 20,
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 60,
        textAlignVertical: 'center'
    },
    sDietButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#66ccff",
        width: 60,
        height: 40,
        position: 'absolute',
        right: 0,
        justifyContent: 'center',

    },
    sDietModalButtons: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 150, alignItems: 'center',
        marginVertical: 5
    },
})