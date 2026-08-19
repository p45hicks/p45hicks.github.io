import type { JSX } from 'react';
import { Chrono, type TimelineProps } from 'react-chrono';

/**
 * Shared CV timeline renderer.
 *
 * This is intentionally the single place where react-chrono is configured for CV timelines,
 * including theme, display behavior, semantic tags, and responsive mode selection.
 */

const CV_CHRONO_THEME: TimelineProps['theme'] = {
  primary: 'var(--cv-accent)',
  secondary: 'var(--cv-accent-strong)',
  timelineBgColor: 'var(--cv-surface)',
  textColor: 'var(--cv-text)',
  titleColor: 'var(--cv-text-muted)',
  titleColorActive: 'var(--cv-text)',
  cardBgColor: 'var(--cv-surface)',
  cardDetailsBackGround: 'var(--cv-surface)',
  cardDetailsColor: 'var(--cv-text)',
  cardTitleColor: 'var(--cv-text)',
  cardSubtitleColor: 'var(--cv-text-muted)',
  detailsColor: 'var(--cv-text)',
  toolbarBgColor: 'var(--cv-surface-muted)',
  toolbarTextColor: 'var(--cv-text)',
  toolbarBtnBgColor: 'var(--cv-surface-active)',
  shadowColor: 'var(--cv-border)'
};

const CV_CHRONO_BASE_PROPS: Omit<TimelineProps, 'items' | 'mode'> = {
  theme: CV_CHRONO_THEME,
  darkMode: {
    enabled: false,
    showToggle: false
  },
  display: {
    toolbar: {
      enabled: false
    }
  },
  content: {
    semanticTags: {
      title: 'span',
      subtitle: 'span'
    }
  },
  style: {
    classNames: {
      title: 'cv-chrono-title'
    }
  }
};

type CvTimelineItems = NonNullable<TimelineProps['items']>;

export function CvTimeline({ items, isDesktopTimeline }: { items: CvTimelineItems; isDesktopTimeline: boolean }): JSX.Element {
  return (
    <div className='cv-timeline-wrap'>
      <div className='cv-timeline'>
        <Chrono
          {...CV_CHRONO_BASE_PROPS}
          mode={isDesktopTimeline ? 'alternating' : 'vertical'}
          items={items}
        />
      </div>
    </div>
  );
}
