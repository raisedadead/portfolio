import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';

const propTypes = {
  children: PropTypes.any,
  openNewTab: PropTypes.bool,
  to: PropTypes.string.isRequired
};

const LinkComponent = ({ children, to, openNewTab = false, ...other }) => {
  if (!openNewTab && /^\/(?!\/)/.test(to)) {
    return (
      <GatsbyLink to={to} {...other}>
        {children}
      </GatsbyLink>
    );
  }

  return (
    <a href={to} {...other} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
};
LinkComponent.propTypes = propTypes;

export default LinkComponent;
