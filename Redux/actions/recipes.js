import { CREATE, FETCH_MY_RECIPES, UPDATE, FETCH_RECIPE, DELETE } from "../constants/constantsTypes";
import * as api from "../api"

export const createRecipe = (recipeForm) => async (dispatch) => {
    try {

        const { data } = await api.createRecipe(recipeForm)

        dispatch({ type: CREATE, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const getMyRecipes = (_id) => async (dispatch) => {
    try {

        const { data } = await api.fetchMyRecipes(_id)

        dispatch({ type: FETCH_MY_RECIPES, payload: { recipe: data } })

    } catch (error) {
        console.log(error)

    }
}

export const updateRecipe = (_id, recipe) => async (dispatch) => {
    try {

        const { data } = await api.updateRecipe(_id, recipe)

        dispatch({ type: UPDATE, payload: data })

    } catch (error) {
        console.log(error)
    }
}

// export const getRecipesByCreator = (id) => async (dispatch) => {
//     try {

//         const { data } = await api.fetchRecipesByCreator(id)

//         dispatch({ type: FETCH_RECIPES, payload: { recipe: data } })

//     } catch (error) {
//         console.log(error)

//     }
// }



export const deleteRecipe = (_id) => async (dispatch) => {
    try {

        await api.deleteRecipe(_id)

        dispatch({ type: DELETE, payload: _id })


    } catch (error) {
        console.log(error)
    }
}