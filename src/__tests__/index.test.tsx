import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /mrugesh mohapatra/i
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders a sub-heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /principal maintainer/i
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders a call to action button', () => {
    render(<Home />);

    const link = screen.getByRole('link', {
      name: /schedule a call/i
    });

    expect(link).toBeInTheDocument();
  });

  it('renders a call to action button', () => {
    render(<Home />);

    const link = screen.getByRole('link', {
      name: /ask me anything/i
    });

    expect(link).toBeInTheDocument();
  });

  it('renders a call to action button', () => {
    render(<Home />);

    const link = screen.getByRole('link', {
      name: /browse my blog/i
    });

    expect(link).toBeInTheDocument();
  });
});
