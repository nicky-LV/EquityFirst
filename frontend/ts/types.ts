// Websocket type enum
export enum websocketTypeEnum {
    GROUP = "GROUP"
}

// Websocket JSON request format
export interface websocketJSON {
    type: websocketTypeEnum,
    selectedEquity: string
}

// Intra-day data format
export interface INTRADAY_DATA{
    average: number
    close: number
    date: string
    high: number
    low: number
    open: number
    time: string
    volume: number
}

export enum TIMESCALE_ENUM {
    DAY = "1D",
    WEEK = "1W",
    MONTH = "1M",
    YEAR = "1Y"
}
// datetime, open, high, low, close
type HISTORICAL_DATA_FORMAT_TYPE = [string, number, number, number, number]
