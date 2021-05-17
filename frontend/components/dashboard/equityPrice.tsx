import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ArrowSmDownIcon, ArrowSmUpIcon} from '@heroicons/react/solid'
import {useEffect, useState} from "react";

import {PERCENTAGE_TYPE} from "../../ts/types";
import {SET_REALTIME_WS} from "../../redux/constants";

function classNames(...classes){
    return classes.join(" ")
}
const EquityPrice = () => {
    const [price, updatePrice] = useState<number | null>(null);
    const [percentage, setPercentage] = useState<number | null>(null);
    const [increaseType, setIncreaseType] = useState<PERCENTAGE_TYPE | null>(null);

    // Redux selected equity
    const equity = useSelector((store: RootState) => store.selectedEquity)
    const dispatch = useDispatch()

    useEffect(() => {
        // Realtime-data WS object.
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URI}/realtime-price/${equity}/`)

        // Saving WS object in store. (To send re-group request for new equity data).
        dispatch({
            type: SET_REALTIME_WS,
            payload: ws
        })

        // Handle server data.
        ws.onmessage = (data) => {
            const serverData: serverDataType = JSON.parse(data.data)
            console.log(serverData)
            const {price, close, type, percentage} = serverData

            // Update price state.
            updatePrice(() => price)

            // Update percentage.
            setPercentage(percentage)

            // Set percentage increase/decrease type.
            if (type === PERCENTAGE_TYPE.INCREASE){
                setIncreaseType(PERCENTAGE_TYPE.INCREASE)
            }
            else{
                setIncreaseType(PERCENTAGE_TYPE.DECREASE)
            }
        }
    }, [])


    return (
        <div className="mx-4 overflow-hidden sm:p-6">
            <p className="text-sm font-medium text-white truncate">{equity}</p>
            <p className="my-1 text-3xl font-semibold text-white">$ {price && price.toFixed(2)}</p>
            <div className="mt-1 inline-block">
                <div
                    className={classNames(increaseType === PERCENTAGE_TYPE.INCREASE ? "bg-green-100" : "bg-red-100", "rounded-full flex flex-grow-0 items-center content-start px-3")}>

                    {increaseType === PERCENTAGE_TYPE.INCREASE ?
                            <>
                                <ArrowSmUpIcon
                                    className="flex-shrink-0 h-5 w-5 text-green-800"
                                    aria-hidden="true"
                                />

                                <p className="text-sm text-green-800 ml-0.5 mb-0">{percentage.toFixed(2)}%</p>
                            </>

                            :
                            <>
                                <ArrowSmDownIcon
                                    className="flex-shrink-0 h-5 w-5 text-red-800"
                                    aria-hidden="true"
                                />
                                <p className="text-sm text-red-800 ml-0.5 mb-0">{(-1 * percentage).toFixed(2)}%</p>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default EquityPrice

interface serverDataType{
    price: number,
    close: number,
    type: PERCENTAGE_TYPE,
    percentage: number
}