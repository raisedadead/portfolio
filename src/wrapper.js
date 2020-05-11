import React from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from './components/Layouts/DefaultLayout';

export const wrapper = ({ element, props }) => {
  const {
    location: { pathname }
  } = props;
  return <DefaultLayout isHome={pathname === `/`}>{element}</DefaultLayout>;
};

wrapper.propTypes = {
  element: PropTypes.any,
  location: PropTypes.objectOf({ pathname: PropTypes.string }),
  props: PropTypes.any
};
