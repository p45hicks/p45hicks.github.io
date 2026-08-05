import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { CvMenu } from '@p45hicks/cv/Cv';
import resumeJson from '@p45hicks/site/resume.json';

const cv: ResumeSchema = resumeJson as ResumeSchema;

describe('CvMenu', () => {
  it('renders menu items and shows basic info content first', () => {
    render(<CvMenu cv={cv} />);

    expect(screen.getByRole('navigation', { name: /cv sections/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Paul Hicks/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Basic Info/i })).toBeInTheDocument();
    expect(screen.getByText(/p45hicks@gmail.com/i)).toBeInTheDocument();
  });

  it('switches main content when selecting a menu item', () => {
    render(<CvMenu cv={cv} />);

    fireEvent.click(screen.getByRole('button', { name: /Projects/i }));

    expect(screen.getByRole('heading', { name: /Projects/i })).toBeInTheDocument();
    expect(screen.getByText(/Managed Services Team Lead/i)).toBeInTheDocument();
  });
});
