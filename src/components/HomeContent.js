import React from 'react';
import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';
import Flex, { FlexItem } from 'mineral-ui/Flex';
import Img from 'gatsby-image';

const HomeContent = props => (
  <Box as="section">
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      height="75vh"
    >
      <FlexItem>
        <Box width="15vw" margin="1em">
          <Img sizes={props.data.file.childImageSharp.fluid} />
        </Box>
      </FlexItem>
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
