import { useMemo, useState, type JSX } from 'react';

import type { ResumeAwardSchema, ResumeEducationSchema, ResumeInterestSchema, ResumeProfileSchema, ResumeProjectSchema, ResumeReferenceSchema, ResumeSchema, ResumeSkillSchema, ResumeWorkSchema, } from '.';
import { ResumeProvider, useResume } from './resumeHooks';


interface CvMenuSection {
  id: string;
  title: string;
  menu: JSX.Element;
  content: JSX.Element;
}

export function CvMenu({ cv }: { cv: ResumeSchema }): JSX.Element {
  return (
    <ResumeProvider resume={cv}>
      <CvMenuContent />
    </ResumeProvider>
  );
}

function CvMenuContent(): JSX.Element {
  const resume = useResume();
  const sections = useMemo(() => buildCvMenuSections(resume), [resume]);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');

  if (sections.length === 0) {
    return <div className='p-4'>No CV sections to display.</div>;
  }

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  return (
    <div className='cv-shell'>
      <aside className='md:sticky md:top-4 h-fit'>
        <nav aria-label='CV sections' className='cv-nav-panel'>
          {sections.map((section) => (
            <button
              key={section.id}
              type='button'
              onClick={() => setActiveSectionId(section.id)}
              aria-current={activeSection.id === section.id ? 'page' : undefined}
              className='cv-nav-item'
            >
              {section.menu}
            </button>
          ))}
        </nav>
      </aside>

      <main className='cv-content-panel'>
        <h2 className='text-2xl font-bold mb-4'>{activeSection.title}</h2>
        <div className='cv-stack'>
          {activeSection.content}
        </div>
      </main>
    </div>
  );
}

function buildCvMenuSections(resume: ResumeSchema): CvMenuSection[] {
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

  if (resume.work && resume.work.length > 0) {
    const careerDuration = getCareerDuration(resume.work);
    sections.push({
      id: 'experience',
      title: 'Experience',
      menu: (
        <div>
          <div className='cv-menu-label'>Experience</div>
          <div className='cv-meta'>{careerDuration} years</div>
        </div>
      ),
      content: (
        <div className='cv-stack-loose'>
          {resume.work.map((work: ResumeWorkSchema, index: number) => (
            <div key={`work-menu-${index}`}>
              <a href={work.url}>{work.name}</a>
              <div>{work.position}</div>
              <div className='text-sm'><em>{formatYear(work.startDate)} - {formatYear(work.endDate)}</em></div>
              <div>{work.summary}</div>
              <ul className='list-disc list-inside'>
                {work.highlights?.map((highlight: string, highlightIndex: number) => (
                  <li key={`work-menu-${index}-highlight-${highlightIndex}`}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    sections.push({
      id: 'projects',
      title: 'Projects',
      menu: (
        <div>
          <div className='cv-menu-label'>Projects</div>
          <div className='cv-meta'>{resume.projects.length} entries</div>
        </div>
      ),
      content: (
        <div className='cv-stack-loose'>
          {resume.projects.map((project: ResumeProjectSchema, index: number) => (
            <div key={`project-menu-${index}`}>
              <a href={project.url}>{project.name}</a>
              <div>{formatYear(project.startDate)} - {formatYear(project.endDate)}</div>
              <div>{project.description}</div>
              <ul className='list-disc list-inside'>
                {project.roles?.map((role: string, roleIndex: number) => (
                  <li key={`project-menu-${index}-${role}-${roleIndex}`}>{role}</li>
                ))}
              </ul>
              {project.highlights?.map((highlight: string, highlightIndex: number) => (
                <div key={`project-menu-${index}-highlight-${highlightIndex}`}>{highlight}</div>
              ))}
            </div>
          ))}
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
    return '';
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

function getCareerDuration(work: ResumeWorkSchema[]): number {
  const thisYear = new Date().getFullYear();
  const jobStartYears = work.map((job) => job.startDate ? new Date(job.startDate).getFullYear() : thisYear);
  const earliestYear = jobStartYears.reduce((earliestYear, currentYearToCheck) => (currentYearToCheck < earliestYear) ? currentYearToCheck : earliestYear);
  const careerDuration = thisYear - earliestYear;
  return careerDuration;
}
