import { AUTH, SENDPASS, USER_INFO, SEND_TO_US, AUTH_ERROR, SAVE_PROFILE, CLEAR_ERROR, START_FOLLOWING, STOP_FOLLOWING, FOLLOW_ERROR } from "../constants/constantsTypes"
import * as api from "../api"

export const signin = (formData) => async (dispatch) => {

    try {

        const { data } = await api.signIn(formData)

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
    }
}

export const sendPassword = (formData) => async (dispatch) => {

    try {

        const { data } = await api.sendPassword(formData)

        dispatch({ type: SENDPASS, data })
    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "Some information is wrong, please check it!3" })
    }
}

export const changePassword = (formData) => async (dispatch) => {

    try {

        const { data } = await api.changePassword(formData)

        dispatch({ type: AUTH, data })

    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "Some information is wrong, please check it!4" })
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

        dispatch({ type: SEND_TO_US, data })
    } catch (error) {

        console.log("sendToSharedFood", error)
    }
}

export const saveProfile = (_id, profileForm) => async (dispatch) => {

    try {

        const { data } = await api.saveProfile(_id, profileForm)

        dispatch({ type: SAVE_PROFILE, data })
    } catch (error) {

        console.log("auth saveProfile profileForm", error)
    }
}

export const startFollowing = (ids) => async (dispatch) => {

    try {

        const { data } = await api.startFollowing(ids)

        await dispatch({ type: START_FOLLOWING, data })
    } catch (error) {

        dispatch({ type: FOLLOW_ERROR, message: "START_FOLLOWING ERROR" })
    }
}

export const stopFollowing = (my_id, follow_id) => async (dispatch) => {

    try {

        const { data } = await api.stopFollowing(my_id, follow_id)

        await dispatch({ type: STOP_FOLLOWING, payload: data })
    } catch (error) {

        dispatch({ type: FOLLOW_ERROR, message: "STOP_FOLLOWING ERROR" })
    }
}