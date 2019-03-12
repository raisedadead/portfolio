import React from 'react'
import renderer from 'react-test-renderer'
import HtmlHead  from '../htmlhead'
const metaData = require(`../../../gatsby-config`).siteMetadata

describe(`HtmlHead`, () =>
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
    }
    const tree = renderer.create(<HtmlHead data={data} />).toJSON()
      expect(tree).toMatchSnapshot()
  })
)
