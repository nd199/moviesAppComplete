import React, { useState, useEffect } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi2';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <HiMoon className="h-4 w-4 text-slate-700" />
          ) : (
            <HiSun className="h-4 w-4 text-yellow-500" />
          )}
        </span>
      </span>
    </button>
  );
};

export default DarkModeToggle;
