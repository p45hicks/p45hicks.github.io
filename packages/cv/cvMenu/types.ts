import type { JSX } from 'react';

export interface CvMenuSection {
  id: string;
  title: string;
  menu: JSX.Element;
  content: JSX.Element;
}

export interface CvMenuContribution extends CvMenuSection {
  path: string;
}

export interface CvMenuSectionCacheEntry {
  mobile?: CvMenuSection[];
  desktop?: CvMenuSection[];
}
