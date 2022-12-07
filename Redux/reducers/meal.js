import { GET_MEALS, UPDATE_MEAL, DEL_MEAL, CREATE_MEAL } from "../constants/constantsTypes";

const reducer = (state = { meal: [] }, action) => {
    switch (action.type) {
        case CREATE_MEAL:
            return { ...state, meal: [...state.meal, action.payload] }

        case GET_MEALS:
            // console.log("action", action.payload);
            return { ...state, meals: action.payload }

        case UPDATE_MEAL:
            console.log("UPDATE_MEAL:", action.payload);
        // return { ...state, meal: state.meal.push(action.payload) }

        case DEL_MEAL:
        // return { ...state, meal: state.meal.filter(meal => meal.id !== action.payload) }

        default:
            return state
    }
}

export default reducer