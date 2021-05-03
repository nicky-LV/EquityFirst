import {Flex, Spacer, Heading, Box, Center, Badge, HStack} from "@chakra-ui/layout";
import SelectTimeScaleVertical from "./selectTimeScaleVertical";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {RootState} from "../../redux/store";
import axios from 'axios';

const EquityAnalysisGraph = (props) => {
    const [graphData, setGraphData] = useState(null)
    const timescale = useSelector((state: RootState) => state.timescale)
    const technicalIndicator = useSelector((state: RootState) => state.technicalIndicator)
    const equity = useSelector((state: RootState) => state.selectedEquity)


    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8000/realtime-price/${equity}/`)

        ws.onmessage = (data) => {
            console.log(data.data)
        }
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${technicalIndicator}/${equity}/${timescale}/`)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }, [technicalIndicator, timescale])

    return (
        <Flex>
            <Box>
                <HStack spacing={4}>
                    <Heading fontSize="xl">Indicator Graph</Heading>

                    <Badge fontSize="sm" colorScheme="green" paddingTop="3px" marginBottom="3px">{timescale} Range</Badge>

                    {technicalIndicator && <Badge fontSize="sm" colorScheme="green" paddingTop="3px" marginBottom="3px">{technicalIndicator}</Badge>}
                </HStack>
            </Box>
            <Spacer />

        </Flex>
    )
}

export default EquityAnalysisGraph