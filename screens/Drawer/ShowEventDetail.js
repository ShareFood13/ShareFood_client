import React from 'react'
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
    FlatList,
    SafeAreaView
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';

import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';



const ShowEventDetail = ({ navigation, route }) => {
    const { eventData } = route.params

    const redux = useSelector((state) => state)
    const recipesList = redux?.recipe?.recipes


    const openRecipe = (recipe) => {
        navigation.push('RecipeDetail', { recipe: recipe })
    }

    const createShopList = () => {
        const mealToShopList = []
        eventData.recipesId.map(recipeId =>
            recipesList.map(item => {
                if (item._id === recipeId && item.isDeleted === false) {
                    mealToShopList.push(item)
                }
            })
        )
        navigation.navigate('Main', { screen: 'ShowShopList', params: { recipe: mealToShopList, showType: "meals" } })
    }

    console.log(eventData.recipesId)
    console.log(recipesList)
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            // borderColor: 'black',
            // borderWidth: 1,
            marginTop: 50,
        }}>
            <Text style={styles.banner} >Event Details</Text>

            <Text style={{ fontSize: 24 }}>{eventData.eventName}</Text>

            <View style={{ flexDirection: "row", justifyContent: 'flex-start', width: "90%", height: 40, alignItems: 'center', marginVertical: 10 }}>
                <Text>Occasion:</Text><Text style={{ backgroundColor: 'white', width: "80%", height: '100%', textAlignVertical: 'center', paddingLeft: 10, marginLeft: 10, borderRadius: 10 }}>{eventData.occasion}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: 'space-around', width: "90%", marginVertical: 10 }}>
                <Text style={{ backgroundColor: 'white', borderRadius: 10, height: 40, paddingHorizontal: 10, textAlignVertical: 'center' }}>Date: {eventData.eventDate}</Text>
                <Text style={{ backgroundColor: 'white', borderRadius: 10, height: 40, paddingHorizontal: 10, textAlignVertical: 'center' }}>Time: {eventData.eventTime}</Text>
                <Text style={{ backgroundColor: 'white', borderRadius: 10, height: 40, paddingHorizontal: 10, textAlignVertical: 'center' }}>{eventData.howManyGuests} Guests</Text>
            </View>

            <Text style={{ fontSize: 18, width: '13%', marginLeft: 20, alignSelf: 'flex-start', borderBottomColor: 'black', borderBottomWidth: 2 }}>Menu:</Text>

            {eventData.recipesId.map(item =>
                recipesList.map(recipe => {
                    if (recipe._id === item) {
                        return <Pressable key={recipe._id}
                            onPress={() => openRecipe(recipe)}>
                            <Text style={{ fontSize: 16, marginVertical: 10 }}>{recipe.recipeName}</Text>
                        </Pressable>
                    }
                })
            )}

            <View style={{ bottom: 130, position: 'absolute' }}>
                <TouchableOpacity onPress={() => navigation.navigate('MyDrawer', { screen: 'MyCallendarStackScreen', params: { screen: 'MyCallendar' } })}>
                    <Text style={{ color: 'blue', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, textAlignVertical: 'center' }}>Back to calendar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.button}>
                <TouchableOpacity onPress={createShopList}>
                    <FontAwesome name="list" size={25} color="red" />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default ShowEventDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    banner: {
        width: 350,
        height: 40,
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        fontSize: 18,
        marginVertical: 10,
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
})