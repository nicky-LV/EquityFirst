import {createStore} from "redux";
import {combineReducers} from "redux";
import DataReducer from "./reducers/dataReducer";
import rootReducer from "./reducers/rootReducer";

const mainReducer = combineReducers({technical: DataReducer, info: rootReducer})
const store = createStore(mainReducer)

export default store
window.store = store;
export type RootState = ReturnType<typeof store.getState>