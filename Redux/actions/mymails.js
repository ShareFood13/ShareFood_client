import { GET_MY_MAILS, GET_SENDED_MAILS, DEL_MY_MAIL, CREATE_MY_MAIL } from "../constants/constantsTypes";
import * as api from "../api"

export const createMyMail = (mail) => async (dispatch) => {
    console.log("createMyMail", mail);
    try {

        const { data } = await api.createMyMail(mail)

        dispatch({ type: CREATE_MY_MAIL, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const getMyMeals = (reciverId) => async (dispatch) => {
    console.log("getMyMeals", reciverId);
    try {

        const { data } = await api.getMyMails(reciverId)

        // console.log("getMeals data:", data);

        dispatch({ type: GET_MY_MAILS, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const getSendedMails = (senderId) => async (dispatch) => {
    console.log("getSendedMails", senderId);
    try {

        const { data } = await api.getSendedMails(senderId)

        // console.log("getMeals data:", data);

        dispatch({ type: GET_SENDED_MAILS, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const deleteMyMail = (reciverId) => async (dispatch) => {
    console.log("deleteMyMail:", reciverId);
    try {

        const { data } = await api.delMyMail(reciverId)

        dispatch({ type: DEL_MY_MAIL, payload: data })

    } catch (error) {
        console.log(error)
    }
}


