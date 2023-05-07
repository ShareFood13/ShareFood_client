import { SAVE_SHOP_LIST, UPTADE_SHOP_LIST, GETALL_SHOP_LIST, GET_SHOP_LIST, DEL_SHOP_LIST, ERROR_MSG } from "../constants/constantsTypes";
import * as api from "../api"

export const saveShopList = (shopList) => async (dispatch) => {

    try {
        const { data } = await api.saveShopList(shopList)

        dispatch({ type: SAVE_SHOP_LIST, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const updateShopList = (_id, updatedShopList) => async (dispatch) => {

    try {
        const { data } = await api.updateShopList(_id, updatedShopList)

        dispatch({ type: UPTADE_SHOP_LIST, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const getAllShopList = (_id) => async (dispatch) => {

    try {
        const { data } = await api.getAllShopList(_id)

        dispatch({ type: GETALL_SHOP_LIST, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const getShopList = (listId) => async (dispatch) => {

    try {
        const { data } = await api.getShopList(listId)

        dispatch({ type: GET_SHOP_LIST, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}

export const delShopList = (listId) => async (dispatch) => {

    try {
        const { data } = await api.delShopList(listId)

        dispatch({ type: DEL_SHOP_LIST, payload: data })
    } catch (error) {

        dispatch({ type: ERROR_MSG, payload: error })
    }
}