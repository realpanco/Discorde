import React from 'react';
import classNames from 'classnames';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className,
}) => {
  const trackSize = size === 'sm' ? 'w-8 h-[18px]' : 'w-11 h-6';
  const thumbSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  const thumbTranslate = size === 'sm' ? 'translate-x-[14px]' : 'translate-x-5';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={classNames(
        'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        trackSize,
        {
          'bg-primary': checked,
          'bg-border': !checked,
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
    >
      <span
        className={classNames(
          'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
          thumbSize,
          {
            [thumbTranslate]: checked,
            'translate-x-0': !checked,
          }
        )}
      />
    </button>
  );
};
