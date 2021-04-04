import {ButtonGroup, Button} from "@chakra-ui/button";
import {Center, Box, Flex, Spacer, HStack, Text, Heading, Divider, Badge} from "@chakra-ui/layout";

const SelectTimeScale = () => {
    return (
        <Flex align="flex-end" justify="center">
            <Center h="100%">
                <Box>
                    <Center h="100%" w="100%">
                        <HStack divider={<Divider orientation="vertical"/>}>
                            <Heading fontSize="xl">
                                Realtime Graph
                            </Heading>

                            <Badge fontSize="sm" colorScheme="purple" paddingTop="3px" marginBottom="3px">
                                Per minute
                            </Badge>
                        </HStack>
                    </Center>

                </Box>
            </Center>
            <Spacer />
            <Box>
                <ButtonGroup variant="outline" isAttached size="md" w="100%" alignItems="flex-end">
                    <Button>
                        1D
                    </Button>

                    <Button>
                        1W
                    </Button>

                    <Button>
                        1M
                    </Button>

                    <Button>
                        1Y
                    </Button>
                </ButtonGroup>
            </Box>
        </Flex>
    )
}

export default SelectTimeScale