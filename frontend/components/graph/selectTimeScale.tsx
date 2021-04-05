import {ButtonGroup, Button} from "@chakra-ui/button";
import {Center, Box, Flex, Spacer, HStack, Text, Heading, Divider, Badge} from "@chakra-ui/layout";
import {useDispatch, useSelector} from "react-redux";
import {SET_TIMESCALE} from "../../redux/constants";
import {timeScaleValues} from "../../redux/constants";

const SelectTimeScale = () => {
    // @ts-ignore
    const reduxTimeScale = useSelector((state) => state.timeScale)
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

                            {reduxTimeScale && <Badge fontSize="sm" colorScheme="purple" paddingTop="3px" marginBottom="3px">
                                {reduxTimeScale} Range
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
                    {timeScaleValues.map((timeScale) => (
                        <Button
                            key={timeScale}
                            value={timeScale}
                            onClick={e => handleDispatch(e)}
                            bg={reduxTimeScale === timeScale ? "gray.100" : null}
                            className="timescale-button">
                            {timeScale}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>
        </Flex>
    )
}

export default SelectTimeScale