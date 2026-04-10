import React, { createContext, useContext } from 'react';
import type { ResumeSchema } from '@kurone-kito/jsonresume-types';

// Create the Context
const ResumeContext = createContext<ResumeSchema | undefined>(undefined);

// Create the Provider with explicit children support
export const ResumeProvider: React.FC<React.PropsWithChildren<{ resume: ResumeSchema }>> = ({
  resume,
  children
}) => {
  return (
    <ResumeContext.Provider value={resume}>
      {children}
    </ResumeContext.Provider>
  );
};

// Create the Hook
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
