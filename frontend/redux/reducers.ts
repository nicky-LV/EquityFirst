import {SET_TICKER_OPTIONS, SET_SELECTED_EQUITY, SET_TECHNICAL_INDICATOR, SET_TIMESCALE, SET_INTRADAY_WEBSOCKET, SET_HISTORICAL_DATA, SET_INTRADAY_DATA} from "./constants";
import {TIMESCALE_ENUM} from "../ts/types";

interface intialStoreStateType {
    tickerOptions: string[] | [],
    selectedEquity: string,
    technicalIndicator: string | null,
    timescale: string,
    updateScale: string,
    intradayWebsocket: WebSocket | null,
    historicalData: any,
    data: any,
    intradayData: any
}
const initialStoreState: intialStoreStateType = {
    tickerOptions: [],
    selectedEquity: "MSFT",
    technicalIndicator: "SMA",
    timescale: TIMESCALE_ENUM.DAY,
    updateScale: "Every minute",
    intradayWebsocket: null,
    historicalData: null,
    data: null,
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
            const data = storeState.historicalData[dispatch.payload] || null
            console.log(data)
            switch (dispatch.payload){
                case TIMESCALE_ENUM.DAY:
                    return Object.assign({}, storeState,
                        {
                            data: data,
                            timescale: dispatch.payload,
                            updateScale: "Every minute"})

                case TIMESCALE_ENUM.WEEK:
                    return Object.assign({}, storeState,
                        {
                            data: data,
                            timescale: dispatch.payload,
                            updateScale: "Daily"
                        })
                case TIMESCALE_ENUM.MONTH:
                    return Object.assign({}, storeState,
                        {
                            data: data,
                            timescale: dispatch.payload,
                            updateScale: "Daily"
                        })
                case TIMESCALE_ENUM.YEAR:
                    return Object.assign({}, storeState,
                        {
                            data: data,
                            timescale: dispatch.payload,
                            updateScale: "Daily"})
                default:
                    return Object.assign({}, storeState,
                        {
                            data: initialStoreState.historicalData[TIMESCALE_ENUM.DAY],
                            timeScale: TIMESCALE_ENUM.DAY,
                            updateScale: "Every minute"
                        })
            }

        case SET_INTRADAY_WEBSOCKET:
            return Object.assign({}, storeState, {intradayWebsocket: dispatch.payload})

        /**
         * Sets the splitted historical data into the redux store.
         * Sets the "initial" data in the "data" key of the redux store.
         */
        case SET_HISTORICAL_DATA:
            const timescale = storeState.timescale
            return Object.assign({}, storeState, {
                data: dispatch.payload[timescale],
                historicalData: {
                    [TIMESCALE_ENUM.DAY]: dispatch.payload[TIMESCALE_ENUM.DAY],
                    [TIMESCALE_ENUM.WEEK] : dispatch.payload[TIMESCALE_ENUM.WEEK],
                    [TIMESCALE_ENUM.MONTH] : dispatch.payload[TIMESCALE_ENUM.MONTH],
                    [TIMESCALE_ENUM.YEAR] : dispatch.payload[TIMESCALE_ENUM.YEAR]
                }

            })

        case SET_INTRADAY_DATA:
            return Object.assign({}, storeState, {intradayData: dispatch.payload})

        default:
            return Object.assign({}, storeState)
    }
}