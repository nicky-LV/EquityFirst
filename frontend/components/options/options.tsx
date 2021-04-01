import {VStack, StackDivider, HStack, Divider} from "@chakra-ui/layout";
import {Checkbox} from "@chakra-ui/checkbox";
import {Button, IconButton} from "@chakra-ui/button";
import {Center} from "@chakra-ui/layout";
import {InfoIcon} from "@chakra-ui/icons";
import {Box} from "@chakra-ui/layout";
import {motion} from "framer-motion";

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
    ,
    {
        name: "placeholder"
    },
    ,
    {
        name: "placeholder"
    },
    ,
    {
        name: "placeholder"
    },
    ,
    {
        name: "placeholder"
    }

]

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const containerVariants = {
    initial: {opacity: 0},
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 1
        }
    },
    exit: {
        opacity: 0
    }
}

const childrenVariants = {
    initial: {opacity: 0},
    animate: {opacity: 1}
}

const Options = (props) => {
    return (
        <MotionBox
            bg="sidebar"
            initial="initial"
            animate="animate"
            variants={containerVariants}
            style={{flexGrow: 1, height: "100%"}}
        >
            <VStack style={{paddingLeft: "1rem", paddingRight: "1rem", marginTop: "2.8rem"}}>
                {analysisOptions.map( (option) => (
                    <HStack w="100%">
                        <Box w="100%">
                            <MotionButton
                                variants={childrenVariants}
                                borderColor="gray.400"
                                bg="teal"
                                size="sm"
                                variant="solid"
                                w="100%"
                                style={{marginTop: "0.8rem", marginBottom: "0.8rem"}}>
                                {option.name}
                            </MotionButton>
                        </Box>
                        <Box>
                            <IconButton
                                borderColor="green.400"
                                variant="outline"
                                aria-label="Read more about this indicator"
                                size="lg"
                                icon={<InfoIcon color="green.400"/>}
                            />
                        </Box>
                    </HStack>
                ))}

            </VStack>
        </MotionBox>
    )
}

export default Options