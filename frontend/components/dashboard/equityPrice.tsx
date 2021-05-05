import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid'
import {useEffect, useState, useRef} from "react";
import {useQuery} from "react-query";
import {getClosePrice} from "../../pages/api/getClosePrice";

import {PERCENTAGE_TYPE_ENUM} from "../../ts/types";

const EquityPrice = () => {
    const [price, updatePrice] = useState<number | null>(null);
    const [type, setPercentageType] = useState<PERCENTAGE_TYPE_ENUM | null>(null);
    const [loaded, setLoaded] = useState(false);

    const equity = useSelector((store: RootState) => store.selectedEquity)
    const request = useQuery('get-close-price', () => getClosePrice(equity))
    const priceRef = useRef()

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8000/realtime-price/${equity}/`)
        ws.onmessage = (data) => {
            updatePrice(parseFloat(data.data))
        }

        setLoaded(true);
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
            <div className="mx-4 overflow-hidden sm:p-6">
                <p className="text-sm font-medium text-white truncate">{equity}</p>
                <div className="flex flex-column justify-content-start">
                    <p ref={priceRef} className="mt-1 text-3xl font-semibold text-white">$ {price && price.toFixed(2)}</p>
                    <div className="percentage-icon">
                        {increaseType === PERCENTAGE_TYPE_ENUM.INCREASE ?
                            <div className="flex flex-row align-items-center">
                                <ArrowSmUpIcon
                            className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                            aria-hidden="true"
                        />
                                <p className="text-sm text-green-500 ml-0.5">{percentage.toFixed(2)}%<span className="text-gray-200"> above close</span> </p>
                            </div>: <ArrowSmDownIcon
                            className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                            aria-hidden="true"
                        >{percentage}</ArrowSmDownIcon>}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EquityPrice