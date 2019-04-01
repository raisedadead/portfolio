import React from 'react';
import { render } from 'react-testing-library';
import HTMLHead from '../../src/components/HTMLHead';
const metaData = require(`../../gatsby-config`).siteMetadata;

describe(`HTMLHead`, () => {
  it(`renders correctly`, () => {
    const data = {
      site: {
        siteMetadata: {
          defaultTitle: metaData.defaultTitle,
          description: metaData.description,
          lang: metaData.lang,
          locale: metaData.locale,
          icon: metaData.icon,
          siteUrl: metaData.siteUrl,
          titleTemplate: metaData.titleTemplate,
          twitterCreator: metaData.twitterCreator
        }
      }
    };
    const {
      container: { firstChild }
    } = render(<HTMLHead data={data} />);
    expect(firstChild).toMatchSnapshot();
  });
});
