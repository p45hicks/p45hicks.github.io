import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { CvMenu } from '@p45hicks/cv/CvMenu';
import resumeJson from '@p45hicks/site/resume.json';

const cv: ResumeSchema = resumeJson as ResumeSchema;

function renderCvMenu(): void {
  render(<CvMenu cv={cv} />);
}

function getMobileMenuElements(): { trigger: HTMLElement; items: HTMLElement } {
  const trigger = screen.getByRole('button', { expanded: false });
  const items = screen.getByRole('navigation', { name: /cv sections/i }).querySelector('#cv-mobile-menu-items');

  expect(items).not.toBeNull();

  return {
    trigger,
    items: items as HTMLElement
  };
}

describe('CvMenu', () => {
  it('renders menu items and shows basic info content first', () => {
    renderCvMenu();

    expect(screen.getByRole('navigation', { name: /cv sections/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Paul Hicks/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('heading', { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByText(/p45hicks@gmail.com/i)).toBeInTheDocument();
  });

  it('switches main content when selecting a menu item', async () => {
    renderCvMenu();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Experience/i }));
      await Promise.resolve();
    });

    expect(screen.getByRole('heading', { name: /Experience/i })).toBeInTheDocument();
    expect(screen.getByText(/Managed Services Team Lead/i)).toBeInTheDocument();
  });

  it('applies reusable semantic style classes to layout regions', () => {
    renderCvMenu();

    const nav = screen.getByRole('navigation', { name: /cv sections/i });
    expect(nav).toHaveClass('cv-nav-panel');

    const activeMenuItem = nav.querySelector('button[aria-current="page"]');
    expect(activeMenuItem).not.toBeNull();
    expect(activeMenuItem).toHaveClass('cv-nav-item');
    expect(activeMenuItem).toHaveAttribute('aria-current', 'page');

    const heading = screen.getByRole('heading', { name: /Profile/i });
    const panel = heading.closest('main');
    expect(panel).not.toBeNull();
    expect(panel).toHaveClass('cv-content-panel');
  });

  it('starts collapsed on mobile trigger', () => {
    renderCvMenu();
    const { trigger, items } = getMobileMenuElements();

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(items).toHaveAttribute('data-mobile-state', 'closed');
  });

  it('opens the mobile menu when clicking the trigger', async () => {
    renderCvMenu();
    const { trigger, items } = getMobileMenuElements();

    await act(async () => {
      fireEvent.click(trigger);
      await Promise.resolve();
    });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(items).toHaveAttribute('data-mobile-state', 'open');
  });

  it('closes the mobile menu and switches section when selecting an item', async () => {
    renderCvMenu();
    const { trigger, items } = getMobileMenuElements();

    expect(items).toHaveAttribute('data-mobile-state', 'closed');

    await act(async () => {
      fireEvent.click(trigger);
      await Promise.resolve();
    });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(items).toHaveAttribute('data-mobile-state', 'open');

    const experienceButton = screen.getAllByRole('button', { name: /Experience/i })[0];
    await act(async () => {
      fireEvent.click(experienceButton);
      await Promise.resolve();
    });

    expect(screen.getByRole('heading', { name: /Experience/i })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(items).toHaveAttribute('data-mobile-state', 'closed');
  });
});
