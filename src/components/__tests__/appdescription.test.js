import AppDescription from '../appdescription'
import React from 'react'
import renderer from 'react-test-renderer'

describe(`AppDescription`, () =>
  it(`renders correctly -- according to react-test-renderer`, () => {
    const tree = renderer.create(<AppDescription />).toJSON()
    expect(tree).toMatchSnapshot()
  }),
)
