import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      console.log('useDarkMode: Initial dark mode', isDark);
      return isDark;
    }
    return false;
  });

  useEffect(() => {
    console.log('useDarkMode: Dark mode changed', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
}
