import {VStack, Text, Heading, Center, HStack, StackDivider, Box, Badge} from "@chakra-ui/layout";
import {useSelector} from "react-redux";

const SelectAnalysis = (props) => {
    //@ts-ignore
    const selectedEquity = useSelector((state) => state.selectedEquity)
    return (
        <VStack>
            <Heading fontSize="xl" textAlign="center">
                Select an indicator
            </Heading>
            <Text fontSize="md" textAlign="center" className="card-padded-content">
                Analyse the selected equity <strong>({selectedEquity})</strong> with a selection of technical indicators.
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


        </VStack>
    )
}

export default SelectAnalysis