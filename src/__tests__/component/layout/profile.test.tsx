import { Profile } from '@/components/layout/profile';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Profile Component', () => {
  it('renders the profile name', () => {
    render(<Profile />);

    expect(screen.getByText('mrugesh mohapatra')).toBeTruthy();
  });

  it('renders the profile description', () => {
    render(<Profile />);

    expect(screen.getByText(/dad/)).toBeTruthy();
    expect(screen.getByText(/dad • dev\/\/ops • open-source/)).toBeTruthy();
  });

  it('renders profile image with correct alt text', () => {
    render(<Profile />);

    const profileImage = screen.getByAltText('Mrugesh Mohapatra');
    expect(profileImage).toHaveAttribute('src', '/images/logo.webp');
    expect(profileImage).toHaveAttribute('fetchpriority', 'high');
    expect(profileImage).toHaveAttribute('width', '256');
    expect(profileImage).toHaveAttribute('height', '256');
  });

  it('renders call-to-action buttons', () => {
    render(<Profile />);

    expect(screen.getByText('Book 1:1 Meeting')).toBeTruthy();
    expect(screen.getByText('Blog')).toBeTruthy();
  });

  it('renders the meeting button with the secondary button style', () => {
    render(<Profile />);

    const calButton = screen.getByRole('button', { name: 'Schedule a meeting with me' });
    expect(calButton).toHaveClass('h-14', 'brutalist-button-secondary');
  });
});
