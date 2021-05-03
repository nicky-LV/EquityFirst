import {Grid, GridItem} from "@chakra-ui/react";
import {useEffect, useState, useRef} from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "./header";
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
            <Header />
            {/* GridItem 2 col, 12 rows */}
            <Sidebar />



            <GridItem colSpan={10} rowSpan={12}>
                <SecondaryLayout />
            </GridItem>

        </Grid>
    )
}

export default AppLayout;