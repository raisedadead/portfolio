import { render, screen } from '@testing-library/react';
import Contents from '../../../__mocks__/components/layouts-test--contents';
import '@testing-library/jest-dom';

describe('<Layout />', () => {
  beforeAll(() => {
    render(<Contents />);
  });

  it('should render', () => {
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Blog');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveTextContent('Home');
  });

  it('matches snapshot', () => {
    const tree = render(<Contents />);
    expect(tree).toMatchSnapshot();
  });
});
