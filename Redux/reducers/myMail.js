import { GET_MY_MAILS, GET_SENDED_MAILS, DEL_MY_MAIL, CREATE_MY_MAIL, CLEAR_MSG, MAIL_VIEW } from '../constants/constantsTypes'

const reducer = (state = { myMail: [] }, action) => {
    switch (action.type) {
        case CREATE_MY_MAIL:

            return { ...state, myMail: [...state.myMail, action.payload.myMail], message: action.payload.message }
        case GET_MY_MAILS:

            return { ...state, myMails: action.payload.myMails }
        case GET_SENDED_MAILS:

            return { ...state, sendedMails: action.payload.sendedMails }
        case DEL_MY_MAIL:

            return { ...state, myMails: action.payload.myMails, message: action.payload.message }
        case MAIL_VIEW:

            return { ...state, myMails: action.payload.myMails }
        case CLEAR_MSG:

            return { ...state, message: "" }
        default:
            return state
    }
}

export default reducer