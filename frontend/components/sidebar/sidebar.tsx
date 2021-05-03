import {GridItem} from "@chakra-ui/react";
import EquityPrice from "./equityPrice";

const Sidebar = (props) => {
    return (
        <GridItem
            rowSpan={12}
            colSpan={2}
            className="flex"
        >
            <EquityPrice />

        </GridItem>
    )
}

export default Sidebar