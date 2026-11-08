import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'sprintdesk.theme';
const ThemeContext = createContext(null);
const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

export function ThemeProvider({ children }) {
  const [pref, setPrefState] = useState(() => { try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; } });
  const [sys, setSys] = useState(systemDark);
  const dark = pref === 'dark' || (pref === 'system' && sys);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = (e) => setSys(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

  const setPref = useCallback((p) => {
    setPrefState(p);
    try { localStorage.setItem(KEY, p); } catch { /* storage unavailable */ }
  }, []);
  const toggle = useCallback(() => setPref(dark ? 'light' : 'dark'), [dark, setPref]);

  const value = useMemo(() => ({ pref, setPref, dark, toggle }), [pref, setPref, dark, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
