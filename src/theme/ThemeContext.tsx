import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, ThemeMode, getTheme } from './theme';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从localStorage读取主题模式，默认为light
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedThemeMode = localStorage.getItem('mdnotes_theme');
    return (savedThemeMode === 'dark' || savedThemeMode === 'light') 
      ? savedThemeMode 
      : 'light';
  });
  
  const [theme, setTheme] = useState<Theme>(() => getTheme(themeMode));

  // 切换主题
  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  // 当主题模式变化时更新主题和localStorage
  useEffect(() => {
    setTheme(getTheme(themeMode));
    localStorage.setItem('mdnotes_theme', themeMode);
    
    // 更新body的背景色
    document.body.style.backgroundColor = getTheme(themeMode).background;
    document.body.style.color = getTheme(themeMode).foreground;
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};