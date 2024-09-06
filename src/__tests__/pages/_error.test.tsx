import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as Sentry from '@sentry/nextjs';
import { NextPageContext } from 'next/types';
import CustomErrorComponent from '@/pages/_error';

vi.mock('@sentry/nextjs', () => ({
  captureUnderscoreErrorException: vi.fn()
}));

describe('CustomErrorComponent', () => {
  it('renders the error page with the correct status code', () => {
    render(<CustomErrorComponent statusCode={404} />);
    expect(screen.getByText('404')).toBeDefined();
  });

  it('renders a 500 error when no status code is provided', () => {
    render(<CustomErrorComponent />);
    expect(screen.getByText('500')).toBeDefined();
  });

  it('calls Sentry.captureUnderscoreErrorException in getInitialProps', async () => {
    const mockContext = {
      res: { statusCode: 404 },
      err: new Error('Test error')
    };
    await CustomErrorComponent.getInitialProps(mockContext as NextPageContext);
    expect(Sentry.captureUnderscoreErrorException).toHaveBeenCalledWith(
      mockContext
    );
  });
});
