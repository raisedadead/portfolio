import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';
import Flex from 'mineral-ui/Flex';
import Img from 'gatsby-image';

export const PureHomeContent = ({ data }) => (
  <Box
    as="section"
    marginHorizontal="auto"
    breakpoints={[`narrow`, `medium`, `wide`]}
    width={[`80vw`, `80vw`, `95vw`, `50vw`]}
  >
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      height="75vh"
    >
      <Box
        breakpoints={[`narrow`, `medium`, `wide`]}
        width={[`25vw`, `25vw`, `15vw`, `15vw`]}
        margin="1em"
      >
        <Img sizes={data.profileImage.childImageSharp.fluid} />
      </Box>
      <Text as="h1" align="center">
        mrugesh mohapatra
      </Text>
      <Text as="h2" align="center">
        developer. music addict. open source enthusiast. noob photographer.
      </Text>
      <Text as="h4" align="center">
        Developer Advocate at freeCodeCamp.org
      </Text>
    </Flex>
  </Box>
);

export const HomeContent = () => (
  <StaticQuery
    query={graphql`
      query {
        profileImage: file(relativePath: { eq: "profile.png" }) {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    `}
    render={data => <PureHomeContent data={data} />}
  />
);

export default HomeContent;
