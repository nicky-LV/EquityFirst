import {Flex, Spacer, Heading, Box, Center, Badge, HStack} from "@chakra-ui/layout";
import SelectTimeScaleVertical from "./selectTimeScaleVertical";
import {useSelector} from "react-redux";

const EquityAnalysisGraph = (props) => {
    // @ts-ignore
    const timeScale = useSelector((state) => state.timeScale)
    // @ts-ignore
    const selectedIndicator = useSelector((state) => state.technicalIndicator)

    return (
        <Flex>
            <Box>
                <HStack spacing={4}>
                    <Heading fontSize="xl">Indicator Graph</Heading>

                    <Badge fontSize="sm" colorScheme="green" paddingTop="3px" marginBottom="3px">{timeScale} Range</Badge>

                    {selectedIndicator && <Badge fontSize="sm" colorScheme="green" paddingTop="3px" marginBottom="3px">{selectedIndicator}</Badge>}
                </HStack>
            </Box>
            <Spacer />

            <Box>
                <SelectTimeScaleVertical />
            </Box>

        </Flex>
    )
}

export default EquityAnalysisGraph