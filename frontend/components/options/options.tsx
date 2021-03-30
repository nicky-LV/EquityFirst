import {VStack, StackDivider, HStack} from "@chakra-ui/layout";
import {Checkbox} from "@chakra-ui/checkbox";
import {Button, IconButton} from "@chakra-ui/button";
import {Center} from "@chakra-ui/layout";
import {InfoIcon} from "@chakra-ui/icons";
import {Box} from "@chakra-ui/layout";
import {useEffect} from "react";

const analysisOptions = [
    {
        name: "Simple Moving Average (SMA)"
    },
    {
        name: "placeholder"
    },
    {
        name: "placeholder"
    },
    {
        name: "placeholder"
    },
    {
        name: "placeholder"
    },

]
const Options = () => {
    return (
        <VStack style={{paddingLeft: "1rem", paddingRight: "1rem"}}>
            {analysisOptions.map( (option) => (
                <HStack w="100%">
                    <Box w="100%">
                        <Button size="lg" variant="outline" w="100%" style={{marginTop: "0.8rem", marginBottom: "0.8rem"}}>
                            {option.name}
                        </Button>
                    </Box>
                    <Box>
                        <IconButton
                            variant="outline"
                            aria-label="Read more about this indicator"
                            size="lg"
                            icon={<InfoIcon color="#FFFFFF"/>}
                        />
                    </Box>
                </HStack>
            ))}

        </VStack>
    )
}

export default Options