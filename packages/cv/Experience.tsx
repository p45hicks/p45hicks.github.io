import {
  ResumeAwardSchema,
  ResumeEducationSchema,
  ResumeProjectSchema, ResumeSchema, ResumeWorkSchema
} from '.';
import { TimelineItem } from 'react-chrono';

export class Experience {
  private resume: ResumeSchema;

  constructor(resume: ResumeSchema) {
    this.resume = resume;
  }

  public getWork(): TimelineItem[] {
    return this.resume.work?.map((work) => this.getWorkDetails(work)) ?? [];
  }

  public getProjects(): TimelineItem[] {
    return this.resume.projects?.map((project) => this.getProjectDetails(project)) ?? [];
  }

  public getEducation(): TimelineItem[] {
    return this.resume.education?.map((education) => this.getEducationDetails(education)) ?? [];
  }

  public getAwards(): TimelineItem[] {
    return this.resume.awards?.map((award) => this.getAwardDetails(award)) ?? [];
  }

  public getVolunteering(): TimelineItem[] {
    return this.resume.volunteer?.map((volunteer) => this.getVolunteeringDetails(volunteer)) ?? [];
  }

  public byDateDescending(a: TimelineItem, b: TimelineItem): number {
    return new Date(b.date!).getTime() - new Date(a.date!).getTime();
  }

  private formatYear(dateString?: string): string {
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
    return date.toLocaleDateString(undefined, { year: 'numeric' });
  }

  public static duration(timelineItems: TimelineItem[], endDate: Date = new Date()): number {
    const endYear = endDate.getFullYear();
    const startYears = timelineItems.map((period) => period.date ? new Date(period.date).getFullYear() : endYear);
    const earliestYear = startYears.reduce((earliestYear, currentYearToCheck) => (currentYearToCheck < earliestYear) ? currentYearToCheck : earliestYear);
    const careerDuration = endYear - earliestYear;
    return careerDuration;
  }

  private getWorkDetails(work: ResumeWorkSchema): TimelineItem {
    return {
      title: `${this.formatYear(work.startDate)} - ${this.formatYear(work.endDate)}`,
      date: new Date(work.startDate!),
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

  private getProjectDetails(project: ResumeProjectSchema): TimelineItem {
    return {
      title: `${this.formatYear(project.startDate)} - ${this.formatYear(project.endDate)}`,
      date: new Date(project.startDate!),
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

  private getEducationDetails(education: ResumeEducationSchema): TimelineItem {
    return {
      title: `${this.formatYear(education.startDate)} - ${this.formatYear(education.endDate)}`,
      date: new Date(education.startDate!),
      cardTitle: `${education.studyType ?? 'UNSPECIFIED'} of ${education.area ?? 'UNSPECIFIED AREA'} at ${education.institution ?? 'UNSPECIFIED INSTITUTION'}`,
      items: education.courses?.map((course: string) => ({
        cardDetailedText: course
      })) ?? []
    };
  }

  private getAwardDetails(award: ResumeAwardSchema): TimelineItem {
    return {
      title: `${this.formatYear(award.date)}`,
      date: new Date(award.date!),
      cardTitle: `${award.title ?? 'UNSPECIFIED TITLE'} at ${award.awarder ?? 'UNSPECIFIED AWARDER'}`,
      cardSubtitle: award.summary,
      items: []
    };
  }

  private getVolunteeringDetails(volunteer: ResumeWorkSchema): TimelineItem {
    return {
      title: `${this.formatYear(volunteer.startDate)} - ${this.formatYear(volunteer.endDate)}`,
      date: new Date(volunteer.startDate!),
      cardTitle: `${volunteer.position ?? 'UNSPECIFIED'} at ${volunteer.organization ?? 'UNSPECIFIED ORGANIZATION'}`,
      cardSubtitle: volunteer.summary,
      hasNestedItems: volunteer.highlights && volunteer.highlights.length > 0,
      items: volunteer.highlights?.map((highlight: string) => ({
        cardDetailedText: highlight
      })) ?? []
    };
  }
}
