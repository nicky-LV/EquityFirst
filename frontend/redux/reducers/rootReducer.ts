import {
    REMOVE_TECHNICAL_INDICATOR,
    SET_HISTORICAL_DATA,
    SET_REALTIME_WS,
    SET_SELECTED_EQUITY,
    SET_TECHNICAL_INDICATOR,
    SET_TICKER_OPTIONS,
    SET_TIMESCALE,
    technicalIndicatorCombos,
} from "../constants";

import {initialStoreStateType, REALTIME_WS_ENUM, TIMESCALE, TECHNICAL_INDICATORS} from "../../ts/types";
import {useDispatch} from "react-redux";


export default function rootReducer(storeState=initialStoreState, dispatch){
    switch (dispatch.type) {
        case SET_TICKER_OPTIONS:
            return Object.assign({}, storeState, {tickerOptions: dispatch.payload})

        case SET_SELECTED_EQUITY:
            // Checks if realtime data websocket is established.
            // If so, we must tell the server to track the price of the new equity.
            if(storeState.realtimeWS){
                if (storeState.technicalIndicators.length >= 1){
                    storeState.realtimeWS.send(JSON.stringify({
                        type: REALTIME_WS_ENUM.CHANGE_EQUITY,
                        equity: dispatch.payload,
                        technicalIndicators: storeState.technicalIndicators
                    }))
                }

                else {
                    storeState.realtimeWS.send(JSON.stringify({
                        type: REALTIME_WS_ENUM.CHANGE_EQUITY,
                        equity: dispatch.payload,
                    }))
                }
                return Object.assign({}, storeState, {selectedEquity: dispatch.payload})
            }

            else{
                return Object.assign({}, storeState, {selectedEquity: dispatch.payload})
            }

        case SET_TECHNICAL_INDICATOR:
            /** Sets the technical indicator within the redux store and finds overlapping
             * "allowed" technical indicators which can be chosen by the user. **/

            let validIndicators: string[] = []

            if (storeState.allowedTechnicalIndicators.length >= 1){
                // Populate possible combos.
                const indicator_combos: string[][] = []
                storeState.technicalIndicators.forEach((indicator_) => {
                    indicator_combos.push(technicalIndicatorCombos[indicator_])
                })
                // Concat the combo from the indicator we want to select.
                indicator_combos.push(technicalIndicatorCombos[dispatch.payload])

                const first_combo = indicator_combos[0]
                first_combo.forEach((indicator) => {
                    let count = 0;
                    indicator_combos.forEach((combo) => {
                        if (combo.includes(indicator)){
                            count++
                        }

                        else{
                            console.log(combo + " doesn't include " + indicator)
                        }
                    })

                    if (count == indicator_combos.length){
                        validIndicators.push(indicator)
                    }

                })
            }

            else {
                validIndicators = technicalIndicatorCombos[dispatch.payload]
            }


            /** Update redux store **/
            return Object.assign({}, storeState, {
                technicalIndicators: storeState.technicalIndicators.concat(dispatch.payload),
                allowedTechnicalIndicators: validIndicators
            })

        case REMOVE_TECHNICAL_INDICATOR:
            // Remove technical indicator from redux store
            let validIndicators_: string[] = []
            if (storeState.technicalIndicators.length == 1) {
                validIndicators_ = Object.keys(TECHNICAL_INDICATORS)
            }

            else {
                // todo: here
                validIndicators_ = getValidIndicatorCombos(storeState, dispatch)
            }

            return Object.assign({}, storeState, {
                technicalIndicators: storeState.technicalIndicators.filter((indicator) => indicator !== dispatch.payload),
                allowedTechnicalIndicators: validIndicators_
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

function getValidIndicatorCombos(storeState, payload){
    // array of possibly valid indicators
    const comboList: any = []

    // array of valid indicators.
    let validIndicators: string[] = []

    // Updates comboList with the "possible" indicators that the user can choose.
    if (storeState.technicalIndicators.length >= 1){
        for (let i=0; i<storeState.technicalIndicators.length; i++){
            const technicalIndicator = storeState.technicalIndicators[i]
            comboList.push(technicalIndicatorCombos[technicalIndicator])
        }

        /** Get valid indicator combinations **/
        if (comboList.length >= 1){
            const first_entry = comboList[0]
            first_entry.forEach((possibleIndicator: string) => {
                let indicatorCount: number = 0
                comboList.forEach((combo) => {
                    if (combo.includes(possibleIndicator)){
                        indicatorCount++
                    }
                })

                // If indicator is in each valid combination, it's a valid choice.
                if (indicatorCount == comboList.length){
                    validIndicators.push(possibleIndicator)
                }
            })
        }
    }

    else {
        validIndicators = Object.keys(TECHNICAL_INDICATORS)
    }

    return validIndicators
}

export const initialStoreState: initialStoreStateType = {
    selectedEquity: "MSFT",
    timescale: TIMESCALE.DAY,
    realtimeWS: null,
    technicalIndicators: ["SMA"],
    allowedTechnicalIndicators: technicalIndicatorCombos["SMA"]
}

