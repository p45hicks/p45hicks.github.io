import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { CvMenu } from '@p45hicks/cv/CvMenu';
import resumeJson from '@p45hicks/site/resume.json';

const cv: ResumeSchema = resumeJson as ResumeSchema;

describe('CvMenu', () => {
  it('renders menu items and shows basic info content first', () => {
    render(<CvMenu cv={cv} />);

    expect(screen.getByRole('navigation', { name: /cv sections/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Paul Hicks/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('heading', { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByText(/p45hicks@gmail.com/i)).toBeInTheDocument();
  });

  it('switches main content when selecting a menu item', () => {
    render(<CvMenu cv={cv} />);

    fireEvent.click(screen.getByRole('button', { name: /Projects/i }));

    expect(screen.getByRole('heading', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByText(/Managed Services Team Lead/i)).toBeInTheDocument();
  });

  it('applies reusable semantic style classes to layout regions', () => {
    render(<CvMenu cv={cv} />);

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

  it('starts collapsed on mobile trigger and closes after selecting a menu item', () => {
    render(<CvMenu cv={cv} />);

    const trigger = screen.getByRole('button', { expanded: false });
    const items = screen.getByRole('navigation', { name: /cv sections/i }).querySelector('#cv-mobile-menu-items');
    expect(items).not.toBeNull();
    expect(items).toHaveAttribute('data-mobile-state', 'closed');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(items).toHaveAttribute('data-mobile-state', 'open');

    const projectsButton = screen.getAllByRole('button', { name: /Projects/i })[0];
    fireEvent.click(projectsButton);

    expect(screen.getByRole('heading', { name: /Projects/i })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(items).toHaveAttribute('data-mobile-state', 'closed');
  });
});
