import type { JSX } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
/**
 * Shared app shell.
 *
 * Responsibility: render navigation and routes for already-composed section
 * contributions. This component is intentionally feature-agnostic.
 */

export interface AppSection {
  id: string;
  path: string;
  title: string;
  menu: JSX.Element;
  content: JSX.Element;
}

/**
 * Render the top-level navigation and route layout for contributed sections.
 *
 * Use this when module composition has already happened in a parent component.
 */
export default function App({ sections }: { sections: AppSection[] }): JSX.Element {
  const defaultPath = sections[0]?.path ?? '/about';

  return (
    <div className='cv-shell'>
      <aside className='md:sticky md:top-4 h-fit'>
        <nav aria-label='App sections' className='cv-nav-panel'>
          {sections.map((section) => (
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
      </main>
    </div>
  );
}
