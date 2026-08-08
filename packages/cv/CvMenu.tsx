import { useEffect, useMemo, useState, type JSX } from 'react';
import { Chrono, type TimelineProps } from 'react-chrono';

import {
  ResumeAwardSchema, ResumeInterestSchema,
  ResumeProfileSchema, ResumeReferenceSchema,
  ResumeSchema, ResumeSkillSchema
} from '.';

import { ResumeProvider, useResume } from './resumeHooks';
import { Experience } from './Experience';

interface CvMenuSection {
  id: string;
  title: string;
  menu: JSX.Element;
  content: JSX.Element;
}

const CV_CHRONO_THEME: TimelineProps['theme'] = {
  primary: 'var(--cv-accent)',
  secondary: 'var(--cv-accent-strong)',
  timelineBgColor: 'var(--cv-surface)',
  textColor: 'var(--cv-text)',
  titleColor: 'var(--cv-text-muted)',
  titleColorActive: 'var(--cv-text)',
  cardBgColor: 'var(--cv-surface)',
  cardDetailsBackGround: 'var(--cv-surface)',
  cardDetailsColor: 'var(--cv-text)',
  cardTitleColor: 'var(--cv-text)',
  cardSubtitleColor: 'var(--cv-text-muted)',
  detailsColor: 'var(--cv-text)',
  toolbarBgColor: 'var(--cv-surface-muted)',
  toolbarTextColor: 'var(--cv-text)',
  toolbarBtnBgColor: 'var(--cv-surface-active)',
  shadowColor: 'var(--cv-border)'
};

export function CvMenu({ cv }: { cv: ResumeSchema }): JSX.Element {
  return (
    <ResumeProvider resume={cv}>
      <CvMenuContent />
    </ResumeProvider>
  );
}

function CvMenuContent(): JSX.Element {
  const resume = useResume();
  const isDesktopTimeline = useIsDesktopTimeline();
  const sections = useMemo(() => buildCvMenuSections(resume, isDesktopTimeline), [resume, isDesktopTimeline]);
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

const DESKTOP_TIMELINE_MEDIA_QUERY = '(min-width: 768px)';

function useIsDesktopTimeline(): boolean {
  const [isDesktopTimeline, setIsDesktopTimeline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueryList = window.matchMedia(DESKTOP_TIMELINE_MEDIA_QUERY);
    const onMediaQueryChange = (): void => {
      setIsDesktopTimeline(mediaQueryList.matches);
    };

    onMediaQueryChange();
    mediaQueryList.addEventListener('change', onMediaQueryChange);

    return () => {
      mediaQueryList.removeEventListener('change', onMediaQueryChange);
    };
  }, []);

  return isDesktopTimeline;
}

