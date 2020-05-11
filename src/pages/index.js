import React from 'react';

import DefaultLayout from '../components/Layouts/DefaultLayout';
import HomeContent from '../components/Home/HomeContent';

export const IndexMarkup = () => (
  <DefaultLayout isHome={true}>
    <HomeContent />
  </DefaultLayout>
);

IndexMarkup.displayName = `IndexMarkup`;
export default IndexMarkup;
