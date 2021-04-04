import {SET_TICKER_OPTIONS, SET_SELECTED_TICKER} from "./constants";

interface intialStoreStateType {
    tickerOptions: [string] | [],
    selectedTicker: string
}
const initialStoreState: intialStoreStateType = {
    tickerOptions: [],
    selectedTicker: "MSFT"

}

export function rootReducer(storeState=initialStoreState, dispatch){
    switch (dispatch.type) {
        case SET_TICKER_OPTIONS:
            return Object.assign({}, storeState, {tickerOptions: dispatch.payload})

        case SET_SELECTED_TICKER:
            return Object.assign({}, storeState, {selectedTicker: dispatch.payload})
    }
}