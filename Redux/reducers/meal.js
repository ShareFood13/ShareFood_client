import { GET_MEALS, UPDATE_MEAL, DEL_MEAL, CREATE_MEAL, CLEAR_MSG } from "../constants/constantsTypes";

const reducer = (state = { meals: [], message: "" }, action) => {

    switch (action.type) {
        case CREATE_MEAL:

            return { ...state, meals: [...state.meals, action.payload.meals], message: action.payload.message }
        case GET_MEALS:

            return { ...state, meals: action.payload.meals }
        case UPDATE_MEAL:

            return { ...state, meals: [...state.meals, action.payload.meals], message: action.payload.message }
        case DEL_MEAL:

            return { ...state, meals: [...state.meals, action.payload.meals], message: action.payload.message }
        case CLEAR_MSG:

            return { ...state, message: "" }
        default:
            return state
    }
}

export default reducer