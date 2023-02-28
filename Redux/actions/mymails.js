import { GET_MY_MAILS, GET_SENDED_MAILS, DEL_MY_MAIL, CREATE_MY_MAIL, MAIL_VIEW } from "../constants/constantsTypes";
import * as api from "../api"

export const createMyMail = (mail) => async (dispatch) => {

    try {

        const { data } = await api.createMyMail(mail)

        dispatch({ type: CREATE_MY_MAIL, payload: data })
    } catch (error) {

        console.log(error)
    }
}

export const getMyMails = (reciverId) => async (dispatch) => {

    try {

        const { data } = await api.getMyMails(reciverId)

        dispatch({ type: GET_MY_MAILS, payload: data })
    } catch (error) {

        console.log(error)
    }
}

export const getSendedMails = (senderId) => async (dispatch) => {

    try {

        const { data } = await api.getSendedMails(senderId)

        dispatch({ type: GET_SENDED_MAILS, payload: data })
    } catch (error) {

        console.log(error)
    }
}

export const deleteMyMail = (reciverId, listToDelete) => async (dispatch) => {

    try {

        const { data } = await api.delMyMail(reciverId, listToDelete)

        dispatch({ type: DEL_MY_MAIL, payload: data })
    } catch (error) {

        console.log(error)
    }
}

export const mailView = (mailId) => async (dispatch) => {

    try {

        const { data } = await api.mailView(mailId)

        dispatch({ type: MAIL_VIEW, payload: data })
    } catch (error) {

        console.log(error)
    }
}


