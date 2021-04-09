import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import store from "../../redux/store";

import {SET_INTRADAY_WEBSOCKET} from "../../redux/constants";


import {websocketTypeEnum, websocketJSON, intradayData} from "../../ts/types";
import {useToasts} from "react-toast-notifications";

const Graph = (props: any) => {
    const [websocketInstance, setWebsocketInstance] = useState<WebSocket | null>(null);
    const [intradayData, setIntraDayData] = useState<intradayData[] | []>([]);

    const reduxTimeScale: string = useSelector((state : RootState) => state.timeScale)
    const reduxSelectedEquity: string = useSelector((state : RootState) => state.selectedEquity)

    const toast = useToasts()

    useEffect(() => {
        // Subscribe to Redux timeScale changes
        //@ts-ignore
        const unsubscribe = store.subscribe(() => equitySubscriber(reduxSelectedEquity))
        // if timeScale is 1D, minute-updated intraday data is shown.
        if (reduxTimeScale === "1D"){ // todo: is this line needed?
            const ws: WebSocket = new WebSocket("ws://127.0.0.1:8000/realtime-data/")
            // setup redux intraday websocket
            store.dispatch({
                type: SET_INTRADAY_WEBSOCKET,
                payload: ws
            })

            ws.onopen = function(){
                setWebsocketInstance(ws)

                ws.send(
                    JSON.stringify({
                        type: websocketTypeEnum.GROUP,
                        selectedEquity: reduxSelectedEquity
                    })
                )
            }

            ws.onmessage = function(data){
                const response = JSON.parse(data.data)
                if (response.ERROR) {
                    toast.addToast(response.ERROR.toString(), {
                            appearance: "warning",
                            autoDismiss: true
                        }
                    )
                }
            }
        }
        console.log("remounted")
    }, [])

    return(
        <div>
            "Graph goes here"
        </div>
    )
}

function changeGroup(){
    const intradayWebsocket = store.getState().intradayWebsocket
    const selectedEquity: string = store.getState().selectedEquity

    console.log(selectedEquity)

    if (intradayWebsocket){
        intradayWebsocket.send(
            JSON.stringify({
                type: websocketTypeEnum.GROUP,
                selectedEquity: selectedEquity
            } as websocketJSON)
        )
    }
}

function equitySubscriber(prevEquity){
    const newEquity = store.getState().selectedEquity
    if (newEquity !== prevEquity){
        changeGroup()
    }
}

export default Graph