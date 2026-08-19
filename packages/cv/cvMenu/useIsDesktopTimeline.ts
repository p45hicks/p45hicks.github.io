import { useEffect, useState } from 'react';

const DESKTOP_TIMELINE_MEDIA_QUERY = '(min-width: 768px)';

/**
 * React hook that returns whether the viewport currently matches the desktop timeline breakpoint.
 *
 * Call this only from a React function component or another custom React hook.
 * Do not call it from regular functions, class components, loops, conditions, or nested callbacks
 * (standard Rules of Hooks apply).
 *
 * Runtime behavior and assumptions:
 * - In SSR/test environments without window.matchMedia, it safely returns the default false.
 * - In browsers, it subscribes to media-query change events and updates as the viewport changes.
 * - The initial render value may be false until the first effect runs and synchronizes state.
 *
 * Use this hook when a CV view must switch timeline layout between mobile and desktop modes.
 */
export function useIsDesktopTimeline(): boolean {
  const [isDesktopTimeline, setIsDesktopTimeline] = useState(false);

  useEffect(() => {
    // In SSR/test environments there may be no window or matchMedia support.
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueryList = window.matchMedia(DESKTOP_TIMELINE_MEDIA_QUERY);
    const onMediaQueryChange = (): void => {
      setIsDesktopTimeline(mediaQueryList.matches);
    };

    // Sync immediately on mount, then keep state updated on viewport changes.
    onMediaQueryChange();
    mediaQueryList.addEventListener('change', onMediaQueryChange);

    return () => {
      // Remove listener to avoid stale updates after unmount.
      mediaQueryList.removeEventListener('change', onMediaQueryChange);
    };
  }, []);

  return isDesktopTimeline;
}
