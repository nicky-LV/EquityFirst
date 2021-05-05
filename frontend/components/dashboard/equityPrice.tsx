import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {getClosePrice} from "../../pages/api/getClosePrice";

import {PERCENTAGE_TYPE_ENUM} from "../../ts/types";

const EquityPrice = () => {
    const [price, updatePrice] = useState(0);
    const [type, setPercentageType] = useState<PERCENTAGE_TYPE_ENUM | null>(null);
    const equity = useSelector((store: RootState) => store.selectedEquity)

    const remaining_time = remaining_seconds_today()
    const request = useQuery('get-close-price', () => getClosePrice(equity), {cacheTime: remaining_time})

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8000/realtime-price/${equity}/`)
        ws.onmessage = (data) => {
            updatePrice(data.data)
        }
    }, [])

    let percentage: number
    let increaseType: PERCENTAGE_TYPE_ENUM;
    if(request.isSuccess){
        percentage = ((request.data.data.close - price) / request.data.data.close) * 100
        if (percentage > 0){
            increaseType = PERCENTAGE_TYPE_ENUM.INCREASE
        }

        else{
            increaseType = PERCENTAGE_TYPE_ENUM.DECREASE
        }
    }

    return (
        <div>
            <StatGroup>
                <Stat>
                    <StatLabel>{equity}</StatLabel>
                    <StatNumber>$ {price}</StatNumber>
                    <StatHelpText>
                        <StatArrow type={increaseType} />
                        {percentage.toFixed(2)}% {type} today
                    </StatHelpText>
                </Stat>
            </StatGroup>
        </div>
    )
}

const remaining_seconds_today = () : number => {
    const now = new Date()
    const seconds_in_day = 86400
    const seconds_elapsed_today = (now.getHours() * (60**2)) + (now.getMinutes() * 60) + (now.getSeconds())

    return seconds_in_day - seconds_elapsed_today
}

export default EquityPrice