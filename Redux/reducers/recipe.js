import { CREATE, FETCH_MY_RECIPES, FETCH_RECIPE, UPDATE, DELETE, ERROR_MSG, CLEAR_MSG, ADD_RECIPE_TO, OTHER_RECIPES } from '../constants/constantsTypes'

const reducer = (state = { recipes: [], message: "" }, action) => {
    switch (action.type) {
        case CREATE:

            return { ...state, recipes: [...state.recipes, action.payload.recipes], message: action.payload.message }
        case FETCH_MY_RECIPES:

            return { ...state, recipes: action.payload.recipes }
        case FETCH_RECIPE:

            return { ...state, recipes: action.payload.recipes }
        case UPDATE:

            return { ...state, recipes: [...state.recipes, action.payload.recipes], message: action.payload.message }
        case DELETE:

            return { ...state, recipes: [...state.recipes, action.payload.recipes], message: action.payload.message }
        case ERROR_MSG:

            return { ...state, message: action.payload.message }
        case CLEAR_MSG:

            return { ...state, message: "" }
        case OTHER_RECIPES:

            return { ...state, otherRecipes: action.payload.otherRecipes }
        case ADD_RECIPE_TO:

            if (action.payload.addTo === "event") {

                return { ...state, message: action.payload.data.message }
            } else {

                return { ...state, message: action.payload.data.message }
            }
        default:

            return state
    }
}

export default reducer