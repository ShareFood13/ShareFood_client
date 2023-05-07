import { CREATE, FETCH_MY_RECIPES, UPDATE, FETCH_RECIPE, DELETE, ERROR_MSG, ADD_RECIPE_TO, OTHER_RECIPES, OTHER_RECIPES_ERROR, ADD_RECIPE_TO_MEAL, ADD_RECIPE_TO_EVENT } from "../constants/constantsTypes";
import * as api from "../api"

export const createRecipe = (recipeForm) => async (dispatch) => {

    try {
        const { data } = await api.createRecipe(recipeForm)

        dispatch({ type: CREATE, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const getMyRecipes = (_id) => async (dispatch) => {
    try {
        const { data } = await api.fetchMyRecipes(_id)

        dispatch({ type: FETCH_MY_RECIPES, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const getRecipe = (_id) => async (dispatch) => {
    try {
        const { data } = await api.fetchRecipe(_id)

        // console.log("recipes getRecipe", data)
        dispatch({ type: FETCH_RECIPE, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const updateRecipe = (_id, recipe) => async (dispatch) => {
    try {
        const { data } = await api.updateRecipe(_id, recipe)

        dispatch({ type: UPDATE, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const deleteRecipe = (_id) => async (dispatch) => {

    try {
        const { data } = await api.deleteRecipe(_id)

        dispatch({ type: DELETE, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const addRecipeTo = (addTo, item) => async (dispatch) => {

    try {

        const { data } = await api.addRecipeTo(addTo, item)

        dispatch({ type: ADD_RECIPE_TO, payload: { data, addTo } })

    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const getotherrecipes = (_id) => async (dispatch) => {

    try {

        const { data } = await api.getOtherRecipes(_id)

        await dispatch({ type: OTHER_RECIPES, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, message: "OTHER_RECIPES ERROR" })
    }
}