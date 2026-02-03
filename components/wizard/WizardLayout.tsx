import React from 'react';

interface WizardLayoutProps {
  intro: React.ReactNode;
  progressBar: React.ReactNode;
  children: React.ReactNode;
}

export function WizardLayout({ intro, progressBar, children }: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 items-center justify-center">
        {intro}
      </div>

      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          {progressBar}
        </div>

        <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
