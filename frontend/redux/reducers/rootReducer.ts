import {
    SET_HISTORICAL_DATA,
    SET_REALTIME_WS,
    SET_SELECTED_EQUITY,
    SET_TECHNICAL_INDICATOR,
    SET_TICKER_OPTIONS,
    SET_TIMESCALE,
    technicalIndicatorCombos
} from "../constants";
import {initialStoreStateType, REALTIME_WS_ENUM, TIMESCALE} from "../../ts/types";

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
            /** Sets the technical indicator within the redux store and finds overlapping
             * "allowed" technical indicators which can be chosen by the user. **/


            const comboList: any = []
            const possibleIndicators: string[] = []

            // Updates comboList with the "possible" indicators that the user can choose.
            if (storeState.technicalIndicators.length >= 1){
                for (let i=0; i<storeState.technicalIndicators.length; i++){
                    const technicalIndicator = storeState.technicalIndicators[i]
                    comboList.push(technicalIndicatorCombos[technicalIndicator])
                }
            }

            // Check if an indicator is in every "possible" combination in comboList. If so, it's valid.
            // If an indicator has to be present in *all* combos, then we can just check which indicators are valid
            // in the first combo.

            if (comboList.length >= 1){
                const first_entry = comboList[0]
                first_entry.forEach((possibleIndicator: string) => {
                    let indicatorCount: number = 0
                    comboList.forEach((combo) => {
                        if (combo.includes(possibleIndicator)){
                            indicatorCount++
                        }
                    })

                    if (indicatorCount == comboList.length){
                        possibleIndicators.push(possibleIndicator)
                    }
                })
            }

            return Object.assign({}, storeState, {
                technicalIndicators: storeState.technicalIndicators.concat(dispatch.payload),
                allowedTechnicalIndicators: possibleIndicators
            })

        case SET_TIMESCALE:
            switch (dispatch.payload){
                default:
                    return Object.assign({}, storeState, {timescale: dispatch.payload})
            }

        case SET_REALTIME_WS:
            return Object.assign({}, storeState, {realtimeWS: dispatch.payload})

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
    technicalIndicators: ["SMA"],
    allowedTechnicalIndicators: technicalIndicatorCombos["SMA"]
}

