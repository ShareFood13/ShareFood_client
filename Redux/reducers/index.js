import { combineReducers } from "redux";

import auth from "./auth"
import recipe from "./recipe"
import event from "./event"
import meal from "./meal"

export default combineReducers({
    auth, recipe, event, meal
})