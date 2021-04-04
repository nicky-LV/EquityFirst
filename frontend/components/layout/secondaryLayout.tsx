import {Grid, GridItem, Box} from "@chakra-ui/layout";
import Graph from "../graph/graph";
import SelectEquity from "../cards/selectEquity";
import SelectAnalysis from "../cards/selectAnalysis";
import SelectTimeScale from "../graph/selectTimeScale";
import SelectTimeScaleVertical from "../graph/selectTimeScaleVertical";
import EquityAnalysisGraph from "../graph/equityAnalysisGraph";

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


            {/* Card 1 */}
            <GridItem
                borderRadius="lg"
                colSpan={6}
                rowSpan={3}>

                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">
                    <SelectEquity />
                </Box>
            </GridItem>

            {/* Card 2 */}
            <GridItem
                colSpan={3}
                rowSpan={3}>

                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">

                </Box>

                {/* Card 3 */}
            </GridItem>
            <GridItem
                colSpan={3}
                rowSpan={3}>

                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">
                    Hi
                </Box>
            </GridItem>

            {/* Row (for main graph) */}
            <GridItem
                colSpan={9}
                rowSpan={6}>
                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">
                    <SelectTimeScale />
                    <Graph height={400} width={800}/>
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
                rowSpan={3}>
                <Box bg="card" w="100%" h="100%" borderRadius="lg" className="card">
                    <EquityAnalysisGraph />

                </Box>
            </GridItem>

        </Grid>
    )

}

export default SecondaryLayout