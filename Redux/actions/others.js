import { GET_OTHER_USERS, AUTH_ERROR, START_FOLLOWING, STOP_FOLLOWING, FOLLOW_ERROR } from "../constants/constantsTypes"
import * as api from "../api"

export const getotherusers = (_id) => async (dispatch) => {

    try {

        const { data } = await api.getOtherUsers(_id)
        // console.log("getotherusers", data)

        await dispatch({ type: GET_OTHER_USERS, payload: data })

    } catch (error) {

        dispatch({ type: AUTH_ERROR, error_msg: "" })
        // dispatch({ type: AUTH_ERROR, error_msg: "Some information is wrong, please check it!5" })
    }

}

export const startFollowing = (ids) => async (dispatch) => {

    console.log({ ids })

    try {

        const { data } = await api.startFollowing(ids)

        console.log("startFollowing", data)

        await dispatch({ type: START_FOLLOWING, payload: data })

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

