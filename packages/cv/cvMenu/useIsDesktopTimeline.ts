import { useEffect, useState } from 'react';

const DESKTOP_TIMELINE_MEDIA_QUERY = '(min-width: 768px)';

export function useIsDesktopTimeline(): boolean {
  const [isDesktopTimeline, setIsDesktopTimeline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueryList = window.matchMedia(DESKTOP_TIMELINE_MEDIA_QUERY);
    const onMediaQueryChange = (): void => {
      setIsDesktopTimeline(mediaQueryList.matches);
    };

    onMediaQueryChange();
    mediaQueryList.addEventListener('change', onMediaQueryChange);

    return () => {
      mediaQueryList.removeEventListener('change', onMediaQueryChange);
    };
  }, []);

  return isDesktopTimeline;
}
