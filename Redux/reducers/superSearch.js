import { SUPER_SEARCH, ERROR_MSG } from "../constants/constantsTypes"

const reducer = (state = { superSearch: [], message: "" }, action) => {
    switch (action.type) {
        case SUPER_SEARCH:

            return { ...state, superSearch: action.payload.superSearch, message: action.payload.message }
        case ERROR_MSG:

            return { ...state, message: action.payload.message }
        default:

            return state
    }
}

export default reducer