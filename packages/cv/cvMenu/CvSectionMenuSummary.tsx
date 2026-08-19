import type { JSX } from 'react';

export function CvSectionMenuSummary({ label, meta }: { label: string; meta: string }): JSX.Element {
  return (
    <div>
      <div className='cv-menu-label'>{label}</div>
      <div className='cv-meta'>{meta}</div>
    </div>
  );
}
