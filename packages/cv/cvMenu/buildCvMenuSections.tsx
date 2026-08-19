import type {
  ResumeInterestSchema,
  ResumeProfileSchema,
  ResumeReferenceSchema,
  ResumeSchema,
  ResumeSkillSchema
} from '..';

import { Experience } from '../Experience';

import { CvSectionMenuSummary } from './CvSectionMenuSummary';
import { CvTimeline } from './CvTimeline';
import type { CvMenuSection } from './types';

export function buildCvMenuSections(resume: ResumeSchema, isDesktopTimeline: boolean): CvMenuSection[] {
  const sections: CvMenuSection[] = [];

  sections.push({
    id: 'profile',
    title: 'Profile',
    menu: (
      <CvSectionMenuSummary
        label={resume.basics?.name ?? 'Basic Info'}
        meta={resume.basics?.label ?? 'Profile'}
      />
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
              <div key={profile.url ?? `${profile.network}-${index}`}>
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
    id: 'experience',
    title: 'Experience',
    menu: (
      <CvSectionMenuSummary
        label='Experience'
        meta={`${experience.getWork().length} positions over ${Experience.duration(workExperience)} years`}
      />
    ),
    content: <CvTimeline items={workExperience} isDesktopTimeline={isDesktopTimeline} />
  });

  if (resume.skills && resume.skills.length > 0) {
    sections.push({
      id: 'skills',
      title: 'Skills',
      menu: (
        <CvSectionMenuSummary
          label='Skills'
          meta={`${resume.skills.length} skill groups`}
        />
      ),
      content: (
        <div className='cv-stack'>
          {resume.skills.map((skill: ResumeSkillSchema, index: number) => (
            <div key={`${skill.name}-${index}`}>
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
        <CvSectionMenuSummary
          label='Interests'
          meta={`${resume.interests.length} areas`}
        />
      ),
      content: (
        <div className='cv-stack'>
          {resume.interests.map((interest: ResumeInterestSchema, index: number) => (
            <div key={`${interest.name}-${index}`}>
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
    const educationEndDate = resume.education?.[0]?.endDate;
    const educationYears = Experience.duration(
      education,
      educationEndDate ? new Date(educationEndDate) : undefined
    );

    sections.push({
      id: 'education',
      title: 'Education',
      menu: (
        <CvSectionMenuSummary
          label='Education'
          meta={`${education.length} course${education.length !== 1 ? 's' : ''} over ${educationYears} years`}
        />
      ),
      content: <CvTimeline items={education} isDesktopTimeline={isDesktopTimeline} />
    });
  }

  if (resume.references && resume.references.length > 0) {
    sections.push({
      id: 'references',
      title: 'References',
      menu: (
        <CvSectionMenuSummary
          label='References'
          meta={`${resume.references.length} recommendations`}
        />
      ),
      content: (
        <div className='cv-stack-loose'>
          {resume.references.map((ref: ResumeReferenceSchema, index: number) => (
            <div key={`${ref.name}-${index}`}>
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
        <CvSectionMenuSummary
          label='Awards'
          meta={`${resume.awards.length} awards`}
        />
      ),
      content: <CvTimeline items={awards} isDesktopTimeline={isDesktopTimeline} />
    });
  }

  return sections;
}
