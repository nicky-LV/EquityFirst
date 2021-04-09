// Websocket request enums
export enum websocketEnum {
    GROUP = "GROUP",
    REQUEST = "REQUEST"
}

// Intra-day data format
export interface intradayData{
    time: String
    price: Number
}
