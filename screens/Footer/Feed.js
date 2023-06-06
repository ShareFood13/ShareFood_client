import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { Context } from '../../context/UserContext';
import { useContext } from 'react';
var theme = ""
var language = ""
var fontStyle = ""

const Feed = () => {
    const { userContext, setUserContext } = useContext(Context)
    
    theme = userContext?.settings?.theme
    language = userContext?.settings?.language?.value
    fontStyle = userContext?.settings?.fontStyle

    return (
        <View>
            <Text>Others posts</Text>
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({})