import React from 'react';
import classNames from 'classnames';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  className?: string;
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  xxl: 'h-24 w-24 text-2xl',
};

const statusColors = {
  online: 'bg-success',
  idle: 'bg-yellow-500',
  dnd: 'bg-danger',
  offline: 'bg-text-muted',
};

const statusSizes = {
  sm: 'h-2.5 w-2.5 right-0 bottom-0 border-2',
  md: 'h-3 w-3 right-0 bottom-0 border-2',
  lg: 'h-3.5 w-3.5 right-0 bottom-0 border-[2.5px]',
  xl: 'h-4 w-4 right-0 bottom-0 border-[3px]',
  xxl: 'h-6 w-6 right-1 bottom-1 border-4',
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  status,
  className 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={classNames('relative inline-block shrink-0', sizes[size], className)}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-surface-hover border border-border">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="font-semibold text-text-muted select-none">
            {getInitials(alt)}
          </span>
        )}
      </div>
      {status && (
        <span 
          className={classNames(
            'absolute rounded-full border-background',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};
