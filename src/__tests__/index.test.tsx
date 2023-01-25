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

  it('renders a paragraph', () => {
    render(<Home />);

    const paragraph = screen.getByText(/elsewhere on the internet/i);

    expect(paragraph).toBeInTheDocument();
  });

  it('renders a social media links', () => {
    render(<Home />);

    const twitterLink = screen.getByRole('link', {
      name: /twitter/i
    });
    const githubLink = screen.getByRole('link', {
      name: /github/i
    });

    const linkedinLink = screen.getByRole('link', {
      name: /linkedin/i
    });

    const instagramLink = screen.getByRole('link', {
      name: /instagram/i
    });

    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute(
      'href',
      'https://twitter.com/raisedadead'
    );

    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/raisedadead'
    );

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://linkedin.com/in/mrugeshm'
    );

    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://instagram.com/raisedadead'
    );
  });

  it('renders a footer', () => {
    render(<Home />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    const paragraph = screen.getByText(/mrugesh mohapatra co./i);
    expect(paragraph).toBeInTheDocument();
  });
});
