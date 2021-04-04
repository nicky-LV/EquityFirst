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
import {HStack} from "@chakra-ui/layout";
import {Divider} from "@chakra-ui/layout";

const BTC5 = (props) => {
    const [websocketInstance, setWebsocketInstance] = useState<WebSocket | null>(null);
    const [currentPrice, setCurrentPrice] = useState<Number | null>(null);
    const [percentageChange, setPercentageChange] = useState<Number>(0);
    const [percentageChangeSign, setPercentageChangeSign] = useState<string | null>(null);


    return (
        <Box bg="sidebar" maxW="lg" w="100%" h="18%" overflow="hidden">
            <Center h="100%" w="100%">
                <StatGroup>
                    <Stat>
                        <StatLabel color="white">Realtime BTC price</StatLabel>
                        <StatNumber color="white">$ {currentPrice}</StatNumber>
                        <StatHelpText>
                            <HStack>
                                {/* @ts-ignore */}
                                <StatArrow color={percentageChange > 0 ? "green.500" : "red.400"} type={percentageChangeSign} />
                                {percentageChange.toFixed(4) === "0.0000" ?
                                    ( <Text color={percentageChange > 0 ? "green.500" : "red.400"}> {"< 0.0001 %"} </Text>)
                                    :
                                    (
                                        <Text color={percentageChange > 0 ? "green.500" : "red.400"}>
                                            {percentageChange.toFixed(4)} %
                                        </Text>)
                                }


                            </HStack>
                        </StatHelpText>
                    </Stat>
                </StatGroup>
            </Center>


        </Box>
    )
}

export default BTC5