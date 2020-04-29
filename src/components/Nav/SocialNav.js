import React from 'react';
import styled from '@emotion/styled';
import { PrimaryNav, NavItem as NavigationItem } from 'mineral-ui/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Link from '../Link';

const NavItem = styled(NavigationItem)({
  minWidth: `auto`,
  minHeight: `auto`,
  padding: `0.5em 0.5em`,
  height: `auto`,
  color: `#333840`
});

const SocialNav = () => (
  <PrimaryNav
    css={{ backgroundColor: `rgba(255, 255, 255, 0)` }}
    itemAs={Link}
    minimal
    align="center"
  >
    <NavItem to="https://twitter.com/raisedadead" aria-label="Twitter" rel="me">
      <FontAwesomeIcon icon={[`fab`, `twitter`]} size="lg" />
    </NavItem>
    <NavItem to="https://github.com/raisedadead" aria-label="GitHub" rel="me">
      <FontAwesomeIcon icon={[`fab`, `github`]} size="lg" />
    </NavItem>
    <NavItem to="https://linkedin.com/in/mrugeshm" aria-label="LinkedIn">
      <FontAwesomeIcon icon={[`fab`, `linkedin`]} size="lg" />
    </NavItem>
  </PrimaryNav>
);

export default SocialNav;
