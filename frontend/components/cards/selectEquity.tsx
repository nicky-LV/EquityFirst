import {Select} from "@chakra-ui/select";
import {useSelector, useDispatch} from "react-redux";
import {SET_SELECTED_EQUITY} from "../../redux/constants";
import {Heading, Text, Box, VStack, Center} from "@chakra-ui/layout";
import {RootState} from "../../redux/store";

const SelectEquity = (props) => {
    // dispatch function
    const dispatch = useDispatch()

    const tickerOptions = useSelector((state: RootState) => state.tickerOptions)
    const selectedEquity = useSelector((state: RootState) => state.selectedEquity)

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

                    <Select size="lg" variant="outline" value={selectedEquity} placeholder="Select Equity" onChange={(e) => {
                        // updates redux store with selected ticker
                        dispatch({
                            type: SET_SELECTED_EQUITY,
                            payload: e.currentTarget.value
                        })
                    }}>
                        {tickerOptions.map(tickerOption => (
                            <option value={tickerOption} key={tickerOption}>{tickerOption}</option>
                        ))}
                    </Select>

                </Box>
            </VStack>
        </Center>
    )
}

export default SelectEquity