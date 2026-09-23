import React from 'react';
import classNames from 'classnames';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover border border-transparent shadow-sm',
  secondary: 'bg-secondary text-text hover:bg-secondary-hover border border-border',
  danger: 'bg-danger text-white hover:bg-danger-hover border border-transparent shadow-sm',
  ghost: 'bg-transparent text-text hover:bg-white/10 border border-transparent',
  outline: 'bg-transparent text-text border border-border hover:bg-white/5',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-8 text-lg',
  icon: 'h-10 w-10 flex items-center justify-center p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon, 
    rightIcon, 
    fullWidth,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          { 'w-full': fullWidth },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
