import HtmlHead from '../components/HTMLHead';
import DefaultLayout from '../components/Layouts/DefaultLayout.js';
import React from 'react';
import { Link } from 'gatsby';

export const FourOhFourMarkup = () => (
  <DefaultLayout>
    <HtmlHead title="404" />
    <main>
      <h2>404 | Page not found.</h2>
      <p>
        Ah..! That's my bad. Sorry. Why don't you checkout{` `}
        <Link to="/">something here</Link>.
      </p>
    </main>
  </DefaultLayout>
);

export default FourOhFourMarkup;
