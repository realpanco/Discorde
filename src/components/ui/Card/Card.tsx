import React from 'react';
import classNames from 'classnames';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable, onClick }) => {
  return (
    <div 
      className={classNames(
        'rounded-xl border border-border bg-surface shadow-sm transition-all overflow-hidden',
        {
          'hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer': hoverable,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
