import { createContext, useContext, useState, useEffect } from 'react';

export const ColorModeContext = createContext({ colorMode: 'dark', toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

export function ColorModeProvider({ children }) {
  const getInitial = () => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('gitcard-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const [colorMode, setColorMode] = useState(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
    localStorage.setItem('gitcard-theme', colorMode);
  }, [colorMode]);

  // Sync with OS preference changes (only if user hasn't manually toggled)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem('gitcard-theme')) {
        setColorMode(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleColorMode = () =>
    setColorMode(m => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}
