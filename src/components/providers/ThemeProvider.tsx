import React, { useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    theme,
    accentColor,
    fontSize,
    interfaceScale,
    interfaceDensity,
    compactMode,
    developerMode,
    animations,
    transparency,
    highContrast,
    largerText,
    reduceAnimations,
  } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // Developer Mode
    root.classList.toggle('dev-mode', !!developerMode);

    // Theme (Light/Dark)
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.toggle('light', !prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
    }

    // High Contrast
    root.classList.toggle('high-contrast', highContrast);

    // Accent Color
    root.style.setProperty('--color-primary', accentColor);

    // Font Size
    const finalFontSize = largerText ? fontSize + 4 : fontSize;
    root.style.setProperty('--font-size-base', `${finalFontSize}px`);
    // Base font is 14px. Scale relative to 14.
    root.style.setProperty('--font-scale', (finalFontSize / 14).toString());

    // Interface Scale (zoom)
    root.style.setProperty('--interface-scale', (interfaceScale / 100).toString());

    // Interface Density
    if (compactMode || interfaceDensity === 'compact') {
      root.style.setProperty('--spacing-scale', '0.75');
    } else if (interfaceDensity === 'spacious') {
      root.style.setProperty('--spacing-scale', '1.25');
    } else {
      root.style.setProperty('--spacing-scale', '1');
    }

    // Animations
    const shouldDisableAnimations = reduceAnimations || !animations;
    root.classList.toggle('reduce-animations', shouldDisableAnimations);
    if (shouldDisableAnimations) {
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.setProperty('--transition-duration', '150ms');
    }

    // Transparency
    root.classList.toggle('no-transparency', !transparency);

  }, [
    theme, accentColor, fontSize, interfaceDensity, 
    animations, transparency, highContrast, largerText, reduceAnimations
  ]);

  return <>{children}</>;
};
