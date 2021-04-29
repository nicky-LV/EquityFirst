import {VStack, Text, Heading, Center, HStack, Box, Badge} from "@chakra-ui/layout";
import {useSelector} from "react-redux";
import {useState} from "react";
import {useToasts} from "react-toast-notifications";
import {Select} from "@chakra-ui/select";
import {RootState} from "../../redux/store";
import {useQuery} from "react-query";
import {getTechnicalIndicators} from "../../pages/api/getTechnicalIndicators";
import {useDispatchTechnicalIndicator} from "./dispatchTechnicalIndicator";

const SelectAnalysis = () => {
    const selectedEquity = useSelector((state: RootState) => state.selectedEquity)
    const updateIndicator = useDispatchTechnicalIndicator()

    const toast = useToasts()
    const query = useQuery('getTechnicalIndicators', getTechnicalIndicators)

    if (query.isError){
        toast.addToast("Error in retrieving technical indicators", {
            appearance: "warning",
            autoDismiss: true
        })
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
                    <Select marginTop="10px" w="100%" onChange={e => updateIndicator(e)}>
                        {query.isSuccess && query.data.data.map(technicalIndicator => (
                            <option
                                value={technicalIndicator} key={technicalIndicator}>{technicalIndicator}</option>
                        ))}
                    </Select>
                </Center>
            </Box>


        </VStack>
    )
}

export default SelectAnalysis