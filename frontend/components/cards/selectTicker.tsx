import {Select} from "@chakra-ui/select";
import axios from 'axios';
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {SET_TICKER_OPTIONS, SET_SELECTED_TICKER} from "../../redux/constants";

const SelectTicker = (props) => {
    const [tickerOptions, setTickerOptions] = useState<string[]>([])
    const [selectedTicker, setSelectedTicker] = useState<string>("MSFT")

    // redux dispatch
    const dispatch = useDispatch()

    useEffect(() => {
        // todo: set base url in environment variable
        axios.get( "http://127.0.0.1:8000/api/get-tickers/")
            .then(result => {

                // API response returning ticker options
                setTickerOptions(result.data)

                // Redux dispatch (updating ticker options)
                dispatch({type: SET_TICKER_OPTIONS, payload: result.data})
            })
            .catch(error => {

                console.log(error.response.data)
            })
    }, [])



    return (
        <Select size="lg" variant="filled" placeholder="Select Ticker" onChange={(e) => {
            // sets local state with selected ticker
            setSelectedTicker(e.target.value)

            // updates redux store with selected ticker
            dispatch({
                type: SET_SELECTED_TICKER,
                payload: e.target.value
            })
        }}>
            {tickerOptions.map(tickerOption => (
                <option value={tickerOption} >{tickerOption}</option>
            ))}
        </Select>
    )
}

export default SelectTicker