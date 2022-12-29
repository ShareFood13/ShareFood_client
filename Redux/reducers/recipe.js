import { CREATE, FETCH_MY_RECIPES, FETCH_RECIPE, DELETE, UPDATE } from '../constants/constantsTypes'

const reducer = (state = { recipe: [] }, action) => {
    switch (action.type) {
        case CREATE:

            return { ...state, recipes: [...state.recipe, action.payload.recipe], message: action.payload.message }
        case FETCH_MY_RECIPES:

            return { ...state, recipes: action.payload.recipes }
        case FETCH_RECIPE:
            return { ...state, recipe: action.payload.recipe }

        case UPDATE:
            return { ...state, recipe: state.recipe.push(action.payload) }

        case DELETE:
            return { ...state, recipes: state.recipe.filter(recipe => recipe.id !== action.payload) }

        default:
            return state
    }
}

export default reducer