import { GET_EVENTS, UPDATE_EVENT, DEL_EVENT, CREATE_EVENT, ADD_RECIPE_TO } from "../constants/constantsTypes";

const reducer = (state = { event: [] }, action) => {
    switch (action.type) {
        case CREATE_EVENT:
            return { ...state, event: [...state.event, action.payload] }

        case GET_EVENTS:
            // console.log("action", action);
            return { ...state, events: action.payload }

        case UPDATE_EVENT:
            return { ...state, event: state.event.push(action.payload) }

        case DEL_EVENT:
        // return { ...state, event: state.event.filter(event => event.id !== action.payload) }

        case ADD_RECIPE_TO:
            console.log(state.event);
        // return { ...state, event: state.event.push(action.payload) }

        default:
            return state
    }
}

export default reducer