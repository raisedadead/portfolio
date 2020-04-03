import React from 'react';
import Helmet from 'react-helmet';
const data = require(`../../gatsby-config`).siteMetadata;

export const HelmetMarkup = ({ title }) => {
  const pageTitle = title || data.defaultTitle;
  return (
    <Helmet
      title={pageTitle}
      defaultTitle={pageTitle}
      titleTemplate={data.titleTemplate}
    >
      <html lang={data.lang} />
      <meta itemProp="description" content={data.description} />
      <meta itemProp="image" content={data.icon} />
      <meta itemProp="name" content={pageTitle} />
      <meta name="description" content={data.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={data.twitterCreator} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={data.icon} />
      <meta name="twitter:image:alt" content={data.defaultTitle} />
      <meta name="twitter:title" content={data.defaultTitle} />
      <meta property="og:description" content={data.description} />
      <meta property="og:image" content={data.icon} />
      <meta property="og:locale" content={data.locale} />
      <meta property="og:title" content={data.defaultTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={data.siteUrl} />
    </Helmet>
  );
};

export const HTMLHead = (props) => <HelmetMarkup {...props} />;

export default HTMLHead;
