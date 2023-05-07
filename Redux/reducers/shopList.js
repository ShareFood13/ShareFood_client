import { SAVE_SHOP_LIST, UPTADE_SHOP_LIST, GETALL_SHOP_LIST, GET_SHOP_LIST, DEL_SHOP_LIST, ERROR_MSG, CLEAR_MSG } from "../constants/constantsTypes";

const reducer = (state = { shopLists: [], message: "" }, action) => {
    switch (action.type) {
        case SAVE_SHOP_LIST:

            // return { ...state, recipes: [...state.recipes, action.payload.recipes], message: action.payload.message }
            return { ...state, shopLists: action.payload.shopLists, message: action.payload.message }
        case UPTADE_SHOP_LIST:

            return { ...state, shopLists: action.payload.shopLists, message: action.payload.message }
        case GETALL_SHOP_LIST:

            return { ...state, shopLists: action.payload.shopLists }
        // case FETCH_RECIPE:

        //     return { ...state, recipes: action.payload.recipes }
        case DEL_SHOP_LIST:

            return { ...state, shopLists: action.payload.shopLists, message: action.payload.message }
        // case ERROR_MSG:

        //     return { ...state, message: action.payload.message }
        case CLEAR_MSG:

            return { ...state, message: "" }
        // case OTHER_RECIPES:

        //     return { ...state, otherRecipes: action.payload.otherRecipes }
        // case ADD_RECIPE_TO:

        //     if (action.payload.addTo === "event") {

        //         return { ...state, message: action.payload.data.message }
        //     } else {

        //         return { ...state, message: action.payload.data.message }
        //     }
        default:

            return state
    }
}

export default reducer