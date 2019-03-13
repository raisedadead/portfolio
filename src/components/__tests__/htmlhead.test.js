import React from 'react';
import renderer from 'react-test-renderer';
import HTMLHead from '../HTMLHead';
const metaData = require(`../../../gatsby-config`).siteMetadata;

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
    const tree = renderer.create(<HTMLHead data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
