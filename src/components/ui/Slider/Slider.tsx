import React from 'react';
import classNames from 'classnames';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  suffix?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  suffix = '%',
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={classNames('flex items-center gap-3', className)}>
      <div className="relative flex-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="slider-input w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            // Use CSS custom property for the fill
            ['--slider-fill' as string]: `${percentage}%`,
          }}
        />
      </div>
      {showValue && (
        <span className="min-w-[3rem] text-right text-sm font-medium text-text-muted tabular-nums">
          {value}{suffix}
        </span>
      )}
    </div>
  );
};
