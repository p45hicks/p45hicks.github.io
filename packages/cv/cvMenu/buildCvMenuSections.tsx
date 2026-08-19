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
  const experience = new Experience(resume);
  const awards = experience.getAwards().toSorted(Experience.byDateDescending);

  const sections: CvMenuSection[] = [];
  sections.push(buildProfileSection(resume));
  sections.push(buildExperienceSection(experience.getWork(), experience.getProjects(), isDesktopTimeline));

  const skillsSection = buildSkillsSection(resume);
  if (skillsSection) {
    sections.push(skillsSection);
  }

  const interestsSection = buildInterestsSection(resume);
  if (interestsSection) {
    sections.push(interestsSection);
  }

  const educationSection = buildEducationSection(resume, experience.getEducation(), isDesktopTimeline);
  if (educationSection) {
    sections.push(educationSection);
  }

  const referencesSection = buildReferencesSection(resume);
  if (referencesSection) {
    sections.push(referencesSection);
  }

  const awardsSection = buildAwardsSection(resume, awards, isDesktopTimeline);
  if (awardsSection) {
    sections.push(awardsSection);
  }

  return sections;
}

function buildProfileSection(resume: ResumeSchema): CvMenuSection {
  return {
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
  };
}

function buildExperienceSection(
  work: ReturnType<Experience['getWork']>,
  projects: ReturnType<Experience['getProjects']>,
  isDesktopTimeline: boolean
): CvMenuSection {
  const workExperience = [...work, ...projects].toSorted(Experience.byDateDescending);

  return {
    id: 'experience',
    title: 'Experience',
    menu: (
      <CvSectionMenuSummary
        label='Experience'
        meta={`${work.length} positions over ${Experience.duration(workExperience)} years`}
      />
    ),
    content: <CvTimeline items={workExperience} isDesktopTimeline={isDesktopTimeline} />
  };
}

function buildSkillsSection(resume: ResumeSchema): CvMenuSection | null {
  if (resume.skills && resume.skills.length > 0) {
    return {
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
    };
  }

  return null;
}

function buildInterestsSection(resume: ResumeSchema): CvMenuSection | null {
  if (resume.interests && resume.interests.length > 0) {
    return {
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
    };
  }

  return null;
}

function buildEducationSection(
  resume: ResumeSchema,
  education: ReturnType<Experience['getEducation']>,
  isDesktopTimeline: boolean
): CvMenuSection | null {
  if (education.length > 0) {
    // Hideous map/reduce to handle JSON Resume schema's optional endDate field,
    // which may be undefined or an invalid date string.
    // We want to find the latest valid endDate, if any.
    const educationEndDate = resume.education
      ?.map((entry) => entry.endDate)
      .filter((value): value is string => Boolean(value))
      .map((value) => new Date(value))
      .filter((value) => !Number.isNaN(value.getTime()))
      .reduce<Date | undefined>((latest, current) => {
        if (!latest) {
          return current;
        }

        return current.getTime() > latest.getTime() ? current : latest;
      }, undefined);

    const educationYears = Experience.duration(education, educationEndDate);

    return {
      id: 'education',
      title: 'Education',
      menu: (
        <CvSectionMenuSummary
          label='Education'
          meta={`${education.length} course${education.length !== 1 ? 's' : ''} over ${educationYears} years`}
        />
      ),
      content: <CvTimeline items={education} isDesktopTimeline={isDesktopTimeline} />
    };
  }

  return null;
}

function buildReferencesSection(resume: ResumeSchema): CvMenuSection | null {
  if (resume.references && resume.references.length > 0) {
    return {
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
    };
  }

  return null;
}

function buildAwardsSection(
  resume: ResumeSchema,
  awards: ReturnType<Experience['getAwards']>,
  isDesktopTimeline: boolean
): CvMenuSection | null {
  if (resume.awards && resume.awards.length > 0) {
    return {
      id: 'awards',
      title: 'Awards',
      menu: (
        <CvSectionMenuSummary
          label='Awards'
          meta={`${resume.awards.length} awards`}
        />
      ),
      content: <CvTimeline items={awards} isDesktopTimeline={isDesktopTimeline} />
    };
  }

  return null;
}
