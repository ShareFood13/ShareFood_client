import { combineReducers } from "redux";

import auth from "./auth"
import recipe from "./recipe"
import event from "./event"
import meal from "./meal"
import myMail from "./myMail"
import other from "./other"

export default combineReducers({
    auth, recipe, event, meal, myMail, other
})