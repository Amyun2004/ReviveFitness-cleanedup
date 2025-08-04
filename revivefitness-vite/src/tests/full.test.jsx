// =========================
// File: src/tests/ReviveFitness.test.jsx
// Core Vitest + RTL test suite
// =========================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './utils.jsx';
import App from '../App.jsx';
import Navbar from '../components/common/Navbar.jsx';
import ProgramDetailsModal from '../components/Programs/ProgramDetailsModal.jsx';
import ContactForm from '../components/ContactPage/ContactForm.jsx';

// Mock programs.json
vi.mock('../data/programs.json', () => ([
  { id: 1, title: 'Strength', description: 'Build muscle strength' },
  { id: 2, title: 'Cardio', description: 'Boost endurance' }
]));

beforeEach(() => {
  vi.resetAllMocks();
});

// App routing & pages
describe('App routing & pages', () => {
  it('renders Home page at root', () => {
    renderWithRouter(<App />, { route: '/' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/welcome to revivefitness/i);
  });

  it('navigates to Programs and opens modal', async () => {
    renderWithRouter(<App />, { route: '/programs' });
    const firstCard = screen.getByRole('button', { name: /strength/i });
    await userEvent.click(firstCard);
    const dialog = screen.getByRole('dialog', { name: /strength/i });
    expect(dialog).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows 404 on invalid route', () => {
    renderWithRouter(<App />, { route: '/nope' });
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeVisible();
  });
});

// Navbar
describe('Navbar component', () => {
  it('renders all main links', () => {
    renderWithRouter(<Navbar />);
    ['Home','About','Programs','Contact','Membership'].forEach(text => {
      expect(screen.getByRole('link', { name: new RegExp(text, 'i') })).toBeInTheDocument();
    });
  });

  it('toggles mobile menu', async () => {
    renderWithRouter(<Navbar />);
    const toggle = screen.getByRole('button', { name: /menu/i });
    await userEvent.click(toggle);
    const nav = screen.getByRole('navigation', { name: /mobile menu/i });
    expect(nav).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('navigation', { name: /mobile menu/i })).toBeNull();
  });
});

// ProgramDetailsModal
describe('ProgramDetailsModal', () => {
  const sample = { id: 99, title: 'TestProg', description: 'TestDesc' };

  it('renders details when open', () => {
    renderWithRouter(<ProgramDetailsModal isOpen program={sample} onClose={() => {}} />, { route: '/' });
    const dialog = screen.getByRole('dialog', { name: /testprog/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/testdesc/i)).toBeVisible();
  });

  it('invokes onClose on close click', async () => {
    const onClose = vi.fn();
    renderWithRouter(<ProgramDetailsModal isOpen program={sample} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

// ContactForm
describe('ContactForm', () => {
  it('shows validation errors on empty submit', async () => {
    renderWithRouter(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(await screen.findByText(/name must be at least 2 chars/i)).toBeInTheDocument();
    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/message must be at least 10 chars/i)).toBeInTheDocument();
  });

  it('submits successfully with valid input', async () => {
    renderWithRouter(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Hello from test suite!');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
  });
});


// =========================
// File: src/components/common/ErrorBoundary.jsx
// Global error boundary with fallback UI and logger
// =========================
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function FallbackUI({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Oops! Something went wrong.</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.toString()}</pre>
      <button onClick={resetErrorBoundary}>Reload App</button>
    </div>
  );
}

function logError(error, info) {
  console.error('App error:', error, info);
  // send to monitoring service here
}

export default function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackUI}
      onError={logError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ReactErrorBoundary>
  );
}
