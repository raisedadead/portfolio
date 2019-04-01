import React from 'react';
import { render } from 'react-testing-library';
import FourOhFourMarkup from '../../src/pages/404';

describe(`404`, () => {
  it(`renders correctly`, () => {
    const {
      container: { firstChild }
    } = render(<FourOhFourMarkup />);
    expect(firstChild).toMatchSnapshot();
  });
});
