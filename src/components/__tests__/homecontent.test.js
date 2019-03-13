import HomeContent from '../HomeContent';
import React from 'react';
import renderer from 'react-test-renderer';

describe(`HomeContent`, () => {
  it(`renders correctly -- according to react-test-renderer`, () => {
    const tree = renderer.create(<HomeContent />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
