// https://react-native-async-storage.github.io/async-storage/docs/usage

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH, LOGOUT, SENDPASS, USER_INFO, SEND_TO_US } from "../constants/constantsTypes"

const autoReducer = async (state = { autoData: null }, action) => {
    switch (action.type) {
        case AUTH:
            console.log('action.data:', action.data);

            await AsyncStorage.setItem('profile', JSON.stringify({ ...action?.data }))
            return { ...state, authData: action?.data }
        case LOGOUT:

            await AsyncStorage.clear()
            return { ...state, authData: null }
        case SENDPASS:

            await AsyncStorage.setItem('sendPassword', JSON.stringify({ ...action?.data }))
            return { ...state, authData: action?.data }

        case USER_INFO:
            console.log('USER_INFO action.data:', action.data);

            return { ...state, authData: action?.data }

        case SEND_TO_US:
            console.log('SEND_TO_US action.data:', action.data);

            return { ...state, authData: action?.data }
        default:
            return state
    }
}



export default autoReducer
