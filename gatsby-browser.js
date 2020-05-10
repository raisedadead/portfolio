import React from 'react';
import PropTypes from 'prop-types';

import HtmlHead from './src/components/HTMLHead';
import DefaultLayout from './src/components/Layouts/DefaultLayout';

export const wrapPageElement = ({ element, props }) => {
  const {
    location: { pathname }
  } = props;
  return (
    <div>
      <HtmlHead />
      <DefaultLayout isHome={pathname === `/`} pathname={pathname}>
        {element}
      </DefaultLayout>
    </div>
  );
};

wrapPageElement.propTypes = {
  element: PropTypes.any,
  location: PropTypes.objectOf({ pathname: PropTypes.string }),
  props: PropTypes.any
};

export const disableCorePrefetching = () => true;
