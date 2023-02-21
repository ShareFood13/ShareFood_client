import { AUTH, SENDPASS, USER_INFO, SEND_TO_US, AUTH_ERROR, SAVE_PROFILE, CLEAR_ERROR, START_FOLLOWING, STOP_FOLLOWING, FOLLOW_ERROR } from "../constants/constantsTypes"
import * as api from "../api"

export const signin = (formData) => async (dispatch) => {

    try {

        const { data } = await api.signIn(formData)
        // console.log("actions auth.js signin formData:", data)

        await dispatch({ type: AUTH, data })

    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "Some information is wrong, please check it!1" })
    }
}

export const signup = (formData) => async (dispatch) => {

    try {

        const { data } = await api.signUp(formData)

        dispatch({ type: AUTH, data })

    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "Some information is wrong, please check it!2" })

        // console.log("signup", error)

    }
}

export const sendPassword = (formData) => async (dispatch) => {

    try {

        const { data } = await api.sendPassword(formData)
        // console.log("sendPassword", data)
        dispatch({ type: SENDPASS, data })

    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "Some information is wrong, please check it!3" })

        // console.log("sendPassword", error)

    }
}

export const changePassword = (formData) => async (dispatch) => {

    try {

        const { data } = await api.changePassword(formData)

        // console.log("changePassword", data)

        dispatch({ type: AUTH, data })

        // navigation.navigate('LogIn')

    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "Some information is wrong, please check it!4" })

        // console.log("changePassword", error)

    }
}

export const getUserInfo = (_id) => async (dispatch) => {

    // console.log("getUserInfo _id", _id)
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
        // console.log("Actions auth sendToSharedFood", data)
        dispatch({ type: SEND_TO_US, data })

    } catch (error) {

        console.log("sendToSharedFood", error)
    }
}

export const saveProfile = (_id, profileForm) => async (dispatch) => {
    console.log("auth saveProfile profileForm", _id, profileForm)

    try {

        const { data } = await api.saveProfile(_id, profileForm)

        console.log("auth saveProfile data", data)

        dispatch({ type: SAVE_PROFILE, data })

    } catch (error) {
        console.log("auth saveProfile profileForm", error)

    }
}

export const startFollowing = (ids) => async (dispatch) => {

    console.log({ ids })

    try {

        const { data } = await api.startFollowing(ids)

        console.log("startFollowing", data)

        await dispatch({ type: START_FOLLOWING, data })

    } catch (error) {

        dispatch({ type: FOLLOW_ERROR, message: "START_FOLLOWING ERROR" })
    }
}

export const stopFollowing = (my_id, follow_id) => async (dispatch) => {

    console.log(my_id, follow_id)

    try {

        const { data } = await api.stopFollowing(my_id, follow_id)

        await dispatch({ type: STOP_FOLLOWING, payload: data })

    } catch (error) {

        dispatch({ type: FOLLOW_ERROR, message: "STOP_FOLLOWING ERROR" })
    }
}