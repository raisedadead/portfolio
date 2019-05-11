
import React from 'react';
import { render } from 'react-testing-library';
import BlogMarkup from '../../src/pages/blog';

describe(`blog`, () => {
  it(`renders correctly`, () => {
    const {
      container: { firstChild }
    } = render(<BlogMarkup />);
    expect(firstChild).toMatchSnapshot();
  });
});
