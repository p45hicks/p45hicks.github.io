import { useMemo, type JSX } from 'react';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { useCvMenuContributions } from '@p45hicks/cv/CvMenu';
import App from './App';
import { createAboutModuleSection } from './aboutModule';
import resumeJson from './resume.json';

/**
 * Application module composition.
 *
 * Responsibility: aggregate feature modules (CV, About, and future modules)
 * into a single ordered section list for the shared App shell.
 */

const cv: ResumeSchema = resumeJson as ResumeSchema;

/**
 * Compose module contributions and pass them to the feature-agnostic App shell.
 *
 * Add new app modules here by appending additional section contributions.
 */
export default function AppModules(): JSX.Element {
  const cvSections = useCvMenuContributions(cv);
  const aboutSection = createAboutModuleSection(cv.basics?.name);

  const appSections = useMemo(
    () => [
      ...cvSections,
      aboutSection
    ],
    [aboutSection, cvSections]
  );

  return <App sections={appSections} />;
}
