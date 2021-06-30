import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ArrowSmDownIcon, ArrowSmUpIcon} from '@heroicons/react/solid'
import {useEffect} from "react";

import {PERCENTAGE_TYPE} from "../../ts/types";
import {SET_CLOSE, SET_PERCENTAGE, SET_PRICE, SET_REALTIME_WS, SET_TYPE} from "../../redux/constants";

function classNames(...classes){
    return classes.join(" ")
}
const EquityPrice = () => {
    const [price, percentage, type] = useSelector((store: RootState) => [store.technical.price,
        store.technical.percentage,
        store.technical.type])

    // Redux selected equity
    const equity: string = useSelector((store: RootState) => store.info.selectedEquity)
    const technicalIndicators: string[] = useSelector((store: RootState) => store.info.technicalIndicators)
    const dispatch = useDispatch()

    useEffect(() => {
        // Realtime-data WS object.
        const ws: WebSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URI}/realtime-price/${equity}/`)

        // Saving WS object in store. (To send re-group request for new equity data).
        dispatch({
            type: SET_REALTIME_WS,
            payload: ws
        })

        // Handle server data.
        ws.onmessage = (data) => {
            const serverData: serverDataType = JSON.parse(data.data)
            const {price, close, type, percentage} = serverData

            // Update equity's price.
            dispatch({
                type: SET_PRICE,
                payload: price
            })
            // Update equity's closing price.
            dispatch({
                type: SET_CLOSE,
                payload: close
            })
            // Update equity's percentage change.
            dispatch({
                type: SET_PERCENTAGE,
                payload: percentage
            })
            // Update equity's percentage change type (increase / decrease).
            dispatch({
                type: SET_TYPE,
                payload: type
            })
        }
    }, [])


    return (
        <div className="mx-4 overflow-hidden sm:p-6">
            <p className="text-sm font-medium text-white truncate">{equity}</p>
            <p className="my-1 text-3xl font-semibold text-white">$ {price && price.toFixed(2)}</p>
            <div className="mt-1 inline-block">
                <div
                    className={classNames(type === PERCENTAGE_TYPE.INCREASE ? "bg-green-100" : "bg-red-100", "rounded-full flex flex-grow-0 items-center content-start px-3")}>

                    {type === PERCENTAGE_TYPE.INCREASE ?
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