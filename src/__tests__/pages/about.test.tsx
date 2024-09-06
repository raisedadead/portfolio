import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '@/pages/about';

describe('About', () => {
  it('renders the page title', () => {
    render(<About />);
    const heading = screen.getByRole('heading', {
      name: /About & Contact/i,
      level: 1
    });
    expect(heading).toBeDefined();
  });

  it('renders the legal information section', () => {
    render(<About />);
    expect(
      screen.getByText('Legal information you should be aware of.')
    ).toBeDefined();
  });

  it('renders the About section', () => {
    render(<About />);
    const aboutText = screen.getByText(
      /Mrugesh Mohapatra is a software & cloud infrastructure consultant/i
    );
    expect(aboutText).toBeDefined();
  });

  it('renders the Business, Billing & Tax section', () => {
    render(<About />);
    expect(
      screen.getByText('Udyam Registration Number: UDYAM-OD-19-0026052')
    ).toBeDefined();
  });

  it('renders the Contact section', () => {
    render(<About />);
    expect(screen.getByText(/Email:/i)).toBeDefined();
    expect(screen.getByText('Correspondence PO Box')).toBeDefined();
  });
});
