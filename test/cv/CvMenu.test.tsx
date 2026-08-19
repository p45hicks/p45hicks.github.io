import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { useCvMenuContributions } from '@p45hicks/cv/CvMenu';
import resumeJson from '@p45hicks/site/resume.json';

const cv: ResumeSchema = resumeJson as ResumeSchema;

/**
 * Test harness that renders CV module section routes from the hook output.
 * This validates the CV module independently of site-level App composition.
 */
function CvModuleRoutes(): JSX.Element {
  const sections = useCvMenuContributions(cv);
  const defaultPath = sections[0]?.path ?? '/profile';

  return (
    <Routes>
      {sections.map((section) => (
        <Route
          key={section.id}
          path={section.path}
          element={(
            <section className='cv-stack'>
              <h2 className='text-2xl font-bold'>{section.title}</h2>
              {section.content}
            </section>
          )}
        />
      ))}
      <Route path='/' element={<Navigate to={defaultPath} replace />} />
      <Route path='*' element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}

describe('CV module contributions', () => {
  it('renders profile content from CV route contributions', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <CvModuleRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByText(/p45hicks@gmail.com/i)).toBeInTheDocument();
  });

  it('renders experience content from CV route contributions', () => {
    render(
      <MemoryRouter initialEntries={['/experience']}>
        <CvModuleRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Experience/i })).toBeInTheDocument();
    expect(screen.getByText(/Managed Services Team Lead/i)).toBeInTheDocument();
  });

  it('redirects unknown routes to the CV default section', () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <CvModuleRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Profile/i })).toBeInTheDocument();
  });
});
