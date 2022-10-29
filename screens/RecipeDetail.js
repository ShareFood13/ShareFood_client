import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function RecipeDetail({ route, navigation }) {
    return (
        <View style={styles.container}>
            <Text>Recipe Detail</Text>
            {/* {route.params.name && <Text>{route.params.name}</Text>} */}
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