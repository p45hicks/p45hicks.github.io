import type { JSX } from 'react';

import type { ResumeEducationSchema, ResumeInterestSchema, ResumeProfileSchema, ResumeProjectSchema, ResumeReferenceSchema, ResumeSchema, ResumeSkillSchema, ResumeWorkSchema, } from '.';
import { ResumeProvider, useResume } from './resumeHooks';


export function CV({ cv }: { cv: ResumeSchema }): JSX.Element {
    return (
        <ResumeProvider resume={cv}>
            <BasicInfo />
            <Socials />
            <WorkExperience />
            <Projects />
            <Education />
            <Skills />
            <Interests />
            <References />
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
                    <div>{work.startDate} - {work.endDate}</div>
                    <div>{work.summary}</div>
                    {work.highlights?.map((highlight: string, highlightIndex: number) => (
                        <div key={`work-${index}-highlight-${highlightIndex}`}>{highlight}</div>
                    ))}
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
                    {project.startDate && (
                        <div>{project.startDate} {project.endDate && (`- ${project.endDate}`)}</div>
                    )}
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
                    <a href={edu.url}>{edu.studyType}</a> at {edu.institution}
                    {edu.startDate && (
                        <div>{edu.startDate} {edu.endDate && (`- ${edu.endDate}`)}</div>
                    )}
                    <ul className='list-disc list-inside'>
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