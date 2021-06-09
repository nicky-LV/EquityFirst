import {SET_CLOSE, SET_PERCENTAGE, SET_PRICE, SET_TYPE} from "../constants";
import {PERCENTAGE_TYPE} from "../../ts/types";

export default function technicalReducer(state=technicalInitialState, dispatch){
    switch(dispatch.type){
        case SET_PRICE:
            let price: number;
            price = dispatch.payload;
            return Object.assign({}, state, {price: price});

        case SET_CLOSE:
            let close: number;
            close = dispatch.payload;
            return Object.assign({}, state, {close: close});

        case SET_PERCENTAGE:
            let percentage: number;
            percentage = dispatch.payload;
            return Object.assign({}, state, {percentage: percentage});

        case SET_TYPE:
            let type: PERCENTAGE_TYPE.INCREASE | PERCENTAGE_TYPE.DECREASE
            type = dispatch.payload
            return Object.assign({}, state, {type: type})

        default:
            return Object.assign({}, state)
    }
}

const technicalInitialState = {
    price: null,
    close: null,
    percentage: null,
    type: null
}