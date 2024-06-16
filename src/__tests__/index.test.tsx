import { render, screen } from '@testing-library/dom';
import Home from '../pages/index';

describe('Home', () => {
  it('renders the the name on the homepage', () => {
    render(<Home />);
    expect(screen.getByText('mrugesh mohapatra')).toBeInTheDocument();
  });

  it('renders the the description on the homepage', () => {
    render(<Home />);
    expect(
      screen.getByText(
        'nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob 📷'
      )
    ).toBeInTheDocument();
  });

  it('renders the the social links on the homepage', () => {
    render(<Home />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  it('renders a snapshot of the homepage', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
