import {useToasts} from "react-toast-notifications";
import {useDispatch} from "react-redux";
import {getEquitySymbols} from "../pages/api/getEquitySymbols";
import {useQuery} from "react-query";
import {SET_TICKER_OPTIONS} from "../redux/constants";
import Dashboard from "./dashboard/dashboard";

const App = () => {
    const {addToast} = useToasts()
    const dispatch = useDispatch()
    const query = useQuery('fetchEquitySymbols', getEquitySymbols)

    // Promise resolved
    if (query.isSuccess){
        const data = query.data
        const equitySymbols = data.data
        dispatch({type: SET_TICKER_OPTIONS, payload: equitySymbols})
    }

    // Promise rejected
    else if (query.isError){
        addToast("Error retrieving equity symbols", {
            appearance: "warning",
            autoDismiss: true
        })
    }

    return (
        <Dashboard />
    )
}

export default App