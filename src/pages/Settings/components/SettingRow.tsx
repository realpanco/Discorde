import React from 'react';
import classNames from 'classnames';

export interface SettingRowProps {
  label: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
  className?: string;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  children,
  danger = false,
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-surface-hover/50',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p
          className={classNames('text-sm font-medium', {
            'text-danger': danger,
            'text-text': !danger,
          })}
        >
          {label}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
};
