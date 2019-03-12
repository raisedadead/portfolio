import React from 'react'
import renderer from 'react-test-renderer'
import FourOhFourMarkup from '../pages/404'

describe(`404`, () =>
  it(`renders correctly`, () => {
    const tree = renderer.create(<FourOhFourMarkup />).toJSON()
    expect(tree).toMatchSnapshot()
  }),
)
