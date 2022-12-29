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
    RefreshControl
} from 'react-native'

import uuid from 'react-native-uuid';


const ShowEventDetail = (navigation) => {
    const eventData = navigation.route.params
    // console.log('====================================');
    // console.log(eventData.item);
    // console.log('====================================');

    const openRecipe = (recipe) => {
        navigation.navigation.push('RecipeDetail', { recipe: recipe })
    }

    return (
        <View style={styles.container}>
            <Text>Event Detail</Text>
            <Text>Event date: {eventData.item.eventDate}</Text>
            <Text>Event time: {eventData.item.eventTime}</Text>
            <Text>Event name: {eventData.item.eventName}</Text>
            <Text>Occasion: {eventData.item.occasion}</Text>
            <Text>Guests: {eventData.item.howManyGuests}</Text>

            <Text>Menu:</Text>
            {eventData.item.recipesId.map(recipe =>
                <Pressable key={uuid.v4()}
                    onPress={() => openRecipe(recipe)}>
                    <Text>{recipe.recipeName}</Text>
                </Pressable>)}
            {/* <Button title='Back to calendar' onPress={() => navigation.navigation.goBack('MyCalendar')} /> */}
        </View>
    )
}

export default ShowEventDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})