import { GET_EVENTS, UPDATE_EVENT, DEL_EVENT, CREATE_EVENT, ADD_RECIPE_TO, CLEAR_MSG } from "../constants/constantsTypes";

const reducer = (state = { events: [], message: "" }, action) => {

    switch (action.type) {
        case CREATE_EVENT:

            return { ...state, events: [...state.events, action.payload.events], message: action.payload.message }
        case GET_EVENTS:

            return { ...state, events: action.payload.events }
        case UPDATE_EVENT:
            // return { ...state, events: state.events.push(action.payload) }
            return { ...state, events: [...state.events, action.payload.events], message: action.payload.message }
        case DEL_EVENT:
            // return { ...state, event: state.event.filter(event => event.id !== action.payload) }
            return { ...state, events: [...state.events, action.payload.events], message: action.payload.message }
        case CLEAR_MSG:

            return { ...state, message: "" }
        default:
            return state
    }
}

export default reducer