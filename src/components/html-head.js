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
      <meta
        property="og:description"
        content="Namaste 🙏. I am a software engineer based out of Bengaluru, India. Passionate about all things open-source, aviation and turquoise in color."
      />

      <meta
        itemProp="name"
        content="Mrugesh Mohapatra - Portfolio of a nocturnal developer."
      />
      <meta
        property="og:description"
        content="Namaste 🙏. I am a software engineer based out of Bengaluru, India. Passionate about all things open-source, aviation and turquoise in color."
      />
      <meta itemProp="image" content="https://mrugesh.dev/cover.png" />

      <meta property="og:url" content="https://mrugesh.dev" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Mrugesh Mohapatra - Portfolio of a nocturnal developer."
      />
      <meta
        property="og:description"
        content="Namaste 🙏. I am a software engineer based out of Bengaluru, India. Passionate about all things open-source, aviation and turquoise in color."
      />
      <meta property="og:image" content="https://mrugesh.dev/cover.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Mrugesh Mohapatra - Portfolio of a nocturnal developer."
      />
      <meta
        property="og:description"
        content="Namaste 🙏. I am a software engineer based out of Bengaluru, India. Passionate about all things open-source, aviation and turquoise in color."
      />
      <meta name="twitter:image" content="https://mrugesh.dev/cover.png" />
    </Helmet>
  );
};

export const HTMLHead = (props) => <HelmetMarkup {...props} />;

export default HTMLHead;
