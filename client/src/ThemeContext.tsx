import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = {
  primary: string;
  background: string;
  card: string;
  text: string;
  currency: string; // <-- ADDED
};

const defaultTheme: Theme = {
  primary: '#6366f1', 
  background: '#111827', 
  card: '#1f2937', 
  text: '#ffffff', 
  currency: '$', // <-- ADDED
};

const ThemeContext = createContext<{
  theme: Theme;
  updateTheme: (newTheme: Partial<Theme>) => void;
}>({ theme: defaultTheme, updateTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const saved = localStorage.getItem('appTheme');
    if (saved) setTheme(JSON.parse(saved));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-bg', theme.background);
    document.documentElement.style.setProperty('--color-card', theme.card);
    document.documentElement.style.setProperty('--color-text', theme.text);
    localStorage.setItem('appTheme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);