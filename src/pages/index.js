import HomeContent from '../components/Home/HomeContent';
import HtmlHead from '../components/HTMLHead';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import React from 'react';

export const IndexMarkup = () => (
  <DefaultLayout>
    <HtmlHead />
    <main>
      <HomeContent />
    </main>
  </DefaultLayout>
);

export default IndexMarkup;
