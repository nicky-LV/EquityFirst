import {Button} from "@chakra-ui/button";
import {VStack, Center} from "@chakra-ui/layout";
import {SET_TIMESCALE} from "../../redux/constants";
import {useDispatch, useSelector} from "react-redux";

import {TIME_SCALE_VALUES} from "../../redux/constants";

const timeScaleClasses = {
    '1D': 'top-button',
    '1W': 'middle-button',
    '1M': 'middle-button',
    '1Y': 'bottom-button'
}

const SelectTimeScaleVertical = (props) => {
    const dispatch = useDispatch()

    //@ts-ignore
    const reduxTimeScale = useSelector((state) => state.timeScale)

    function handleDispatch(e){
        dispatch({type: SET_TIMESCALE, payload: e.currentTarget.value})
    }

    return (
        <Center h="100%">
            <VStack spacing={0}>
                {TIME_SCALE_VALUES.map(timeScale => (
                    <Button variant="outline"
                        value={timeScale}
                            key={timeScale}
                        onClick={e => handleDispatch(e)}
                        w="100%"
                            bg={timeScale === reduxTimeScale ? "gray.100" : null}
                        className={timeScaleClasses[timeScale]}>
                        {timeScale}
                    </Button>
                    ))}
            </VStack>
        </Center>
    )
}

export default SelectTimeScaleVertical