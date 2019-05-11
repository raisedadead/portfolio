import React from 'react';

import { PrimaryNav } from 'mineral-ui/Navigation';
import Box from 'mineral-ui/Box/Box';

const MainNaV = ({ showHome = false }) => {
  let items = [
    {
      href: `https://represent.io/mrugesh`,
      'aria-label': `Mrugesh Mohapatra's resumé`,
      text: `resumé`
    },
    {
      href: `https://github.com/raisedadead/ama/`,
      'aria-label': `Ask me anything`,
      text: `ask me anything`
    },
    {
      href: `/blog`,
      'aria-label': `Blog`,
      text: `blog`
    }
  ];
  if (showHome) {
    items.unshift({
      href: `/`,
      'aria-label': `Mrugesh Mohapatra's portfolio`,
      text: `home`
    });
  }
  return (
    <Box marginHorizontal="auto" width={1 / 2}>
      <PrimaryNav
        css={{
          backgroundColor: `rgba(255, 255, 255, 0)`
        }}
        items={items}
        align="center"
        minimal
      />
    </Box>
  );
};

export default MainNaV;
