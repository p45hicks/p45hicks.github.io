import { useMemo, useState, type JSX } from 'react';

import type { ResumeAwardSchema, ResumeEducationSchema, ResumeInterestSchema, ResumeProfileSchema, ResumeProjectSchema, ResumeReferenceSchema, ResumeSchema, ResumeSkillSchema, ResumeWorkSchema, } from '.';
import { ResumeProvider, useResume } from './resumeHooks';
import {
  Card, CardHeader, CardContent,
  FlipCard, FlipCardFront, FlipCardBack,
  CardDeck, TopCard, HiddenCards
} from '@p45hicks/elements/Card';

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

export function CV({ cv }: { cv: ResumeSchema }): JSX.Element {
  return (
    <ResumeProvider resume={cv}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <BasicInfo />
        <Socials />
        <WorkExperience />
        <References />
        <Projects />
        <Skills />
        <Interests />
        <Education />
        <Awards />
      </div>
    </ResumeProvider>
  );
}

export function BasicInfo(): JSX.Element {
  const resume = useResume();
  return (
    <FlipCard className='BasicInfo w-full max-w-xs h-64 rounded-lg shadow-md flex flex-col'>
      <FlipCardFront>
        <div className="grid grid-cols-2 grid-rows-1 m-2">
          <div>
            <div className='text-2xl font-bold'>{resume.basics?.name}</div>
            <div>{resume.basics?.label}</div>
          </div>
          <img className='h-25 col-2 place-self-center' src={resume.basics?.image} alt={resume.basics?.name ?? 'Profile image'} />
        </div>
      </FlipCardFront>
      <FlipCardBack>
        <div className="grid grid-cols-2 grid-rows-1 m-2">
          <div>
            <div className='text-2xl font-bold'>{resume.basics?.name}</div>
            <div className='col-1'>{resume.basics?.email}</div>
            <div className='col-1'>{resume.basics?.phone}</div>
          </div>
          <img className='h-25 col-2 place-self-center' src={resume.basics?.image} alt={resume.basics?.name ?? 'Profile image'} />
        </div>
      </FlipCardBack>
    </FlipCard>
  );
}

export function Socials(): JSX.Element {
  const resume = useResume();
  return (
    <Card className='Socials'>
      <CardHeader title='Socials' />
      <CardContent>
        {resume.basics?.profiles?.map((profile: ResumeProfileSchema, index: number) => (
          <div key={`profile-${index}`} className='ml-10'>
            <a href={profile.url} target="_blank" rel="noopener noreferrer">{profile.network}</a>
          </div>
        )) || []}
      </CardContent>
    </Card>
  );
}

function getCareerDuration(work: ResumeWorkSchema[]): number {
  const thisYear = new Date().getFullYear();
  const jobStartYears = work.map((job) => job.startDate ? new Date(job.startDate).getFullYear() : thisYear);
  const earliestYear = jobStartYears.reduce((earliestYear, currentYearToCheck) => (currentYearToCheck < earliestYear) ? currentYearToCheck : earliestYear);
  const careerDuration = thisYear - earliestYear;
  return careerDuration;
}

export function WorkExperience(): JSX.Element {
  const resume = useResume();
  if (!resume.work || resume.work.length === 0) {
    return <></>;
  };

  const careerDuration = getCareerDuration(resume.work);

  const cardStack = resume.work.map((work: ResumeWorkSchema, index: number) => (
    <div key={`work-${index}`}>
      <a href={work.url}>{work.name}</a>
      <div>{work.position}</div>
      <div className='text-sm'><em>{formatYear(work.startDate)} - {formatYear(work.endDate)}</em></div>
      <div>{work.summary}</div>
      <ul>
        {work.highlights?.map((highlight: string, highlightIndex: number) => (
          <li key={`work-${index}-highlight-${highlightIndex}`}>{highlight}</li>
        ))}
      </ul>
    </div>
  ));

  return (
    <CardDeck className='WorkExperience'>
      <TopCard>
        <CardContent>
          <CardHeader title='Experience' />
          {<p>Click to read the details of a career spanning {careerDuration} years.</p>}
        </CardContent>
      </TopCard>
      <HiddenCards>
        {cardStack}
      </HiddenCards>
    </CardDeck>);
}

