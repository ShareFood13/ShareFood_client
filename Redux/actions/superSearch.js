
import { SUPER_SEARCH, ERROR_MSG } from "../constants/constantsTypes"
import * as api from "../api"


export const superSearch = (text, restrictions) => async (dispatch) => {

    try {
        const { data } = await api.superSearch(text, restrictions)

        dispatch({ type: SUPER_SEARCH, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}