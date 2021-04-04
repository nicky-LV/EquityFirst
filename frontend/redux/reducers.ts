import {SET_TICKER_OPTIONS, SET_SELECTED_EQUITY} from "./constants";

interface intialStoreStateType {
    tickerOptions: [string] | [],
    selectedEquity: string
}
const initialStoreState: intialStoreStateType = {
    tickerOptions: [],
    selectedEquity: "MSFT"
}

export function rootReducer(storeState=initialStoreState, dispatch){
    switch (dispatch.type) {
        case SET_TICKER_OPTIONS:
            return Object.assign({}, storeState, {tickerOptions: dispatch.payload})

        case SET_SELECTED_EQUITY:
            return Object.assign({}, storeState, {selectedTicker: dispatch.payload})

        default:
            return Object.assign({}, storeState)
    }
}