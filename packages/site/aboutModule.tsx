import type { JSX } from 'react';

interface AboutModuleSection {
  id: 'about';
  path: '/about';
  title: 'About';
  menu: JSX.Element;
  content: JSX.Element;
}

export function createAboutModuleSection(profileName?: string): AboutModuleSection {
  return {
    id: 'about',
    path: '/about',
    title: 'About',
    menu: (
      <div>
        <div className='cv-menu-label'>About</div>
        <div className='cv-meta'>Site notes</div>
      </div>
    ),
    content: (
      <div className='cv-stack-tight'>
        <p>
          This app uses a shared route-driven menu where each feature contributes
          its own sections.
        </p>
        <p>
          CV content belongs to {profileName ?? 'the profile owner'}.
        </p>
      </div>
    )
  };
}
