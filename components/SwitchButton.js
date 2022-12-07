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
    Alert
} from 'react-native'

import { Entypo, Ionicons, MaterialCommunityIcons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';

const SwitchButton = ({ text01, text02, setShow, show }) => {

    return (
        <View style={styles.switch}>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50%',
                height: 30,
                borderRadius: 10,
                borderColor: (show === text01) ? 'orange' : '#ffcc80',
                borderWidth: 0.5,
                backgroundColor: (show === text01) ? 'orange' : '#ffcc80',
                position: 'absolute',
                left: 0,
            }}
                onPress={() => setShow(text01)}>
                <Text>{text01}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50%',
                height: 30,
                borderRadius: 10,
                borderColor: (show !== text01) ? 'orange' : '#ffcc80',
                borderWidth: 0.5,
                backgroundColor: (show !== text01) ? 'orange' : '#ffcc80',
                position: 'absolute',
                right: 0
            }}
                onPress={() => setShow(text02)}>
                <Text>{text02}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SwitchButton

const styles = StyleSheet.create({
    switch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        height: 30,
        marginVertical: 10,
        borderRadius: 10,
        borderColor: 'orange',
        borderWidth: 0.5,
        backgroundColor: '#ffcc80',
        // opacity: 0.2,
        position: 'relative'
    }
})