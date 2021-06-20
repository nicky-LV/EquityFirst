export const SET_TICKER_OPTIONS = "SET_TICKER_OPTIONS";
export const SET_SELECTED_EQUITY = "SET_SELECTED_EQUITY";
export const SET_TECHNICAL_INDICATOR = "SET_TECHNICAL_INDICATOR";
export const REMOVE_TECHNICAL_INDICATOR = "REMOVE_TECHNICAL_INDICATOR"
export const SET_TIMESCALE = "SET_TIMESCALE";
export const SET_HISTORICAL_DATA = "SET_HISTORICAL_DATA";
export const SET_REALTIME_WS = "SET_REALTIME_WS";
export const SET_PRICE = "SET_PRICE";
export const SET_CLOSE = "SET_CLOSE";
export const SET_PERCENTAGE = "SET_PERCENTAGE";
export const SET_TYPE = "SET_TYPE";

import {TIMESCALE, TECHNICAL_INDICATORS} from "../ts/types";

export const technicalIndicatorCombos: indicatorComboType = {
    "SMA": ["SMA", "EMA", "RSI"],
    "EMA": ["SMA", "EMA", "RSI"],
    "RSI": ["SMA", "EMA", "RSI"],
    "STOCH": ["STOCH"],
    "MACD": ["MACD"],
    "ADX": ["ADX"]
}

export const technicalIndicators = ["SMA", "EMA", "RSI", "STOCH", "MACD", "ADX"]

export const TIME_SCALE_VALUES = [TIMESCALE.DAY, TIMESCALE.WEEK, TIMESCALE.MONTH, TIMESCALE.YEAR]

interface indicatorComboType {
    [TECHNICAL_INDICATORS.SMA]: string[],
    [TECHNICAL_INDICATORS.EMA]: string[],
    [TECHNICAL_INDICATORS.RSI]: string[],
    [TECHNICAL_INDICATORS.STOCH]: string[],
    [TECHNICAL_INDICATORS.MACD]: string[],
    [TECHNICAL_INDICATORS.ADX]: string[]
}