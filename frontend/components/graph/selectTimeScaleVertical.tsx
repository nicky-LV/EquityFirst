import {Button} from "@chakra-ui/button";
import {VStack, Center} from "@chakra-ui/layout";

const SelectTimeScaleVertical = (props) => {
    return (
        <Center h="100%">
            <VStack spacing={0}>
                <Button variant="outline" borderBottomLeftRadius={0} borderBottomRightRadius={0} w="100%">
                    1D
                </Button>

                <Button variant="outline" borderRadius={0} w="100%">
                    1W
                </Button>

                <Button variant="outline" borderRadius={0} w="100%">
                    1M
                </Button>

                <Button variant="outline" borderTopLeftRadius={0} borderTopRightRadius={0} w="100%">
                    1Y
                </Button>
            </VStack>
        </Center>
    )
}

export default SelectTimeScaleVertical