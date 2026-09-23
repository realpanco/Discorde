import React from 'react';

export const Calls: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-background">
      <h1 className="mb-4 text-3xl font-bold text-text">Calls History</h1>
      <p className="text-text-muted">View your recent and missed calls here.</p>
    </div>
  );
};
