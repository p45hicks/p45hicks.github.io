import type { JSX } from 'react';
import { CvMenu } from '@p45hicks/cv/CvMenu';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import resumeJson from './resume.json';
const cv: ResumeSchema = resumeJson as ResumeSchema;

export default function App(): JSX.Element {
  return (
    <CvMenu cv={cv}/>
  );
}