function buildCvMenuSections(resume: ResumeSchema, isDesktopTimeline: boolean): CvMenuSection[] {
  const sections: CvMenuSection[] = [];

  sections.push({
    id: 'basic-info',
    title: 'Profile',
    menu: (
      <div>
        <div className='cv-menu-label'>{resume.basics?.name ?? 'Basic Info'}</div>
        <div className='cv-meta'>{resume.basics?.label ?? 'Profile'}</div>
      </div>
    ),
    content: (
      <div className='grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start'>
        <div>
          <div className='text-2xl font-bold'>{resume.basics?.name}</div>
          <div>{resume.basics?.label}</div>
          <div className='mt-2'>{resume.basics?.email}</div>
          <div>{resume.basics?.phone}</div>
          {resume.basics?.summary && <p className='mt-3'>{resume.basics.summary}</p>}
          {resume.basics?.profiles && resume.basics.profiles.length > 0 && <div className='mt-3 flex flex-wrap items-center gap-2'>
            {resume.basics.profiles.map((profile: ResumeProfileSchema, index: number) => (
              <div key={`social-${index}`}>
                {profile.html ? (
                  <div dangerouslySetInnerHTML={{ __html: profile.html }} />
                ) : (
                  <a href={profile.url} target='_blank' rel='noopener noreferrer'>{profile.network}</a>
                )}
              </div>
            ))}
          </div>}
        </div>
        {resume.basics?.image && (
          <img
            className='h-24 place-self-center rounded-md'
            src={resume.basics.image}
            alt={resume.basics?.name ?? 'Profile image'}
          />
        )}
      </div>
    )
  });

  const experience = new Experience(resume);
  const workExperience = [...experience.getWork(), ...experience.getProjects()].toSorted(experience.byDateDescending);
  sections.push({
    id: 'timeline',
    title: 'Experience',
    menu: (
      <div>
        <div className='cv-menu-label'>Experience</div>
        <div className='cv-meta'>{Experience.duration(workExperience)} years</div>
      </div>
    ),
    content: (
      <div className='cv-timeline-wrap'>
        <div className='cv-timeline'>
          <Chrono
            mode={isDesktopTimeline ? 'alternating' : 'vertical'}
            theme={CV_CHRONO_THEME}
            darkMode={{
              enabled: false,
              showToggle: false
            }}
            display={{
              toolbar: {
                enabled: false
              }
            }}
            content={{
              semanticTags: {
                title: 'span',
                subtitle: 'span'
              }
            }}
            style={{
              classNames: {
                title: 'cv-chrono-title'
              }
            }}
            items={workExperience}
          />
        </div>
      </div>
    )
  });

  if (resume.skills && resume.skills.length > 0) {
    sections.push({
      id: 'skills',
      title: 'Skills',
      menu: (
        <div>
          <div className='cv-menu-label'>Skills</div>
          <div className='cv-meta'>{resume.skills.length} skill groups</div>
        </div>
      ),
      content: (
        <div className='cv-stack'>
          {resume.skills.map((skill: ResumeSkillSchema, index: number) => (
            <div key={`skill-menu-${index}`}>
              <p>{skill.level} {skill.name}</p>
              <p><em>{skill.keywords?.join(', ')}</em></p>
            </div>
          ))}
        </div>
      )
    });
  }

  if (resume.interests && resume.interests.length > 0) {
    sections.push({
      id: 'interests',
      title: 'Interests',
      menu: (
        <div>
          <div className='cv-menu-label'>Interests</div>
          <div className='cv-meta'>{resume.interests.length} areas</div>
        </div>
      ),
      content: (
        <div className='cv-stack'>
          {resume.interests.map((interest: ResumeInterestSchema, index: number) => (
            <div key={`interest-menu-${index}`}>
              <p>{interest.name}</p>
              <p><em>{interest.keywords?.join(', ')}</em></p>
            </div>
          ))}
        </div>
      )
    });
  }

  const education = experience.getEducation().toSorted(experience.byDateDescending);
  if (education.length > 0) {
    sections.push({
      id: 'education',
      title: 'Education',
      menu: (
        <div>
          <div className='cv-menu-label'>Education</div>
          <div className='cv-meta'>{education.length} course{education.length !== 1 ? 's' : ''} over {Experience.duration(education, new Date(resume.education![0].endDate!))} years</div>
        </div>
      ),
      content: (
        <div className='cv-timeline-wrap'>
          <div className='cv-timeline'>
            <Chrono
              mode={isDesktopTimeline ? 'alternating' : 'vertical'}
              theme={CV_CHRONO_THEME}
              darkMode={{
                enabled: false,
                showToggle: false
              }}
              display={{
                toolbar: {
                  enabled: false
                }
              }}
              content={{
                semanticTags: {
                  title: 'span',
                  subtitle: 'span'
                }
              }}
              style={{
                classNames: {
                  title: 'cv-chrono-title'
                }
              }}
              items={education}
            />
          </div>
        </div>
      )
    });
  }

  if (resume.references && resume.references.length > 0) {
    sections.push({
      id: 'references',
      title: 'References',
      menu: (
        <div>
          <div className='cv-menu-label'>References</div>
          <div className='cv-meta'>{resume.references.length} recommendations</div>
        </div>
      ),
      content: (
        <div className='cv-stack-loose'>
          {resume.references.map((ref: ResumeReferenceSchema, index: number) => (
            <div key={`reference-menu-${index}`}>
              <p>{ref.reference}</p>
              <p>- <em>{ref.name}</em></p>
            </div>
          ))}
        </div>
      )
    });
  }

  if (resume.awards && resume.awards.length > 0) {
    const awards = experience.getAwards().toSorted(experience.byDateDescending);
    sections.push({
      id: 'awards',
      title: 'Awards',
      menu: (
        <div>
          <div className='cv-menu-label'>Awards</div>
          <div className='cv-meta'>{resume.awards.length} awards</div>
        </div>
      ),
      content: (
        <div className='cv-timeline-wrap'>
          <div className='cv-timeline'>
            <Chrono
              mode={isDesktopTimeline ? 'alternating' : 'vertical'}
              theme={CV_CHRONO_THEME}
              darkMode={{
                enabled: false,
                showToggle: false
              }}
              display={{
                toolbar: {
                  enabled: false
                }
              }}
              content={{
                semanticTags: {
                  title: 'span',
                  subtitle: 'span'
                }
              }}
              style={{
                classNames: {
                  title: 'cv-chrono-title'
                }
              }}
              items={awards}
            />
          </div>
        </div>
      )
    });
  }

  return sections;
}

