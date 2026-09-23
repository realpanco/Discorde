import React from 'react';

export const Events: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-background">
      <h1 className="mb-4 text-3xl font-bold text-text">Events</h1>
      <p className="text-text-muted">Upcoming community events.</p>
    </div>
  );
};
