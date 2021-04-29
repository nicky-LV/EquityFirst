import {Grid, GridItem} from "@chakra-ui/react";
import {useEffect, useState, useRef} from "react";
import Sidebar from "./sidebar";
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