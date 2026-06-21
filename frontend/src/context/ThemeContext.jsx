import { createContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useLocalStorage('theme-dark', false);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, [setIsDark]);

  const value = {
    isDark,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
