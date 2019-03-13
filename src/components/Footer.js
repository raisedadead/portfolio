import React from 'react';
import SocialNav from './Nav/SocialNav';
import { Box, Text } from 'mineral-ui';

const Footer = () => (
  <footer>
    <Box>
      <SocialNav />
      <Text as="h6" align="center">
        {` `}
        &copy; {new Date().getFullYear()} Mrugesh Mohapatra.
      </Text>
    </Box>
  </footer>
);

export default Footer;
