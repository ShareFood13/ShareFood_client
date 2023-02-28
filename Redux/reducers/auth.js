import * as SecureStore from 'expo-secure-store';

import { AUTH, LOGOUT, SENDPASS, USER_INFO, SEND_TO_US, SAVE_PROFILE, START_FOLLOWING, AUTH_ERROR, CLEAR_ERROR, CLEAR_STATE, CLEAR_MSG } from "../constants/constantsTypes"

const reducer = (state = { authData: {}, message: "" }, action) => {
    switch (action.type) {
        case AUTH:
            const data = action.data

            const StorageObj = { token: data.token, userId: data.result._id, userEmail: data.result.email, userName: data.result.name, userUserName: data.result.userName }

            setItem(StorageObj)

            async function setItem(StorageObj) {
                await SecureStore.setItemAsync('storageData', JSON.stringify(StorageObj));
            }

            return { ...state, authData: { ...data }, token: data.token }
        case LOGOUT:
            deleteItem()

            async function deleteItem({ navigation }) {

                try {

                    await SecureStore.deleteItemAsync('storageData')
                } catch (error) {

                    console.log(error)
                }

                navigation.navigate('Auth', { screen: 'LogIn' })
            }

            return { ...state, authData: null }
        case SENDPASS:
            //DEPOIS TENHO QUE VERIFICAR OQ ROLA NESSE SET ITEM
            async () => await SecureStore.setItemAsync('sendPassword', JSON.stringify({ ...action.data.password }))

            return { ...state, authData: action?.data }
        case USER_INFO:

            return { ...state, authData: action?.data }
        case SEND_TO_US:

            return { ...state, authData: action?.data }
        case AUTH_ERROR:

            return { ...state, auth_msg: action.error_msg }
        case CLEAR_ERROR:

            return { ...state, auth_msg: "" }

        case CLEAR_STATE:

            return state = ""
        case SAVE_PROFILE:

            return { ...state, authData: action?.data.result, message: action?.data.message }
        case START_FOLLOWING:

            return { ...state, authData: action.data.result, message: action.data.message }
        case CLEAR_MSG:

            return { ...state, message: "" }
        default:
            return state
    }
}



export default reducer
