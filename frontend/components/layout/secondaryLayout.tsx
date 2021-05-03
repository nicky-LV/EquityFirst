import {Grid, GridItem, Box} from "@chakra-ui/layout";
import SelectAnalysis from "../cards/selectAnalysis";
import SelectTimeScale from "../graph/selectTimeScale";
import EquityAnalysisGraph from "../graph/equityAnalysisGraph";
import GraphWrapper from "../graph/graphWrapper";

const SecondaryLayout = () => {

    return(
        <Grid
            className="p-4"
            h="100%"
            w="100%"
            templateRows="repeat(12, 1fr)"
            templateColumns="repeat(12, 1fr)"
            bg="background"
            gap={6}
        >


            {/* Row (for main graph) */}
            <GridItem
                colSpan={9}
                rowSpan={8}>
                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">
                    <SelectTimeScale />
                    <GraphWrapper />
                </Box>
            </GridItem>


            {/* Ticker select */}
            <GridItem
                colSpan={3}
                rowSpan={6}>
                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">
                    <SelectAnalysis />
                </Box>
            </GridItem>

            {/* Secondary graph */}
            <GridItem
                colSpan={9}
                rowSpan={4}>
                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">
                    <EquityAnalysisGraph />

                </Box>
            </GridItem>

        </Grid>
    )

}

export default SecondaryLayout