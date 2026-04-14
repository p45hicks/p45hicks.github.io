import { JSX } from 'react';
import { CV } from '@p45hicks/cv/Cv';

import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import resumeJson from './resume.json';
const cv: ResumeSchema = resumeJson as ResumeSchema;

export default function App(): JSX.Element {
  return (
    <CV cv={cv}/>
  );
}
