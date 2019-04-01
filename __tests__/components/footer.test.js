import React from 'react';
import { render } from 'react-testing-library';

import Footer from '../../src/components/Footer';

describe(`Footer`, () => {
  it(`renders correctly -- according to react-test-renderer`, () => {
    const {
      container: { firstChild }
    } = render(<Footer />);
    expect(firstChild).toMatchSnapshot();
  });
});
