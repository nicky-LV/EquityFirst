import {SET_TICKER_OPTIONS, SET_SELECTED_EQUITY, SET_TECHNICAL_INDICATOR, SET_TIMESCALE} from "./constants";

interface intialStoreStateType {
    tickerOptions: string[] | [],
    selectedEquity: string,
    technicalIndicator: string | null,
    timeScale: string,
    updateScale: string,
    intradayWebsocket: WebSocket | null
}
const initialStoreState: intialStoreStateType = {
    tickerOptions: [],
    selectedEquity: "MSFT",
    technicalIndicator: "SMA",
    timeScale: "1D",
    updateScale: "Every minute",
    intradayWebsocket: null
}

export function rootReducer(storeState=initialStoreState, dispatch){
    switch (dispatch.type) {
        case SET_TICKER_OPTIONS:
            return Object.assign({}, storeState, {tickerOptions: dispatch.payload})

        case SET_SELECTED_EQUITY:
            return Object.assign({}, storeState, {selectedEquity: dispatch.payload})

        case SET_TECHNICAL_INDICATOR:
            return Object.assign({}, storeState, {technicalIndicator: dispatch.payload})

        case SET_TIMESCALE:
            switch (dispatch.payload){
                case "1D":
                    return Object.assign({}, storeState,
                        {
                            timeScale: dispatch.payload,
                            updateScale: "Every minute"})

                case "1W":
                    return Object.assign({}, storeState,
                        {
                            timeScale: dispatch.payload,
                            updateScale: "Daily"
                        })
                case "1M":
                    return Object.assign({}, storeState,
                        {
                            timeScale: dispatch.payload,
                            updateScale: "Daily"
                        })
                case "1Y":
                    return Object.assign({}, storeState,
                        {
                            timeScale: dispatch.payload,
                            updateScale: "Daily"})
                default:
                    return Object.assign({}, storeState,
                        {
                            timeScale: "1D",
                            updateScale: "Every minute"
                        })
            }

        default:
            return Object.assign({}, storeState)
    }
}