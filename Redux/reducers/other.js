import * as SecureStore from 'expo-secure-store';

import { GET_OTHER_USERS, START_FOLLOWING, CLEAR_MSG } from "../constants/constantsTypes"

const reducer = (state = { otherUsers: [], message: "" }, action) => {
    switch (action.type) {
        case GET_OTHER_USERS:

            return { ...state, otherUsers: action.payload.otherUsers }
        case CLEAR_MSG:

            return { ...state, message: "" }
        default:
            return state
    }
}

export default reducer
