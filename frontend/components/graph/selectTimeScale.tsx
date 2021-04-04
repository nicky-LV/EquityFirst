import {ButtonGroup, Button} from "@chakra-ui/button";
import {Center, Box, Flex, Spacer, HStack, Text, Heading, Divider, Badge} from "@chakra-ui/layout";
import {useDispatch, useSelector} from "react-redux";
import {SET_TIMESCALE} from "../../redux/constants";

const SelectTimeScale = () => {
    // @ts-ignore
    const timeScale = useSelector((state) => state.timeScale)
    // @ts-ignore
    const updateScale = useSelector((state) => state.updateScale)

    const dispatch = useDispatch()

    function handleDispatch(e){
        dispatch({type: SET_TIMESCALE, payload: e.currentTarget.value})
    }

    return (
        <Flex align="flex-end" justify="center">
            <Center h="100%">
                <Box>
                        <HStack spacing={4}>
                            <Heading fontSize="xl">
                                Realtime Graph
                            </Heading>

                            {timeScale && <Badge fontSize="sm" colorScheme="purple" paddingTop="3px" marginBottom="3px">
                                {timeScale} Range
                            </Badge>}

                            <Badge fontSize="sm" colorScheme="purple" paddingTop="3px" marginBottom="3px">
                                {updateScale}
                            </Badge>
                        </HStack>
                </Box>
            </Center>
            <Spacer />
            <Box>
                <ButtonGroup variant="outline" isAttached size="md" w="100%" alignItems="flex-end"
                >
                    <Button value="1D" onClick={e => handleDispatch(e)} className="timescale-button">
                        1D
                    </Button>

                    <Button value="1W" onClick={e => handleDispatch(e)} className="timescale-button">
                        1W
                    </Button>

                    <Button value="1M" onClick={e => handleDispatch(e)} className="timescale-button">
                        1M
                    </Button>

                    <Button value="1Y" onClick={e => handleDispatch(e)} className="timescale-button">
                        1Y
                    </Button>
                </ButtonGroup>
            </Box>
        </Flex>
    )
}

export default SelectTimeScale