export function Projects(): JSX.Element {
  const resume = useResume();
  if (!resume.projects || resume.projects.length === 0) {
    return <></>;
  }

  const cardStack = resume.projects.map((project: ResumeProjectSchema, index: number) => (
    <div key={`project-${index}`}>
      <a href={project.url}>{project.name}</a>
      <div>{formatYear(project.startDate)} - {formatYear(project.endDate)}</div>
      <div>{project.description}</div>
      <ul className='list-disc list-inside'>
        {project.roles?.map((role: string, roleIndex: number) => (
          <li key={`project-${index}-${role}-${roleIndex}`}>{role}</li>
        ))}
      </ul>
      {
        project.highlights?.map((highlight: string, highlightIndex: number) => (
          <div key={`project-${index}-highlight-${highlightIndex}`}>{highlight}</div>
        ))
      }
    </div>
  ));

  return (
    <CardDeck className='Projects'>
      <TopCard>
        <CardContent>
          <CardHeader title='Projects' />
          <p>Click to read the details of {resume.projects.length} projects.</p>
        </CardContent>
      </TopCard>
      <HiddenCards>
        {cardStack}
      </HiddenCards>
    </CardDeck>
  );
}

export function Education(): JSX.Element {
  const resume = useResume();
  if (!resume.education || resume.education.length === 0) {
    return <></>;
  };

  return (
    <CardDeck className='Education'>
      <TopCard>
        <CardContent>
          <CardHeader title='Education' />
          <p>Click to read about my educational background.</p>
        </CardContent>
      </TopCard>
      <HiddenCards>
        {resume.education.map((edu: ResumeEducationSchema, index: number) => (
          <div key={`education-${index}`}>
            <a href={edu.url}>{edu.studyType} {edu.area && `(${edu.area})`} at {edu.institution}</a>
            <div className='text-sm'><em>{formatYear(edu.startDate)} - {formatYear(edu.endDate)}</em></div>
            <div><em>{edu.score}</em></div>
            <ul className='text-sm text-indent-2'>
              {edu.courses?.map((course: string, courseIndex: number) => (
                <li key={`education-${index}-course-${courseIndex}`}>{course}</li>
              ))}
            </ul>
          </div>
        ))}
      </HiddenCards>
    </CardDeck>
  );
}

export function Skills(): JSX.Element {
  const resume = useResume();
  if (!resume.skills || resume.skills.length === 0) {
    return <></>;
  };

  return (
    <CardDeck className='Skills'>
      <TopCard>
        <CardContent>
          <CardHeader title='Skills' />
          <p>Click to read about my skills and experience level with each.</p>
        </CardContent>
      </TopCard>
      <HiddenCards>
        {resume.skills.map((skill: ResumeSkillSchema, index: number) => (
          <div key={`skill-${index}`}>
            <p>{skill.level} {skill.name}</p>
            <p><em>{skill.keywords?.join(', ')}</em></p>
          </div>
        ))}
      </HiddenCards>
    </CardDeck>
  );
}


export function Interests(): JSX.Element {
  const resume = useResume();
  return (
    <CardDeck className='Interests'>
      <TopCard>
        <CardContent>
          <CardHeader title='Interests' />
          <p>Click to read about my interests.</p>
        </CardContent>
      </TopCard>
      <HiddenCards>
        {resume.interests?.map((interest: ResumeInterestSchema, index: number) => (
          <div key={`interest-${index}`}>
            <p>{interest.name}</p>
            <p><em>{interest.keywords?.join(', ')}</em></p>
          </div>
        )) || []}
      </HiddenCards>
    </CardDeck>
  );
}

export function References(): JSX.Element {
  const resume = useResume();
  if (!resume.references || resume.references.length === 0) {
    return <></>;
  };

  return (
    <CardDeck className='References'>
      <TopCard>
        <CardContent>
          <CardHeader title='References' />
          <p>{resume.references.length} people have been kind enough to provide references on LinkedIn.</p>
        </CardContent>
      </TopCard>
      <HiddenCards>
        {resume.references.map((ref: ResumeReferenceSchema, index: number) => (
          <div key={`reference-${index}`}>
            <p className="mt-10">{ref.reference}</p>
            <p>- <em>{ref.name}</em></p>
          </div>
        ))}
      </HiddenCards>
    </CardDeck>
  );
}

