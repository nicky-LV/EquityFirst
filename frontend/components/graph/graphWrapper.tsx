import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import store from "../../redux/store";

import {
    SET_INTRADAY_WEBSOCKET,
    SET_HISTORICAL_DATA,
    SET_INTRADAY_DATA
} from "../../redux/constants";


import {websocketTypeEnum, websocketJSON, intradayData} from "../../ts/types";
import {useToasts} from "react-toast-notifications";
import CandlestickChart from "./candlestick";

const GraphWrapper = (props: any) => {

    let reduxSelectedEquity: string = useSelector((state : RootState) => state.selectedEquity)
    const reduxTimeScale: string = useSelector((state : RootState) => state.timeScale)
    // todo: set type
    const historicalData: any = useSelector((state : RootState) => state.historicalData)

    const toast = useToasts()
    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribeEquity = store.subscribe(() => equitySubscriber())
        const ws: WebSocket = new WebSocket("ws://127.0.0.1:8000/realtime-data/")

        ws.onopen = function(){
            // Set Websocket instance in redux store for across-app calling.
            store.dispatch({
                type: SET_INTRADAY_WEBSOCKET,
                payload: ws
            })

            // Initialize a group for the client
            ws.send(
                JSON.stringify({
                    type: websocketTypeEnum.GROUP,
                    selectedEquity: reduxSelectedEquity
                })
            )
        }

        ws.onmessage = function(response){
            const data = JSON.parse(response.data)

            switch (data.STATUS){
                case "ERROR":
                    toast.addToast(data.DATA.toString(), {
                            appearance: "warning",
                            autoDismiss: true
                        }
                    )
                    break;

                case "INTRADAY":
                    const _intradayData = JSON.parse(data.DATA)
                    dispatch({
                        type: SET_INTRADAY_DATA,
                        payload: _intradayData
                    })
                    break;

                case "HISTORICAL":
                    const historicalData = JSON.parse(data.DATA)
                    dispatch({
                        type: SET_HISTORICAL_DATA,
                        payload: historicalData
                    })
                    break;
            }
        }

        function updateEquity(newEquity){
            reduxSelectedEquity = newEquity
        }

        return function cleanup(){
            unsubscribeEquity()
        }
    }, [])

    function equitySubscriber(){
        const newEquity = store.getState().selectedEquity
        if (newEquity !== reduxSelectedEquity){
            changeGroup()
        }

        reduxSelectedEquity = newEquity
    }



    return(
        historicalData !== null && <CandlestickChart />
    )
}

function changeGroup(){
    const intradayWebsocket = store.getState().intradayWebsocket
    const selectedEquity: string = store.getState().selectedEquity

    if (intradayWebsocket){
        intradayWebsocket.send(
            JSON.stringify({
                type: websocketTypeEnum.GROUP,
                selectedEquity: selectedEquity
            } as websocketJSON)
        )
    }
}

export default GraphWrapper