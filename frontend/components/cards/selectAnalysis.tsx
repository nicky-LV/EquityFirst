import {VStack, Text, Heading, Center, HStack, StackDivider, Box, Badge, Flex, Spacer} from "@chakra-ui/layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from 'axios';
import {SET_TECHNICAL_INDICATOR} from "../../redux/constants";
import {useToasts} from "react-toast-notifications";
import {Select} from "@chakra-ui/select";

const SelectAnalysis = (props) => {
    const [technicalIndicatorOptions, setTechnicalIndicatorOptions] = useState<string[] | []>([])
    //@ts-ignore

    const selectedEquity = useSelector((state) => state.selectedEquity)

    const toast = useToasts()

    const dispatch = useDispatch()

    // get available technical indicators
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_APP_URL + "api/get-technical-indicators/")
            .then(result => {
                setTechnicalIndicatorOptions(result.data)
            })
            .catch(error => {
                toast.addToast("Error in retrieving technical indicators", {
                    appearance: "warning",
                    autoDismiss: true

                })
            })
    }, [])

    function handleSelectTechnicalIndicator(e){
        dispatch({type: SET_TECHNICAL_INDICATOR, payload: e.currentTarget.value})
    }
    return (
        <VStack>
            <Heading fontSize="xl" textAlign="center">
                Select an indicator
            </Heading>
            <Text fontSize="md" textAlign="center" className="card-padded-content">
                Analyse a selected equity {selectedEquity && <strong>({selectedEquity})</strong>} with a selection of technical indicators.
            </Text>

            <Box borderRadius="lg" borderWidth={1} className="card card-padded-content">

                <Text fontSize="md" textAlign="center">
                    The technical indicator(s) chosen will determine possible
                </Text>

                <Center>
                    <HStack marginTop="5%" marginBottom="5%">

                        <Badge fontSize="0.9rem" paddingTop="1px" borderRadius="md" colorScheme="green">BUY</Badge>

                        <Badge fontSize="0.9rem" paddingTop="1px" borderRadius="md" colorScheme="red">SELL</Badge>

                        <Badge fontSize="0.9rem" paddingTop="1px" borderRadius="md" colorScheme="purple">HOLD</Badge>
                    </HStack>
                </Center>

                <Text fontSize="md" textAlign="center">positions.</Text>
            </Box>


            <Box h="100%" w="100%">
                <Center h="100%">
                    <Select marginTop="10px" w="100%" onChange={e => handleSelectTechnicalIndicator(e)}>
                        {technicalIndicatorOptions.map(technicalIndicator => (
                            <option
                                value={technicalIndicator}>{technicalIndicator}</option>
                        ))}
                    </Select>
                </Center>
            </Box>


        </VStack>
    )
}

export default SelectAnalysis