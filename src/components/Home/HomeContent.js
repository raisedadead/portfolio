import React from 'react';
import { ClassNames } from '@emotion/core';

import { StaticQuery, graphql } from 'gatsby';
import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';
import Flex from 'mineral-ui/Flex';
import Tooltip from 'mineral-ui/Tooltip';
import Img from 'gatsby-image';

import LinkItem from '../Link';

const Link = props => (
  <ClassNames>
    {({ css }) => (
      <LinkItem
        className={css`
          outline: none;
          text-decoration: none;
          padding: 2px 1px 0;
          border-bottom-style: dashed;
          border-bottom-color: currentcolor;
          border-bottom-width: 1px;
          color: currentcolor;
        `}
        {...props}
      />
    )}
  </ClassNames>
);

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
      <Text as="h2" align="center">
        <Tooltip cursor="help" content="/mru:dʒi:eʃ/" placement="top" usePortal>
          mrugesh
        </Tooltip>
        {` `}
        mohapatra
      </Text>

      <Text as="h3" align="center">
        developer. music addict. open source enthusiast. noob photographer.
      </Text>
      <br />
      <Text as="p" align="center">
        Lead Developer and Community Advocate at{`  `}
        <Link to="https://www.freecodecamp.org" aria-label="freecodecamp.org">
          freeCodeCamp.org
        </Link>
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
