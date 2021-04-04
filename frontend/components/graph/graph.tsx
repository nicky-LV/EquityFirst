import {useEffect, useState} from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
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

    function getMovingAverage(data){
        console.log(`data: ${data}`)
        axios.post("http://127.0.0.1:8000/api/moving_average/", {data: data})
            .then( response => setMovingAverage(response.data))
            .catch( error => console.log(error.response.data))
    }

    return(
        <LineChart data={intradayData} height={props.height} width={props.width}>
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>

            <YAxis type="number" domain={['auto', 'auto']}/>
            <XAxis dataKey="time" />
            <Tooltip />
        </LineChart>
    )
}

export default Graph