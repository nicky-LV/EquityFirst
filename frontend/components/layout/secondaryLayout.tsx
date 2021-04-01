import {Grid, GridItem, Box} from "@chakra-ui/layout";
import Graph from "../graph/graph";

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
            {/* Row */}
            <GridItem
            colSpan={6}
            rowSpan={3}
            bg="card">

                <Box bg="card" w="100%" h="100%">
                    Choose ticker
                </Box>
            </GridItem>

            <GridItem
            colSpan={3}
            rowSpan={3}
            bg="card">

                <Box bg="card" w="100%" h="100%">
                    Hi
                </Box>

            </GridItem>
            <GridItem
            colSpan={3}
            rowSpan={3}
            bg="card">

                <Box bg="card" w="100%" h="100%">
                    Hi
                </Box>

            </GridItem>

            {/* Row (for graph) */}

            <GridItem
                colSpan={9}
                rowSpan={6}
                bg="card">
                <Graph height={400} width={800}/>
            </GridItem>

        </Grid>
    )

}

export default SecondaryLayout