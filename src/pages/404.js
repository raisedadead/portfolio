import React from 'react';
import { ClassNames } from '@emotion/core';

import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';
import Flex from 'mineral-ui/Flex';

import HtmlHead from '../components/HTMLHead';
import DefaultLayout from '../components/Layouts/DefaultLayout.js';
import LinkItem from '../components/Link';

const Link = (props) => (
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
export const FourOhFourMarkup = () => (
  <DefaultLayout>
    <HtmlHead title="Page not found" />
    <main>
      <Box as="section" marginHorizontal="auto" width={1 / 2}>
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          height="75vh"
        >
          <Text as="h1" align="center">
            404 | Page not found.
          </Text>
          <br />
          <Text as="h4" align="center">
            Uh - Oh! Apologies, looks like the something you were looking for
            has been lost to oblivion.
          </Text>
          <br />
          <Text as="h4" align="center">
            Why don't you checkout {` `}
            <Link to="/">something interesting instead</Link>.
          </Text>
        </Flex>
      </Box>
    </main>
  </DefaultLayout>
);

export default FourOhFourMarkup;
