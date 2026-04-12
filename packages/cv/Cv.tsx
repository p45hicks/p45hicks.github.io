import type { JSX } from 'react';

import type { ResumeAwardSchema, ResumeEducationSchema, ResumeInterestSchema, ResumeProfileSchema, ResumeProjectSchema, ResumeReferenceSchema, ResumeSchema, ResumeSkillSchema, ResumeWorkSchema, } from '.';
import { ResumeProvider, useResume } from './resumeHooks';

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
            <BasicInfo />
            <Socials />
            <WorkExperience />
            <References />
            <Projects />
            <Skills />
            <Interests />
            <Education />
            <Awards />
        </ResumeProvider>
    );
}

export function BasicInfo(): JSX.Element {
    const resume = useResume();
    return (
        <div className='BasicInfo w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>{resume.basics?.name}</h1>
            <div>
                <a href={resume.basics?.url}>
                    <img className='w-10 h-auto' src={resume.basics?.image} alt={resume.basics?.name ?? 'Profile image'} />
                </a>
            </div>
            <div>{resume.basics?.label}</div>
            <div>{resume.basics?.email}</div>
            <div>{resume.basics?.phone}</div>
        </div>
    );
}

export function Socials(): JSX.Element {
    const resume = useResume();
    return (
        <div className='Socials w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>Socials</h1>
            {resume.basics?.profiles?.map((profile: ResumeProfileSchema, index: number) => (
                <div key={`profile-${index}`}>
                    <a href={profile.url}>{profile.network}</a>
                </div>
            ))}
        </div>
    );
}

export function WorkExperience(): JSX.Element {
    const resume = useResume();
    return (
        <div className='WorkExperience w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>Experience</h1>
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
            ))}
        </div>
    );
}

export function Projects(): JSX.Element {
    const resume = useResume();
    return (
        <div className='Projects w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>Projects</h1>
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
            ))
            }
        </div >
    );
}

export function Education(): JSX.Element {
    const resume = useResume();
    return (
        <div className='Education w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>Education</h1>
            {resume.education?.map((edu: ResumeEducationSchema, index: number) => (
                <div key={`education-${index}`}>
                    <a href={edu.url}>{edu.studyType} {edu.area && `(${edu.area})`} at {edu.institution}</a>
                    <div className="text-sm"><em>{formatYear(edu.startDate)} - {formatYear(edu.endDate)}</em></div>
                    <div><em>{edu.score}</em></div>
                    <ul className='text-sm text-indent-2'>
                        {edu.courses?.map((course: string, courseIndex: number) => (
                            <li key={`education-${index}-course-${courseIndex}`}>{course}</li>
                        ))}
                    </ul>
                </div>
            ))
            }
        </div>
    );
}

export function Skills(): JSX.Element {
    const resume = useResume();
    return (
        <div className='Skills w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>Skills</h1>
            {resume.skills?.map((skill: ResumeSkillSchema, index: number) => (
                <div key={`skill-${index}`}>
                    <p>{skill.level} {skill.name}</p>
                    <p><em>{skill.keywords?.join(', ')}</em></p>
                </div>
            ))}
        </div>
    );
}

export function Interests(): JSX.Element {
    const resume = useResume();
    return (
        <div className='Interests w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>Interests</h1>
            {resume.interests?.map((interest: ResumeInterestSchema, index: number) => (
                <div key={`interest-${index}`}>
                    <p>{interest.name}</p>
                    <p><em>{interest.keywords?.join(', ')}</em></p>
                </div>
            ))
            }
        </div >
    );
}

export function References(): JSX.Element {
    const resume = useResume();

    return (
        <div className='References w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>References</h1>
            {resume.references?.map((ref: ResumeReferenceSchema, index: number) => (
                <div key={`reference-${index}`}>
                    <p>{ref.reference}</p>
                    <p>- <em>{ref.name}</em></p>
                </div>
            ))}
        </div>
    );
}

export function Awards(): JSX.Element {
    const resume = useResume();

    return (
        <div className='Awards w-200 grid solid
         gap-5 p-4 grid-cols-1 md:grid-cols-3
         bg-gray-400 text-black dark:bg-gray-800 dark:text-gray-300
         border rounded-lg border-gray-300 dark:border-black'>
            <h1>Awards</h1>
            {resume.awards?.map((award: ResumeAwardSchema, index: number) => (
                <div key={`award-${index}`}>
                    <p>{award.title} from {award.awarder}</p>
                    <p><em>{formatYear(award.date)}</em></p>
                    <p>{award.summary}</p>
                </div>
            ))}
        </div>
    );
}