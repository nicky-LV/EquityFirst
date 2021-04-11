import {SET_TICKER_OPTIONS, SET_SELECTED_EQUITY, SET_TECHNICAL_INDICATOR, SET_TIMESCALE, SET_INTRADAY_WEBSOCKET, SET_HISTORICAL_DATA, SET_INTRADAY_DATA} from "./constants";

interface intialStoreStateType {
    tickerOptions: string[] | [],
    selectedEquity: string,
    technicalIndicator: string | null,
    timeScale: string,
    updateScale: string,
    intradayWebsocket: WebSocket | null,
    historicalData: any,
    intradayData: any
}
const initialStoreState: intialStoreStateType = {
    tickerOptions: [],
    selectedEquity: "MSFT",
    technicalIndicator: "SMA",
    timeScale: "1D",
    updateScale: "Every minute",
    intradayWebsocket: null,
    historicalData: null,
    intradayData: null
}

export function rootReducer(storeState=initialStoreState, dispatch){
    switch (dispatch.type) {
        case SET_TICKER_OPTIONS:
            return Object.assign({}, storeState, {tickerOptions: dispatch.payload})

        case SET_SELECTED_EQUITY:
            if (dispatch.payload === ""){
                return Object.assign({}, storeState)
            }

            else{
                return Object.assign({}, storeState, {selectedEquity: dispatch.payload})
            }

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

        case SET_INTRADAY_WEBSOCKET:
            return Object.assign({}, storeState, {intradayWebsocket: dispatch.payload})

        case SET_HISTORICAL_DATA:
            return Object.assign({}, storeState, {historicalData: dispatch.payload})

        case SET_INTRADAY_DATA:
            return Object.assign({}, storeState, {intradayData: dispatch.payload})

        default:
            return Object.assign({}, storeState)
    }
}