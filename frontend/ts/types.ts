// Websocket type enum
export enum websocketTypeEnum {
    GROUP = "GROUP",
    REQUEST = "REQUEST"
}

// Websocket JSON request format
export interface websocketJSON {
    type: websocketTypeEnum,
    selectedEquity: string
}

// Intra-day data format
export interface intradayData{
    time: String
    price: Number
}
