import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ArrowSmDownIcon, ArrowSmUpIcon} from '@heroicons/react/solid'
import {useEffect, useRef, useState} from "react";
import {useQuery} from "react-query";
import {getClosePrice} from "../../pages/api/getClosePrice";

import {PERCENTAGE_TYPE} from "../../ts/types";
import {SET_REALTIME_WS} from "../../redux/constants";

function classNames(...classes){
    return classes.join(" ")
}
const EquityPrice = () => {
    const [price, updatePrice] = useState<number | null>(null);
    const [width, setWidth] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const equity = useSelector((store: RootState) => store.selectedEquity)

    const request = useQuery('get-close-price', () => getClosePrice(equity))
    const dispatch = useDispatch()

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8000/realtime-price/${equity}/`)
        dispatch({
            type: SET_REALTIME_WS,
            payload: ws
        })
        ws.onmessage = (data) => {
            updatePrice(parseFloat(data.data))
        }

        setLoaded(true);
    }, [])

    let percentage: number;
    let increaseType: PERCENTAGE_TYPE;
    if(request.isSuccess){
        percentage = (((price - request.data.data.close) / request.data.data.close) * 100)
        if (percentage > 0){
            increaseType = PERCENTAGE_TYPE.INCREASE
        }

        else{
            increaseType = PERCENTAGE_TYPE.DECREASE
        }
    }

    return (
        <div className="mx-4 overflow-hidden sm:p-6">
            <p className="text-sm font-medium text-white truncate">{equity}</p>
                <p className="my-1 text-3xl font-semibold text-white">$ {price && price.toFixed(2)}</p>
                <div className="mt-1 inline-block">
                    <div className={classNames(increaseType === PERCENTAGE_TYPE.INCREASE ? "bg-green-100" : "bg-red-100", "rounded-full flex flex-grow-0 items-center content-start px-3")}>
                        {increaseType === PERCENTAGE_TYPE.INCREASE ?
                            <ArrowSmUpIcon
                                className="flex-shrink-0 h-5 w-5 text-green-800"
                                aria-hidden="true"
                            />

                            :

                            <ArrowSmDownIcon
                                className="flex-shrink-0 h-5 w-5 text-red-800"
                                aria-hidden="true"
                            />

                        }
                        {percentage > 0 ?
                            <p className="text-sm text-green-800 ml-0.5 mb-0">{percentage.toFixed(2)}%</p>
                            :
                            <p className="text-sm text-red-800 ml-0.5 mb-0">{(-1 * percentage).toFixed(2)}%</p>
                        }
                    </div>
                </div>
        </div>
    )
}

export default EquityPrice