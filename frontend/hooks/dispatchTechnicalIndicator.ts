import {useDispatch} from "react-redux";
import {SET_TECHNICAL_INDICATOR} from "../redux/constants";

export const useDispatchTechnicalIndicator = () => {
    const dispatch = useDispatch()
    return (e) => dispatch({type: SET_TECHNICAL_INDICATOR, payload: e.currentTarget.value})
}