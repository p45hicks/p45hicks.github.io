import { useEffect, useMemo, useState, type JSX } from 'react';

import {
  ResumeAwardSchema, ResumeEducationSchema, ResumeInterestSchema,
  ResumeProfileSchema, ResumeProjectSchema, ResumeReferenceSchema,
  ResumeSchema, ResumeSkillSchema, ResumeWorkSchema
} from '.';
import { ResumeProvider, useResume } from './resumeHooks';
import { Chrono, TimelineItem, type TimelineProps } from 'react-chrono';


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

  const timelineEntries: TimelineItem[] = [];
  if (resume.work && resume.work.length > 0) {
    timelineEntries.push(...resume.work.map((work) => displayWorkDetails(work)));
  }

  if (resume.projects && resume.projects.length > 0) {
    timelineEntries.push(...resume.projects.map((project) => displayProjectDetails(project)));
  }

  if (timelineEntries.length > 0) {
    const careerDuration = getDuration(timelineEntries);
    sections.push({
      id: 'timeline',
      title: 'Timeline',
      menu: (
        <div>
          <div className='cv-menu-label'>Timeline</div>
          <div className='cv-meta'>{careerDuration} years</div>
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
              items={timelineEntries.toSorted((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())}
            />
          </div>
        </div>
      )
    });
  }

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

  if (resume.education && resume.education.length > 0) {
    sections.push({
      id: 'education',
      title: 'Education',
      menu: (
        <div>
          <div className='cv-menu-label'>Education</div>
          <div className='cv-meta'>{resume.education.length} entries</div>
        </div>
      ),
      content: (
        <div className='cv-stack-loose'>
          {resume.education.map((edu: ResumeEducationSchema, index: number) => (
            <div key={`education-menu-${index}`}>
              <a href={edu.url}>{edu.studyType} {edu.area && `(${edu.area})`} at {edu.institution}</a>
              <div className='text-sm'><em>{formatYear(edu.startDate)} - {formatYear(edu.endDate)}</em></div>
              <div><em>{edu.score}</em></div>
              <ul className='text-sm list-disc list-inside'>
                {edu.courses?.map((course: string, courseIndex: number) => (
                  <li key={`education-menu-${index}-course-${courseIndex}`}>{course}</li>
                ))}
              </ul>
            </div>
          ))}
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
        <div className='cv-stack'>
          {resume.awards.map((award: ResumeAwardSchema, index: number) => (
            <div key={`award-menu-${index}`}>
              <p>{award.title} from {award.awarder}</p>
              <p><em>{formatYear(award.date)}</em></p>
              <p>{award.summary}</p>
            </div>
          ))}
        </div>
      )
    });
  }

  return sections;
}

const yearOnly: Intl.DateTimeFormatOptions = { year: 'numeric' };
function formatYear(dateString?: string): string {
  if (dateString === undefined) {
    return 'present';
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // The standard states that if a date string is invalid,
    // the Date constructor should return an "Invalid Date" object,
    // which has a getTime() method that returns NaN.
    // If this happens, we just return the original string.
    // A reasonable use cases for this:
    // - if the date string is just a year, e.g. "2020",
    //    which is valid according to the schema but not a valid
    //    date string for the Date constructor. 
    // - if the date string is "now" or "present", which are commonly
    //   used in resumes to indicate current employment, but are not
    //   valid date strings for the Date constructor.
    return dateString;
  }
  return date.toLocaleDateString(undefined, yearOnly);
}

function getDuration(timeline: TimelineItem[]): number {
  const thisYear = new Date().getFullYear();
  const startYears = timeline.map((period) => period.date ? new Date(period.date).getFullYear() : thisYear);
  const earliestYear = startYears.reduce((earliestYear, currentYearToCheck) => (currentYearToCheck < earliestYear) ? currentYearToCheck : earliestYear);
  const careerDuration = thisYear - earliestYear;
  return careerDuration;
}

function displayWorkDetails(work: ResumeWorkSchema): TimelineItem {
  return {
    title: `${formatYear(work.startDate)} - ${formatYear(work.endDate)}`,
    date: work.startDate,
    cardTitle: `${work.position ?? 'UNSPECIFIED'} at ${work.name ?? 'UNSPECIFIED EMPLOYER'}`,
    cardSubtitle: work.summary,
    timelineContent: (
      <>
        {work.description && <div>{work.name ?? 'UNSPECIFIED EMPLOYER'}{work.description && `, ${work.description}`}{work.location && `, ${work.location}`}</div>}
      </>
    ),
    hasNestedItems: work.highlights && work.highlights.length > 0,
    items: work.highlights?.map((highlight: string) => ({
      cardDetailedText: highlight
    })) ?? []
  };
}

function displayProjectDetails(project: ResumeProjectSchema): TimelineItem {
  return {
    title: `${formatYear(project.startDate)} - ${formatYear(project.endDate)}`,
    date: project.startDate,
    cardTitle: `${project.name ?? 'UNSPECIFIED PROJECT'}`,
    cardSubtitle: `${project.type ? (project.type.charAt(0).toUpperCase() + project.type.slice(1)) : 'Project'}${project.entity ? ' with ' + project.entity : ''}`,
    timelineContent: (
      <>
        <div>{project.description && project.description}</div>
      </>
    ),
    hasNestedItems: project.highlights && project.highlights.length > 0,
    items: project.highlights?.map((highlight: string) => ({
      cardDetailedText: highlight
    })) ?? []
  };
}

