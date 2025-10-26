import { Profile } from '@/components/layout/profile';
import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { MockLinkProps } from '../../test-utils';

// Mock the Social component
vi.mock('@/components/social', () => ({
  Social: () => <div data-testid='mocked-social'>Social Links</div>
}));

// Mock the CustomLink component
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({ children, href, ...props }: MockLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

// Mock the CalButton component
vi.mock('@/components/cal-embed', () => ({
  default: ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <button type='button' className={className} data-testid='cal-button'>
      {children}
    </button>
  )
}));

describe('Profile Component', () => {
  it('renders the profile name', () => {
    render(<Profile />);

    expect(screen.getByText('mrugesh mohapatra')).toBeTruthy();
  });

  it('renders the profile description', () => {
    render(<Profile />);

    expect(screen.getByText(/nocturnal developer/)).toBeTruthy();
    expect(screen.getByText(/open-source enthusiast/)).toBeTruthy();
    expect(screen.getByText(/photography noob/)).toBeTruthy();
  });

  it('renders profile image with correct alt text', () => {
    render(<Profile />);

    const profileImage = screen.getByAltText("Mrugesh Mohapatra's profile picture.");
    expect(profileImage).toBeTruthy();
    expect(profileImage).toHaveAttribute('width', '144');
    expect(profileImage).toHaveAttribute('height', '144');
  });

  it('renders call-to-action buttons', () => {
    render(<Profile />);

    expect(screen.getByText('Schedule a Meeting')).toBeTruthy();
    expect(screen.getByText('Blog')).toBeTruthy();
  });

  it('passes className to CalButton component', () => {
    render(<Profile />);

    const calButton = screen.getByTestId('cal-button');
    expect(calButton).toHaveClass('h-14', 'w-80', 'brutalist-button');
  });

  it('renders social links section', () => {
    render(<Profile />);

    expect(screen.getByTestId('mocked-social')).toBeTruthy();
    expect(screen.getByText('Elsewhere on the internet')).toBeTruthy();
  });
});
