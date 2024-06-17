import { describe, it, expect, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import Contents from '../../__mocks__/components/layouts-test--contents';

describe('<Layout />', () => {
  beforeAll(() => {
    render(<Contents />);
  });

  it('matches snapshot', () => {
    const tree = render(<Contents />);
    expect(tree).toMatchSnapshot();
  });
});
