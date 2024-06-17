import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Refunds from '@/pages/refunds';

describe('Refunds', () => {
  it('renders a heading', () => {
    render(<Refunds />);
    expect(screen.getByText('Cancellation and Refund Policy')).toBeDefined();
  });
});
