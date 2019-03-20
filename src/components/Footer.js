import React from 'react';
import SocialNav from './Nav/SocialNav';
import { Box, Text } from 'mineral-ui';

const Footer = () => (
  <footer>
    <Box as="section" marginHorizontal="auto" width={1 / 2}>
      <SocialNav />
      <Text as="h6" align="center">
        {` `}
        &copy; {new Date().getFullYear()} Mrugesh Mohapatra.
      </Text>
    </Box>
  </footer>
);

export default Footer;
