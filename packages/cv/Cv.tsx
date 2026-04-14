import type { JSX } from 'react';

import type { ResumeAwardSchema, ResumeEducationSchema, ResumeInterestSchema, ResumeProfileSchema, ResumeProjectSchema, ResumeReferenceSchema, ResumeSchema, ResumeSkillSchema, ResumeWorkSchema, } from '.';
import { ResumeProvider, useResume } from './resumeHooks';
import { Card, CardHeader, CardContent, FlipCard, FlipCardFront, FlipCardBack } from '@p45hicks/elements/Card';

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
      <>
        <BasicInfo />
        <Socials />
        <WorkExperience />
        <References />
        <Projects />
        <Skills />
        <Interests />
        <Education />
        <Awards />
      </>
    </ResumeProvider>
  );
}

export function BasicInfo(): JSX.Element {
  const resume = useResume();
  return (
    <FlipCard className='BasicInfo h-30 w-100 m-2'>
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
          <div key={`profile-${index}`}>
            <a href={profile.url} target="_blank" rel="noopener noreferrer">{profile.network}</a>
          </div>
        )) || []}
      </CardContent>
    </Card>
  );
}

export function WorkExperience(): JSX.Element {
  const resume = useResume();
  return (
    <Card className='WorkExperience'>
      <CardHeader title='Experience' />
      <CardContent>
        {resume.work?.map((work: ResumeWorkSchema, index: number) => (
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
        )) || []}
      </CardContent>
    </Card>
  );
}

export function Projects(): JSX.Element {
  const resume = useResume();
  return (
    <Card className='Projects'>
      <CardHeader title='Projects' />
      <CardContent>
        {resume.projects?.map((project: ResumeProjectSchema, index: number) => (
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
        )) || []}
      </CardContent>
    </Card>
  );
}

export function Education(): JSX.Element {
  const resume = useResume();
  return (
    <Card className='Education'>
      <CardHeader title='Education' />
      <CardContent>
        {resume.education?.map((edu: ResumeEducationSchema, index: number) => (
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
        )) || []}
      </CardContent>
    </Card>
  );
}

export function Skills(): JSX.Element {
  const resume = useResume();
  return (
    <Card className='Skills'>
      <CardHeader title='Skills' />
      <CardContent>
        {resume.skills?.map((skill: ResumeSkillSchema, index: number) => (
          <div key={`skill-${index}`}>
            <p>{skill.level} {skill.name}</p>
            <p><em>{skill.keywords?.join(', ')}</em></p>
          </div>
        )) || []}
      </CardContent>
    </Card>
  );
}

export function Interests(): JSX.Element {
  const resume = useResume();
  return (
    <Card className='Interests'>
      <CardHeader title='Interests' />
      <CardContent>
        {resume.interests?.map((interest: ResumeInterestSchema, index: number) => (
          <div key={`interest-${index}`}>
            <p>{interest.name}</p>
            <p><em>{interest.keywords?.join(', ')}</em></p>
          </div>
        )) || []}
      </CardContent>
    </Card>
  );
}

export function References(): JSX.Element {
  const resume = useResume();

  return (
    <Card className='References'>
      <CardHeader title='References' />
      <CardContent>
        {resume.references?.map((ref: ResumeReferenceSchema, index: number) => (
          <div key={`reference-${index}`}>
            <p>{ref.reference}</p>
            <p>- <em>{ref.name}</em></p>
          </div>
        )) || []}
      </CardContent>
    </Card>
  );
}

export function Awards(): JSX.Element {
  const resume = useResume();

  return (
    <Card className='Awards'>
      <CardHeader title='Awards' />
      <CardContent>
        {resume.awards?.map((award: ResumeAwardSchema, index: number) => (
          <div key={`award-${index}`}>
            <p>{award.title} from {award.awarder}</p>
            <p><em>{formatYear(award.date)}</em></p>
            <p>{award.summary}</p>
          </div>
        )) || []}
      </CardContent>
    </Card>);
}
