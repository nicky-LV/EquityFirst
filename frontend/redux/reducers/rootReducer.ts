import {SET_TICKER_OPTIONS, SET_SELECTED_EQUITY, SET_TECHNICAL_INDICATOR, SET_TIMESCALE, SET_HISTORICAL_DATA, SET_REALTIME_WS, SET_TECHNICAL_INDICATOR_LIST} from "../constants";
import {TIMESCALE, REALTIME_WS_ENUM, initialStoreStateType} from "../../ts/types";

export default function rootReducer(storeState=initialStoreState, dispatch){
    switch (dispatch.type) {
        case SET_TICKER_OPTIONS:
            return Object.assign({}, storeState, {tickerOptions: dispatch.payload})

        case SET_SELECTED_EQUITY:
            // Checks if realtime data websocket is established.
            // If so, we must tell the server to track the price of the new equity.
            if(storeState.realtimeWS) {
                storeState.realtimeWS.send(JSON.stringify({
                    type: REALTIME_WS_ENUM.CHANGE_EQUITY,
                    equity: dispatch.payload
                }))
                return Object.assign({}, storeState, {selectedEquity: dispatch.payload})
            }

            else{
                return Object.assign({}, storeState, {selectedEquity: dispatch.payload})
            }

        case SET_TECHNICAL_INDICATOR:
            return Object.assign({}, storeState, {technicalIndicator: dispatch.payload})

        case SET_TIMESCALE:
            switch (dispatch.payload){
                default:
                    return Object.assign({}, storeState, {timescale: dispatch.payload})
            }

        case SET_REALTIME_WS:
            return Object.assign({}, storeState, {realtimeWS: dispatch.payload})

        case SET_TECHNICAL_INDICATOR_LIST:
            return Object.assign({}, storeState, {technicalIndicatorList: dispatch.payload})

        /**
         * Sets the split historical data into the redux store.
         * Sets the "initial" data in the "data" key of the redux store.
         */
        case SET_HISTORICAL_DATA:
            const timescale = storeState.timescale
            return Object.assign({}, storeState, {
                data: dispatch.payload[timescale],
                historicalData: {
                    [TIMESCALE.DAY]: dispatch.payload[TIMESCALE.DAY],
                    [TIMESCALE.WEEK] : dispatch.payload[TIMESCALE.WEEK],
                    [TIMESCALE.MONTH] : dispatch.payload[TIMESCALE.MONTH],
                    [TIMESCALE.YEAR] : dispatch.payload[TIMESCALE.YEAR]
                }

            })

        /*
        case SET_INTRADAY_DATA:
            return Object.assign({}, storeState, {intradayData: dispatch.payload})
        */

        default:
            return Object.assign({}, storeState)
    }
}
export const initialStoreState: initialStoreStateType = {
    selectedEquity: "MSFT",
    timescale: TIMESCALE.DAY,
    realtimeWS: null,
    technicalIndicator: "SMA",
    allowedTechnicalIndicators: [],
    technicalIndicatorList: []
}

