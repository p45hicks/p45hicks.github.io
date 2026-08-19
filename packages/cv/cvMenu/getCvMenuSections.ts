import type { ResumeSchema } from '..';

import { buildCvMenuSections } from './buildCvMenuSections';
import type { CvMenuSection, CvMenuSectionCacheEntry } from './types';

const CV_MENU_SECTION_CACHE = new WeakMap<ResumeSchema, CvMenuSectionCacheEntry>();

export function getCvMenuSections(resume: ResumeSchema, isDesktopTimeline: boolean): CvMenuSection[] {
  const cachedEntry = CV_MENU_SECTION_CACHE.get(resume);
  if (cachedEntry) {
    const cachedSections = isDesktopTimeline ? cachedEntry.desktop : cachedEntry.mobile;
    if (cachedSections) {
      return cachedSections;
    }
  }

  const builtSections = buildCvMenuSections(resume, isDesktopTimeline);
  const nextCacheEntry = cachedEntry ?? {};
  if (isDesktopTimeline) {
    nextCacheEntry.desktop = builtSections;
  } else {
    nextCacheEntry.mobile = builtSections;
  }

  CV_MENU_SECTION_CACHE.set(resume, nextCacheEntry);
  return builtSections;
}
