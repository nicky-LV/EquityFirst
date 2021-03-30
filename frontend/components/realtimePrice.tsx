import {useEffect, useState} from "react";

const BTC5 = () => {
    const [websocketInstance, setWebsocketInstance] = useState<WebSocket | null>(null);
    const [currentPrice, setCurrentPrice] = useState<Number | null>(null);
    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:8000/get_price_every_5_secs/')

        ws.onopen = () => {
            console.log("Websocket established")
        }

        ws.onmessage = (response) => {
            setCurrentPrice(response.data)
            console.log(response.data)
        }

        ws.onclose = () => {
            ws.close()
        }

        return function closeWebsocketConnection(){
            ws.close()
        }
    }, [])

    return "hi"
}

export default BTC5