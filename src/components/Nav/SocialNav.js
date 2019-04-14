import React from 'react';
import styled from '@emotion/styled';
import { PrimaryNav, NavItem as NavigationItem } from 'mineral-ui/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LinkComponent from '../LinkComponent';

const NavItem = styled(NavigationItem)({
  minWidth: `auto`,
  minHeight: `auto`,
  padding: `0.5em 0.5em`,
  height: `auto`
});

const SocialNav = () => (
  <PrimaryNav itemAs={LinkComponent} minimal align="center">
    <NavItem to="https://twitter.com/raisedadead" aria-label="Twitter">
      <FontAwesomeIcon icon={[`fab`, `twitter`]} size="lg" />
    </NavItem>
    <NavItem to="https://github.com/raisedadead" aria-label="GitHub">
      <FontAwesomeIcon icon={[`fab`, `github`]} size="lg" />
    </NavItem>
    <NavItem to="https://blog.raisedadead.com" aria-label="Medium">
      <FontAwesomeIcon icon={[`fab`, `medium`]} size="lg" />
    </NavItem>
    <NavItem
      to="https://freeCodeCamp.org/raisedadead"
      aria-label="freeCodeCamp.org"
    >
      <FontAwesomeIcon icon={[`fab`, `free-code-camp`]} size="lg" />
    </NavItem>
    <NavItem to="https://linkedin.com/in/mrugeshm" aria-label="LinkedIn">
      <FontAwesomeIcon icon={[`fab`, `linkedin`]} size="lg" />
    </NavItem>
  </PrimaryNav>
);

export default SocialNav;
