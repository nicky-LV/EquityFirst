import {useEffect, useState} from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import axios from 'axios';

enum websocketEnum {
    INITIALIZE = "initialize",
    UPDATE = "update"
}

interface dataType{
    time: string
    price: Number
}

interface graphProps{
    height: number
    width: number
}

const Graph = (props: any) => {
    const [websocketInstance, setWebsocketInstance] = useState<any>(null);
    const [intradayData, setIntraDayData] = useState<dataType[] | []>([]);
    const [movingAverage, setMovingAverage] = useState<dataType | []>([]);
    useEffect(() => {

        const ws = new WebSocket("ws://127.0.0.1:8000/datastream/")
        // if our websocket connection is accepted, we will send a request to initialize dataflow.
        ws.onopen = () => {
            ws.send(websocketEnum.INITIALIZE)
            setWebsocketInstance(ws)
        }

        ws.onmessage = async (payload) => {
            const data = JSON.parse(payload.data)
            await setIntraDayData(prevState => prevState.concat(data))
            await getMovingAverage(data)

        }

        ws.onclose = () => {
            console.log("websocket closed")
        }
    }, [])

    function getMovingAverage(data){
        console.log(`data: ${data}`)
        axios.post("http://127.0.0.1:8000/api/moving_average/", {data: data})
            .then( response => setMovingAverage(response.data))
            .catch( error => console.log(error.response.data))
    }

    return(
        <LineChart data={intradayData} height={props.height} width={props.width}>
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            <CartesianGrid stroke="#ccc" />
            <YAxis type="number" domain={['auto', 'auto']}/>
            <XAxis dataKey="time" />
        </LineChart>
    )
}

export default Graph