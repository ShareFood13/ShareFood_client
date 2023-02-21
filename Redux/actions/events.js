import { GET_EVENTS, UPDATE_EVENT, DEL_EVENT, CREATE_EVENT } from "../constants/constantsTypes";
import * as api from "../api"

export const createEvent = (event) => async (dispatch) => {

    try {

        const { data } = await api.createEvent(event)

        dispatch({ type: CREATE_EVENT, payload: data })

    } catch (error) {

        console.log(error)
    }
}

export const fetchEvents = (_id) => async (dispatch) => {

    try {

        const { data } = await api.fetchEvents(_id)

        dispatch({ type: GET_EVENTS, payload: data })

    } catch (error) {

        console.log(error)
    }
}

export const updateEvent = (event) => async (dispatch) => {
    try {

        const { data } = await api.updateEvent(event)

        dispatch({ type: UPDATE_EVENT, payload: data })

    } catch (error) {

        console.log(error)
    }
}

export const deleteEvent = (eventId) => async (dispatch) => {

    try {

        const { data } = await api.deleteEvent(eventId)

        dispatch({ type: DEL_EVENT, payload: data })

    } catch (error) {

        console.log(error)
    }
}