import {useEffect, useState} from "react";
import {Box, Text, Center} from "@chakra-ui/layout";
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from "@chakra-ui/react"

const BTC5 = () => {
    const [websocketInstance, setWebsocketInstance] = useState<WebSocket | null>(null);
    const [currentPrice, setCurrentPrice] = useState<Number | null>(null);
    const [percentageChange, setPercentageChange] = useState<Number>(0);
    const [percentageChangeSign, setPercentageChangeSign] = useState<string | null>(null);


    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:8000/get_price_every_5_secs/')

        ws.onopen = () => {
            setWebsocketInstance(websocketInstance)
        }

        ws.onmessage = (response) => {
            console.log(response.data)
            if ((JSON.parse(response.data)) != currentPrice){
                if (currentPrice != null){
                    // @ts-ignore
                    const percentage: Number = ((JSON.parse(response.data) - currentPrice) / currentPrice) * 100
                    setPercentageChange(percentage)
                    console.log(percentage)

                    if (percentage > 0){
                        setPercentageChangeSign("increase")
                    }

                    else{
                        setPercentageChangeSign("decrease")
                    }
                }

                setCurrentPrice(JSON.parse(response.data))
            }
        }

        ws.onclose = () => {
            ws.close()
        }

        return function closeWebsocketConnection(){
            ws.close()
        }
    }, [])

    return (
        <Box maxW="lg" w="100%" h="20%" borderWidth="1px" overflow="hidden">
            <Center h="100%" w="100%">
                <StatGroup>
                    <Stat>
                        <StatLabel>Realtime BTC price</StatLabel>
                        <StatNumber>$ {currentPrice}</StatNumber>
                        <StatHelpText>
                            {/* @ts-ignore */}
                            <StatArrow type={percentageChangeSign} />
                            {percentageChange.toFixed(3) === "0.000" ? "< 0.001" : percentageChange.toFixed(3)} %
                        </StatHelpText>
                    </Stat>
                </StatGroup>
            </Center>
        </Box>
    )
}

export default BTC5