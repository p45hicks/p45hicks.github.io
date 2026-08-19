import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App, { type AppSection } from '@p45hicks/site/App';
import { createAboutModuleSection } from '@p45hicks/site/aboutModule';

const aboutSections: AppSection[] = [createAboutModuleSection('Test User')];

describe('App', () => {
  it('renders the about section when routed to /about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App sections={aboutSections} />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: /app sections/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
    expect(screen.getByText(/This app uses a shared route-driven menu/i)).toBeInTheDocument();
    expect(screen.getByText(/CV content belongs to Test User\./i)).toBeInTheDocument();
  })

  it('redirects unknown routes to the about default route', () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <App sections={aboutSections} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
  })

  it('redirects root route to the about default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App sections={aboutSections} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
  })
})
