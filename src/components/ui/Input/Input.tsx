import React from 'react';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    fullWidth = true,
    id, 
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={classNames('flex flex-col gap-1.5', { 'w-full': fullWidth }, className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3 text-text-muted">{leftIcon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={classNames(
              'flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text transition-colors placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
              {
                'pl-10': !!leftIcon,
                'pr-10': !!rightIcon,
                'border-danger focus-visible:ring-danger': !!error,
              }
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 text-text-muted">{rightIcon}</span>}
        </div>
        {error && <span className="text-xs font-medium text-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
