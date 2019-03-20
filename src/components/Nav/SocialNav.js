import React from 'react';
import { PrimaryNav, NavItem } from 'mineral-ui/Navigation';
import Tooltip from 'mineral-ui/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LinkComponent from '../LinkComponent';

const SocialNav = () => (
  <PrimaryNav itemAs={LinkComponent} minimal alignment="center">
    <NavItem to="https://twitter.com/raisedadead">
      <Tooltip content="Twitter">
        <FontAwesomeIcon icon={[`fab`, `twitter`]} size="lg" />
      </Tooltip>
    </NavItem>
    <NavItem to="https://github.com/raisedadead">
      <Tooltip content="GitHub">
        <FontAwesomeIcon icon={[`fab`, `github`]} size="lg" />
      </Tooltip>
    </NavItem>
    <NavItem to="https://blog.raisedadead.com">
      <Tooltip content="Medium">
        <FontAwesomeIcon icon={[`fab`, `medium`]} size="lg" />
      </Tooltip>
    </NavItem>
    <NavItem to="https://freeCodeCamp.org/raisedadead">
      <Tooltip content="freeCodeCamp">
        <FontAwesomeIcon icon={[`fab`, `free-code-camp`]} size="lg" />
      </Tooltip>
    </NavItem>
    <NavItem to="https://linkedin.com/in/mrugeshm">
      <Tooltip content="LinkedIn">
        <FontAwesomeIcon icon={[`fab`, `linkedin`]} size="lg" />
      </Tooltip>
    </NavItem>
  </PrimaryNav>
);

export default SocialNav;
