import AppLayout from "./layout/layout";
import {useEffect} from "react";
import {useToasts} from "react-toast-notifications";
import {useDispatch} from "react-redux";

import axios from 'axios';
import {SET_TICKER_OPTIONS} from "../redux/constants";

const App = () => {
    const {addToast} = useToasts()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_APP_URL + "api/get-tickers/")
            .then(result => {
                dispatch({type: SET_TICKER_OPTIONS, payload: result.data})
            })
            .catch(error => {
                addToast("Error retrieving ticker options", {
                    appearance: "warning",
                    autoDismiss: true
                })
            })
    }, [])

    return (
        <AppLayout />
    )
}

export default App