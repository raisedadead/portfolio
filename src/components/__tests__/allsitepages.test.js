import React from 'react'
import renderer from 'react-test-renderer'
import AllSitePages from '../allsitepages'

describe(`AllSitePages`, () =>
  it(`renders correctly -- according to react-test-renderer`, () => {
    const tree = renderer.create(<AllSitePages />).toJSON()
    expect(tree).toMatchSnapshot()
  })
)
