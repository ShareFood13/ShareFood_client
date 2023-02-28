import React, { useContext } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { Context } from "../../context/UserContext";

export default function Search({ navigation }) {
    const { userContext } = useContext(Context)

    return (
        <View style={styles.container}>
            <Text>Search</Text>
            {/* <Button title='Click Me' onPress={() => setUserContext(66666)} /> */}
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