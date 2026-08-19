import { useMemo } from 'react';

import type { ResumeSchema } from '.';

import { getCvMenuSections } from './cvMenu/getCvMenuSections';
import type { CvMenuContribution } from './cvMenu/types';
import { useIsDesktopTimeline } from './cvMenu/useIsDesktopTimeline';

/**
 * Hook-based CV menu API.
 *
 * Use useCvMenuContributions() to get route-ready CV sections (menu/title/content/path).
 * Example usage: packages/site/AppModules.tsx composes these CV sections with
 * other module contributions and passes them to the shared app shell.
 */
export type { CvMenuContribution } from './cvMenu/types';

export function useCvMenuContributions(cv: ResumeSchema): CvMenuContribution[] {
  const isDesktopTimeline = useIsDesktopTimeline();
  const sections = useMemo(() => getCvMenuSections(cv, isDesktopTimeline), [cv, isDesktopTimeline]);

  return useMemo(
    () => sections.map((section) => ({
      ...section,
      path: `/${section.id}`
    })),
    [sections]
  );
}

