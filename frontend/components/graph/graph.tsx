import {useEffect, useState} from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

enum websocketEnum {
    INITIALIZE = "initialize",
    UPDATE = "update"
}

interface dataType{
    time: string
    price: Number
}

const Graph = (props: any) => {
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
            console.log(data)
            setIntraDayData(prevState => prevState.concat(data))
        }

        ws.onclose = () => {
            console.log("websocket closed")
        }
    }, [])

    return(
        <LineChart data={intradayData} height={500} width={2000}>
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            <CartesianGrid stroke="#ccc" />
             <YAxis type="number" domain={['auto', 'auto']}/>
            <XAxis dataKey="time" />
        </LineChart>
    )
}

export default Graph