export function Awards(): JSX.Element {
  const resume = useResume();
  if (!resume.awards || resume.awards.length === 0) {
    return <></>;
  };

  return (
    <CardDeck className='Awards'>
      <TopCard>
        <CardContent>
          <CardHeader title='Awards' />
          <p>Click to read about {resume.awards.length} awards won.</p>
        </CardContent>
      </TopCard>
      <HiddenCards>
        {resume.awards.map((award: ResumeAwardSchema, index: number) => (
          <div key={`award-${index}`}>
            <p>{award.title} from {award.awarder}</p>
            <p><em>{formatYear(award.date)}</em></p>
            <p>{award.summary}</p>
          </div>
        ))}
      </HiddenCards>
    </CardDeck>
  );
}

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
    <div className='grid grid-cols-1 md:grid-cols-[18rem_minmax(0,1fr)] gap-4 p-4'>
      <aside className='md:sticky md:top-4 h-fit'>
        <nav aria-label='CV sections' className='rounded-lg shadow-md border border-gray-300 bg-gray-100 p-2'>
          {sections.map((section) => (
            <button
              key={section.id}
              type='button'
              onClick={() => setActiveSectionId(section.id)}
              aria-current={activeSection.id === section.id ? 'page' : undefined}
              className='w-full text-left p-3 rounded-md transition-colors hover:bg-gray-200 aria-[current=page]:bg-white aria-[current=page]:shadow-sm'
            >
              {section.menu}
            </button>
          ))}
        </nav>
      </aside>

      <main className='rounded-lg shadow-md border border-gray-300 bg-white p-6'>
        <h2 className='text-2xl font-bold mb-4'>{activeSection.title}</h2>
        <div className='space-y-4'>
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
    title: 'Basic Info',
    menu: (
      <div>
        <div className='font-semibold'>{resume.basics?.name ?? 'Basic Info'}</div>
        <div className='text-sm text-gray-600'>{resume.basics?.label ?? 'Profile'}</div>
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

  if (resume.basics?.profiles && resume.basics.profiles.length > 0) {
    sections.push({
      id: 'socials',
      title: 'Socials',
      menu: (
        <div>
          <div className='font-semibold'>Socials</div>
          <div className='text-sm text-gray-600'>{resume.basics.profiles.length} profiles</div>
        </div>
      ),
      content: (
        <div className='space-y-2'>
          {resume.basics.profiles.map((profile: ResumeProfileSchema, index: number) => (
            <div key={`social-${index}`}>
              <a href={profile.url} target='_blank' rel='noopener noreferrer'>{profile.network}</a>
            </div>
          ))}
        </div>
      )
    });
  }

  if (resume.work && resume.work.length > 0) {
    const careerDuration = getCareerDuration(resume.work);
    sections.push({
      id: 'experience',
      title: 'Experience',
      menu: (
        <div>
          <div className='font-semibold'>Experience</div>
          <div className='text-sm text-gray-600'>{careerDuration} years</div>
        </div>
      ),
      content: (
        <div className='space-y-6'>
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
          <div className='font-semibold'>Projects</div>
          <div className='text-sm text-gray-600'>{resume.projects.length} entries</div>
        </div>
      ),
      content: (
        <div className='space-y-6'>
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
          <div className='font-semibold'>Skills</div>
          <div className='text-sm text-gray-600'>{resume.skills.length} skill groups</div>
        </div>
      ),
      content: (
        <div className='space-y-4'>
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
          <div className='font-semibold'>Interests</div>
          <div className='text-sm text-gray-600'>{resume.interests.length} areas</div>
        </div>
      ),
      content: (
        <div className='space-y-4'>
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
          <div className='font-semibold'>Education</div>
          <div className='text-sm text-gray-600'>{resume.education.length} entries</div>
        </div>
      ),
      content: (
        <div className='space-y-6'>
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
          <div className='font-semibold'>References</div>
          <div className='text-sm text-gray-600'>{resume.references.length} recommendations</div>
        </div>
      ),
      content: (
        <div className='space-y-6'>
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
          <div className='font-semibold'>Awards</div>
          <div className='text-sm text-gray-600'>{resume.awards.length} awards</div>
        </div>
      ),
      content: (
        <div className='space-y-4'>
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
