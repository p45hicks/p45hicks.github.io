import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '@p45hicks/site/App';

describe('App', () => {
  it('renders welcome message', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getAllByText(/Paul Hicks/i).length).toBeGreaterThanOrEqual(1);
  })

  it('renders shared app-level menu contributions and can render the About route', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: /app sections/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Experience/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Paul Hicks/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
  })
})
