import { GET_OTHER_USERS, AUTH_ERROR, START_FOLLOWING, STOP_FOLLOWING, FOLLOW_ERROR } from "../constants/constantsTypes"
import * as api from "../api"

export const getotherusers = (_id) => async (dispatch) => {

    try {

        const { data } = await api.getOtherUsers(_id)

        await dispatch({ type: GET_OTHER_USERS, payload: data })
    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "" })
    }

}

export const startFollowing = (ids) => async (dispatch) => {

    try {

        const { data } = await api.startFollowing(ids)

        await dispatch({ type: START_FOLLOWING, payload: data })
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

