import React from 'react';
import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';
import Flex, { FlexItem } from 'mineral-ui/Flex';

const HomeContent = () => (
  <Box as="section">
    <Flex justifyContent="center" direction="column" height="75vh">
      <FlexItem>
        <Text as="h1" align="center">
          mrugesh mohapatra
        </Text>
      </FlexItem>
      <FlexItem>
        <Text as="h2" align="center">
          developer. music addict. open source enthusiast. noob photographer.
        </Text>
      </FlexItem>
      <FlexItem>
        <Text as="h4" align="center">
          Developer Advocate at freeCodeCamp.org
        </Text>
      </FlexItem>
    </Flex>
  </Box>
);

export default HomeContent;
