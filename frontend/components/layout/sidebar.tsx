import BTC5 from "../realtimePrice";
import Options from "../options/options";
import {GridItem} from "@chakra-ui/react";

const Sidebar = (props) => {
    return (
        <GridItem
            rowSpan={12}
            colSpan={1}
            style={{display: "flex", flexDirection: "column"}}
        >

            <BTC5 />
            <Options />

        </GridItem>
    )
}

export default Sidebar