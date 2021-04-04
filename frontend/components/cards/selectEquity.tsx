import {Select} from "@chakra-ui/select";
import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import {SET_SELECTED_EQUITY} from "../../redux/constants";
import {Heading, Text, Box, VStack, Center} from "@chakra-ui/layout";
import {Divider} from "@chakra-ui/layout";

const SelectEquity = (props) => {
    const [selectedTicker, setSelectedTicker] = useState<string>("MSFT")

    // redux dispatch
    const dispatch = useDispatch()

    //@ts-ignore
    const tickerOptions = useSelector((state) => state.tickerOptions)

    return (
        <Center h="100%" w="100%">
            <VStack>
                <Heading fontSize="xl">
                    Select an Equity
                </Heading>
                <Text fontSize="md">
                    Choose from the top 10 stocks listed on the NASDAQ index.
                </Text>

                <Box className="card-padded-content">

                    <Select size="lg" variant="outline" placeholder="Select Equity" onChange={(e) => {
                        // sets local state with selected ticker
                        setSelectedTicker(e.target.value)

                        // updates redux store with selected ticker
                        dispatch({
                            type: SET_SELECTED_EQUITY,
                            payload: e.target.value
                        })
                    }}>
                        {tickerOptions.map(tickerOption => (
                            <option value={tickerOption} >{tickerOption}</option>
                        ))}
                    </Select>

                </Box>
            </VStack>
        </Center>
    )
}

export default SelectEquity