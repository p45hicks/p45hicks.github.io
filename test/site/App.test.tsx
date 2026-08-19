import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('starts with mobile menu collapsed', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App sections={aboutSections} />
      </MemoryRouter>
    )

    const trigger = screen.getByRole('button', { expanded: false });
    const items = screen.getByRole('navigation', { name: /app sections/i }).querySelector('#app-mobile-menu-items');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(items).not.toBeNull();
    expect(items as HTMLElement).toHaveAttribute('data-mobile-state', 'closed');
  })

  it('opens and then closes mobile menu via trigger and selection', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App sections={aboutSections} />
      </MemoryRouter>
    )

    const trigger = screen.getByRole('button', { expanded: false });
    const items = screen.getByRole('navigation', { name: /app sections/i }).querySelector('#app-mobile-menu-items') as HTMLElement;

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(items).toHaveAttribute('data-mobile-state', 'open');

    const aboutLink = screen.getByRole('link', { name: /about/i });
    fireEvent.click(aboutLink);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(items).toHaveAttribute('data-mobile-state', 'closed');
  })
})
