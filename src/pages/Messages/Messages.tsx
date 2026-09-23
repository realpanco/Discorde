import React from 'react';

export const Messages: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-background">
      <h1 className="mb-4 text-3xl font-bold text-text">Direct Messages</h1>
      <p className="text-text-muted">Your private conversations.</p>
    </div>
  );
};
