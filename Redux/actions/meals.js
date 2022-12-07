import { GET_MEALS, UPDATE_MEAL, DEL_MEAL, CREATE_MEAL } from "../constants/constantsTypes";
import * as api from "../api"

export const createMeal = (meal) => async (dispatch) => {
    console.log('====================================');
    console.log("createMeal", meal);
    console.log('====================================');
    try {

        const { data } = await api.createMeal(meal)

        dispatch({ type: CREATE_MEAL, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const getMeals = (_id) => async (dispatch) => {
    // console.log("getMeals", _id);
    try {

        const { data } = await api.getMeals(_id)

        // console.log("getMeals data:", data);

        dispatch({ type: GET_MEALS, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const updateMeal = (meal, _id) => async (dispatch) => {
    try {

        const { data } = await api.updateMeal(meal, _id)

        dispatch({ type: UPDATE_MEAL, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const deleteMeal = (mealId) => async (dispatch) => {
    console.log("deleteMeal:", mealId);
    try {

        const { data } = await api.deleteMeal(mealId)

        dispatch({ type: DEL_MEAL, payload: data })

    } catch (error) {
        console.log(error)
    }
}


