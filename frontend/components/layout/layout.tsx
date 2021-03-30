import {Grid, GridItem} from "@chakra-ui/react";
import BTC5 from "../realtimePrice";
import Options from "../options/options";
import Graph from "../graph/graph";
import {useEffect, useState, useRef} from "react";

const ContentLayout = () => {
    const [graphHeight, setGraphHeight] = useState<Number>(0);
    const [graphWidth, setGraphWidth] = useState<Number>(0);
    const GraphGridItem = useRef()

    useEffect(() => {
        // @ts-ignore
        setGraphHeight(GraphGridItem.current.clientHeight)
        // @ts-ignore
        setGraphWidth(GraphGridItem.current.clientWidth)
    }, [])
    return(
        <Grid
            style={{padding: "1rem"}}
            h="100vh"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(5, 1fr)"
            gap={4}
        >
            <GridItem rowSpan={2} colSpan={1} bg="papayawhip">
                <BTC5 />
                <Options />
            </GridItem>
            <GridItem colSpan={2} bg="papayawhip" ref={GraphGridItem}>
                <Graph key={graphHeight} height={graphHeight} width={graphWidth}/>
            </GridItem>
            <GridItem colSpan={2} bg="papayawhip" />
            <GridItem colSpan={4} bg="tomato" />
        </Grid>
    )
}

export default ContentLayout;