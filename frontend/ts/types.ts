/**
 * Non-local types go here
 */

export interface INTRADAY_DATA{
    average: number;
    close: number;
    date: string;
    high: number;
    low: number;
    open: number;
    time: string;
    volume: number;
}

export enum TIMESCALE {
    DAY = "1D",
    WEEK = "1W",
    MONTH = "1M",
    THREE_MONTHS = "3M",
    SIX_MONTHS = "6M",
    YEAR = "1Y"
}
// datetime, open, high, low, close
type HISTORICAL_DATA_FORMAT_TYPE = [string, number, number, number, number]

export enum MOVING_AVG {
    SMA = "SMA",
    EMA = "EMA"
}

export enum PERCENTAGE_TYPE {
    INCREASE = 'increase',
    DECREASE = 'decrease'
}

export enum Recommendations {
    STRONGBUY = "STRONG BUY",
    BUY = "BUY",
    HOLD = "HOLD",
    SELL = "SELL",
    STRONGSELL = "STRONG SELL"
}

export interface PriceTargetDataType {
    recommendations: [[Recommendations.BUY, number], [Recommendations.HOLD, number], [Recommendations.SELL, number]],
    priceTargets: [[PriceTarget.HIGH, Number], [PriceTarget.LOW, number], [PriceTarget.OVERALL, number]]
    noOfAnalysts: number,
    score: number

}

export enum PriceTarget {
    HIGH = "High",
    LOW = "Low",
    OVERALL = "Overall"
}