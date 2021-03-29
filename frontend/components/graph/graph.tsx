import {useEffect, useState} from "react";

enum websocketEnum {
    INITIALIZE = "initialize",
    UPDATE = "update"
}

interface dataType{
    time: string
    price: Number
}

const D3Graph = (props: any) => {
    const [websocketInstance, setWebsocketInstance] = useState<any>(null);
    const [intradayData, setIntraDayData] = useState<dataType[] | []>([]);
    useEffect(() => {

        const ws = new WebSocket("ws://127.0.0.1:8000/datastream/")
        // if our websocket connection is accepted, we will send a request to initialize dataflow.
        ws.onopen = () => {
            ws.send(websocketEnum.INITIALIZE)
            setWebsocketInstance(ws)
        }

        ws.onmessage = (payload) => {
            const data = JSON.parse(payload.data)
            setIntraDayData((prevState: []) => {
                return prevState.concat(data)
            })
            console.log(data)
            console.log(intradayData)
        }

        ws.onclose = () => {
            console.log("websocket closed")
        }
    }, [])

    return(
        <button onClick={() => websocketInstance.send("update")}>Test channels</button>
    )
}

export default D3Graph