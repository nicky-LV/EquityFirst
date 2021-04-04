import {Grid, GridItem} from "@chakra-ui/react";
import BTC5 from "../realtimePrice";
import Options from "../options/options";
import Graph from "../graph/graph";
import {useEffect, useState, useRef} from "react";
import {Box, Divider} from "@chakra-ui/layout";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import SecondaryLayout from "./secondaryLayout";


const AppLayout = (props) => {

    useEffect(() => {

    }, [])
    return(
        <Grid
            h="100vh"
            templateRows="repeat(12, 1fr)"
            templateColumns="repeat(12, 1fr)"
        >

            {/* GridItem 1 col, 12 rows */}
            <Sidebar />

            <GridItem colSpan={11} rowSpan={12}>
                <SecondaryLayout />
            </GridItem>

        </Grid>
    )
}

export default AppLayout;