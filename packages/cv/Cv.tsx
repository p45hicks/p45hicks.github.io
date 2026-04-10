import type { ResumeSchema } from '@kurone-kito/jsonresume-types';
import { ResumeProvider } from '../cv/resumeHooks';

import resumeJson from './resume.json';
const resume: ResumeSchema = resumeJson as ResumeSchema;

export function CV(): JSX.Element {
    return (
        <ResumeProvider resume={resume}>
            <div>
                <span>{resume.basics?.name}</span>
            </div>
        </ResumeProvider>
    );
}