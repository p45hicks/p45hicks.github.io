import { useMemo, type JSX } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useCvMenuContributions } from '@p45hicks/cv/CvMenu';
import { createAboutModuleSection } from './aboutModule';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import resumeJson from './resume.json';
const cv: ResumeSchema = resumeJson as ResumeSchema;

export default function App(): JSX.Element {
  const cvSections = useCvMenuContributions(cv);
  const aboutSection = createAboutModuleSection(cv.basics?.name);

  const appSections = useMemo(
    () => [
      ...cvSections,
      aboutSection
    ],
    [aboutSection, cvSections]
  );

  const defaultPath = appSections[0]?.path ?? '/about';

  return (
    <div className='cv-shell'>
      <aside className='md:sticky md:top-4 h-fit'>
        <nav aria-label='App sections' className='cv-nav-panel'>
          {appSections.map((section) => (
            <NavLink
              key={section.id}
              to={section.path}
              className='cv-nav-item block'
            >
              {section.menu}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className='cv-content-panel'>
        <Routes>
          {appSections.map((section) => (
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
      </main>
    </div>
  );
}
