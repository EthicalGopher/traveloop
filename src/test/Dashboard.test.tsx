import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../pages/public/Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock the useAuth hook and auth utils
vi.mock('../utils/auth', () => ({
  useAuth: () => ({
    user: { full_name: 'Alex Johnson' },
    session: { access_token: 'fake-token' }
  }),
  saveSession: vi.fn(),
  getSession: vi.fn(() => ({ user: { full_name: 'Alex Johnson' }, access_token: 'fake-token' })),
  clearSession: vi.fn(),
  isAuthenticated: vi.fn(() => true)
}));

// Mock the api utility
vi.mock('../utils/api', () => ({
  api: vi.fn(() => Promise.resolve([]))
}));

describe('Dashboard Component', () => {
  it('renders the welcome message with user name', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    // Component renders it twice (mobile/desktop)
    const messages = screen.getAllByText(/Welcome back, Alex/i);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toBeInTheDocument();
  });

  it('renders featured destinations', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    // Appears in Hero and featured destinations grid
    const destinations = screen.getAllByText(/Santorini, Greece/i);
    expect(destinations.length).toBeGreaterThan(0);
  });
});
