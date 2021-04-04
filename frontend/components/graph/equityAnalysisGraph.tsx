import {Flex, Spacer, Heading, Box, Center} from "@chakra-ui/layout";
import SelectTimeScaleVertical from "./selectTimeScaleVertical";

const EquityAnalysisGraph = (props) => {
    return (
        <Flex>
            <Box>
                <Heading fontSize="xl">Indicator Graph</Heading>
            </Box>
            <Spacer />

                <Box>
                    <SelectTimeScaleVertical />
                </Box>

        </Flex>
    )
}

export default EquityAnalysisGraph