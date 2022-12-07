import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function MyProfile({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>My Profile</Text>
            <Text>UserName</Text>
            <Text>e-mail</Text>

            <Text>my picture: upload option</Text>
            <Text>my background picture: upload option</Text>
            <Text>create avatar???</Text>


            <Text>Personal Settings</Text>
            <Text>Name</Text>
            <Text>Gender</Text>
            <Text>Birthday</Text>
            <Text>About Me</Text>
            <Text>Phone Number</Text>
            <Text>Address</Text>
            <Text>Country</Text>
            <Text>languages</Text>
            <Text>Links</Text>

            <Text>Food Info</Text>
            <Text>Alergies</Text>
            <Text>I Love to eat</Text>
            <Text>The best Restaurants are...</Text>


            <Button title='Click Me' onPress={() => alert('ToDo')} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})