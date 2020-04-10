import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';

const propTypes = {
  children: PropTypes.any,
  openNewTab: PropTypes.bool,
  to: PropTypes.string.isRequired
};

const Link = ({
  children,
  to,
  openNewTab = false,
  rel = `noopener noreferrer`,
  ...other
}) => {
  if (!openNewTab && /^\/(?!\/)/.test(to)) {
    return (
      <GatsbyLink to={to} {...other}>
        {children}
      </GatsbyLink>
    );
  }

  return (
    // disable linting because we have a custom rel
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href={to} {...other} rel={rel} target="_blank">
      {children}
    </a>
  );
};
Link.propTypes = propTypes;

export default Link;
