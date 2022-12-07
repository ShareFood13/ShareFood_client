import { GET_EVENTS, UPDATE_EVENT, DEL_EVENT, CREATE_EVENT, ADD_RECIPE_TO } from "../constants/constantsTypes";
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

        // console.log("data:", data);

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
    console.log("deleteEvent:", eventId);
    try {

        const { data } = await api.deleteEvent(eventId)

        dispatch({ type: DEL_EVENT, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const addRecipeTo = (addTo, item) => async (dispatch) => {
    console.log("addRecipeTo", addTo, item);
    try {

        const { data } = await api.addRecipeTo(addTo, item)
        console.log(data);
        dispatch({ type: ADD_RECIPE_TO, payload: data })

    } catch (error) {
        console.log(error)
    }
}

