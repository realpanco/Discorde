import React from 'react';
import classNames from 'classnames';

export interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={classNames('mb-8', className)}>
      <div className="mb-3 px-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-text-muted/70">{description}</p>
        )}
      </div>
      <div className="rounded-xl border border-border bg-surface/50 divide-y divide-border/50">
        {children}
      </div>
    </div>
  );
};
