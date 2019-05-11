import React from 'react';

import Box from 'mineral-ui/Box';
import Text from 'mineral-ui/Text';
import Flex from 'mineral-ui/Flex';

import HtmlHead from '../components/HTMLHead';
import BlogLayout from '../components/Layouts/BlogLayout';

export const BlogMarkup = () => (
  <BlogLayout>
    <HtmlHead title="Blog" />
    <main>
      <Box as="section" marginHorizontal="auto" width={1 / 2}>
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          height="75vh"
        >
          <Text as="h4" align="center">
            Did I not finsh creating this page? Yeah, I must have fallen asleep.
          </Text>
        </Flex>
      </Box>
    </main>
  </BlogLayout>
);

export default BlogMarkup;
