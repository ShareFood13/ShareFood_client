import { AUTH, SENDPASS, USER_INFO, SEND_TO_US } from "../constants/constantsTypes"
import * as api from "../api"

export const signin = (formData, navigation) => async (dispatch) => {

    try {

        const { data } = await api.signIn(formData)

        dispatch({ type: AUTH, data })

        navigation.navigate('Home3')
    } catch (error) {

        console.log("signin", error)

    }
}

export const signup = (formData, navigation) => async (dispatch) => {

    try {

        const { data } = await api.signUp(formData)

        dispatch({ type: AUTH, data })

        navigation.navigate('Home3')

    } catch (error) {

        console.log("signup", error)

    }
}

export const sendPassword = (formData, navigation) => async (dispatch) => {

    try {

        const { data } = await api.sendPassword(formData)

        dispatch({ type: SENDPASS, data })

        // navigation.navigate('Home3')

    } catch (error) {

        console.log("sendPassword", error)

    }
}

export const changePassword = (formData, navigation) => async (dispatch) => {

    try {

        const { data } = await api.changePassword(formData)

        dispatch({ type: AUTH, data })

        navigation.navigate('LogIn')

    } catch (error) {

        console.log("changePassword", error)

    }
}

export const getUserInfo = (_id) => async (dispatch) => {

    try {
        const { data } = await api.getUserInfo(_id)

        dispatch({ type: USER_INFO, data })

    } catch (error) {

        console.log("getUserInfo", error)

    }
}

export const sendToSharedFood = (contactUsForm) => async (dispatch) => {

    try {
        const { data } = await api.sendToSharedFood(contactUsForm)
        console.log("Actions auth sendToSharedFood", data)
        dispatch({ type: SEND_TO_US, data })

    } catch (error) {

        console.log("sendToSharedFood", error)

    }
}