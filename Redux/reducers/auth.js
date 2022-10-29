// https://react-native-async-storage.github.io/async-storage/docs/usage

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH, LOGOUT, SENDPASS } from "../constants/constantsTypes"

const autoReducer = async (state = { autoData: null }, action) => {
    switch (action.type) {
        case AUTH:
            // console.log(action.data);

            await AsyncStorage.setItem('profile', JSON.stringify({ ...action?.data }))
            return { ...state, authData: action?.data }
        case LOGOUT:

            await AsyncStorage.clear()
            return { ...state, authData: null }
        case SENDPASS:

            await AsyncStorage.setItem('sendPassword', JSON.stringify({ ...action?.data }))
            return { ...state, authData: action?.data }
        default:
            return state
    }
}



export default autoReducer
