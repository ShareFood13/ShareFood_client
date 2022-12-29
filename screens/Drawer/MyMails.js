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

import { createMyMail, getMyMeals, getSendedMails, deleteMyMail } from '../../Redux/actions/mymails';

import Constants from 'expo-constants';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SelectList } from 'react-native-dropdown-select-list';

export default function MyMails({ navigation }) {
    return (
        <View style={styles.container}>

            <Text>My Mails</Text>
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