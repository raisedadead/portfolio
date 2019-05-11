import React from 'react';

import HomeContent from '../components/Home/HomeContent';
import HtmlHead from '../components/HTMLHead';
import DefaultLayout from '../components/Layouts/DefaultLayout';

export const PureIndexMarkup = ({ homeContent }) => (
  <DefaultLayout>
    <HtmlHead title="Home" />
    <main>{homeContent()}</main>
  </DefaultLayout>
);

export const IndexMarkup = () => <PureIndexMarkup homeContent={HomeContent} />;

export default IndexMarkup;
