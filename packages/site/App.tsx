import { useEffect, useState, type JSX } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
/**
 * Shared app shell.
 *
 * Responsibilities:
 * - Render navigation and routes for already-composed section contributions.
 * - Manage mobile navigation expand/collapse behavior for those sections.
 *
 * This component is intentionally feature-agnostic.
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
 * Use this when module composition has already happened in a parent component,
 * and when shared mobile menu toggle/collapse behavior should be applied.
 */
export default function App({ sections }: { sections: AppSection[] }): JSX.Element {
  const location = useLocation();
  const defaultPath = sections[0]?.path ?? '/about';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = sections.find((section) => section.path === location.pathname) ?? sections[0];

  // Keep the mobile menu collapsed after navigation, regardless of how route changes occur.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className='cv-shell'>
      <aside className='md:sticky md:top-4 h-fit'>
        <nav aria-label='App sections' className='cv-nav-panel'>
          <button
            type='button'
            className='cv-nav-item md:hidden'
            aria-expanded={isMobileMenuOpen}
            aria-controls='app-mobile-menu-items'
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            <div className='flex items-center justify-between gap-3'>
              <div>{activeSection?.menu}</div>
              <span aria-hidden='true' className='text-sm'>
                {isMobileMenuOpen ? '▲' : '▼'}
              </span>
            </div>
          </button>

          <div
            id='app-mobile-menu-items'
            data-mobile-state={isMobileMenuOpen ? 'open' : 'closed'}
            className={isMobileMenuOpen ? 'block md:block' : 'hidden md:block'}
          >
            {sections.map((section) => (
              <NavLink
                key={section.id}
                to={section.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className='cv-nav-item block'
              >
                {section.menu}
              </NavLink>
            ))}
          </div>
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
