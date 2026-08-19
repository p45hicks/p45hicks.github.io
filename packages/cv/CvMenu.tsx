import { useMemo, useState, type JSX } from 'react';

import type { ResumeSchema } from '.';

import { ResumeProvider, useResume } from './resumeHooks';
import { getCvMenuSections } from './cvMenu/getCvMenuSections';
import type { CvMenuContribution } from './cvMenu/types';
import { useIsDesktopTimeline } from './cvMenu/useIsDesktopTimeline';

export type { CvMenuContribution } from './cvMenu/types';

export function CvMenu({ cv }: { cv: ResumeSchema }): JSX.Element {
  return (
    <ResumeProvider resume={cv}>
      <CvMenuContent />
    </ResumeProvider>
  );
}

export function useCvMenuContributions(cv: ResumeSchema): CvMenuContribution[] {
  const isDesktopTimeline = useIsDesktopTimeline();
  const sections = useMemo(() => getCvMenuSections(cv, isDesktopTimeline), [cv, isDesktopTimeline]);

  return useMemo(
    () => sections.map((section) => ({
      ...section,
      path: `/${section.id}`
    })),
    [sections]
  );
}

function CvMenuContent(): JSX.Element {
  const resume = useResume();
  const isDesktopTimeline = useIsDesktopTimeline();
  const sections = useMemo(() => getCvMenuSections(resume, isDesktopTimeline), [resume, isDesktopTimeline]);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (sections.length === 0) {
    return <div className='p-4'>No CV sections to display.</div>;
  }

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  function handleSectionSelect(sectionId: string): void {
    setActiveSectionId(sectionId);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className='cv-shell'>
      <aside className='md:sticky md:top-4 h-fit'>
        <nav aria-label='CV sections' className='cv-nav-panel'>
          <button
            type='button'
            className='cv-nav-item md:hidden'
            aria-expanded={isMobileMenuOpen}
            aria-controls='cv-mobile-menu-items'
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            <div className='flex items-center justify-between gap-3'>
              <div>{activeSection.menu}</div>
              <span aria-hidden='true' className='text-sm'>
                {isMobileMenuOpen ? '▲' : '▼'}
              </span>
            </div>
          </button>

          <div
            id='cv-mobile-menu-items'
            data-mobile-state={isMobileMenuOpen ? 'open' : 'closed'}
            className={isMobileMenuOpen ? 'block md:block' : 'hidden md:block'}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                type='button'
                onClick={() => handleSectionSelect(section.id)}
                aria-current={activeSection.id === section.id ? 'page' : undefined}
                className='cv-nav-item'
              >
                {section.menu}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      <main className='cv-content-panel'>
        <h2 className='text-2xl font-bold mb-4'>{activeSection.title}</h2>
        <div className='cv-stack'>{activeSection.content}</div>
      </main>
    </div>
  );
}

