import { render, screen } from '@testing-library/react';
import Contents from '../../../__mocks__/components/layouts-test--contents';
import '@testing-library/jest-dom';

describe('<Layout />', () => {
  beforeAll(() => {
    render(<Contents />);
  });

  it('matches snapshot', () => {
    const tree = render(<Contents />);
    expect(tree).toMatchSnapshot();
  });
});
