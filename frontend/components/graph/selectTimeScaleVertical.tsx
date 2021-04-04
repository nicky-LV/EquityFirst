import {Button} from "@chakra-ui/button";
import {VStack, Center} from "@chakra-ui/layout";
import {SET_TIMESCALE} from "../../redux/constants";
import {useDispatch} from "react-redux";

const SelectTimeScaleVertical = (props) => {
    const dispatch = useDispatch()
    function handleDispatch(e){
        dispatch({type: SET_TIMESCALE, payload: e.currentTarget.value})
    }
    return (
        <Center h="100%">
            <VStack spacing={0}>
                <Button variant="outline"
                        value="1D"
                        onClick={e => handleDispatch(e)}
                        borderBottomLeftRadius={0}
                        borderBottomRightRadius={0}
                        w="100%"
                        className="timescale-button">
                    1D
                </Button>

                <Button variant="outline"
                        value="1W"
                        onClick={e => handleDispatch(e)}
                        borderRadius={0}
                        w="100%"
                        className="timescale-button">
                    1W
                </Button>

                <Button variant="outline"
                        value="1M"
                        onClick={e => handleDispatch(e)}
                        borderRadius={0}
                        w="100%"
                        className="timescale-button">
                    1M
                </Button>

                <Button variant="outline"
                        value="1Y"
                        onClick={e => handleDispatch(e)}
                        borderTopLeftRadius={0}
                        borderTopRightRadius={0}
                        w="100%"
                        className="timescale-button">
                    1Y
                </Button>
            </VStack>
        </Center>
    )
}

export default SelectTimeScaleVertical