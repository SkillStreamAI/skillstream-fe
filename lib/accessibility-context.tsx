'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type FontSize = 'normal' | 'large' | 'larger';

export interface A11yPrefs {
  fontSize: FontSize;
  reduceMotion: boolean;
  highContrast: boolean;
}

const DEFAULTS: A11yPrefs = {
  fontSize: 'normal',
  reduceMotion: false,
  highContrast: false,
};

const STORAGE_KEY = 'skillstream_a11y';

function loadPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function applyPrefs(prefs: A11yPrefs) {
  const html = document.documentElement;
  html.classList.toggle('a11y-large-text',   prefs.fontSize === 'large');
  html.classList.toggle('a11y-larger-text',  prefs.fontSize === 'larger');
  html.classList.toggle('a11y-reduce-motion', prefs.reduceMotion);
  html.classList.toggle('a11y-high-contrast', prefs.highContrast);
}

interface A11yContextValue {
  prefs: A11yPrefs;
  setFontSize: (size: FontSize) => void;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  reset: () => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function AccessibilityProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULTS);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    applyPrefs(loaded);
  }, []);

  function update(next: A11yPrefs) {
    setPrefs(next);
    applyPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable
    }
  }

  const setFontSize = (fontSize: FontSize) => update({ ...prefs, fontSize });
  const toggleReduceMotion = () => update({ ...prefs, reduceMotion: !prefs.reduceMotion });
  const toggleHighContrast = () => update({ ...prefs, highContrast: !prefs.highContrast });
  const reset = () => update(DEFAULTS);

  return (
    <A11yContext.Provider value={{ prefs, setFontSize, toggleReduceMotion, toggleHighContrast, reset }}>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used inside AccessibilityProvider');
  return ctx;
}

/** Inline script string for FOUC prevention — paste into <head> via dangerouslySetInnerHTML */
export const A11Y_FOUC_SCRIPT = `(function(){try{
  var p=JSON.parse(localStorage.getItem('skillstream_a11y')||'{}');
  var h=document.documentElement;
  if(p.fontSize==='large')h.classList.add('a11y-large-text');
  if(p.fontSize==='larger')h.classList.add('a11y-larger-text');
  if(p.reduceMotion)h.classList.add('a11y-reduce-motion');
  if(p.highContrast)h.classList.add('a11y-high-contrast');
}catch(e){}})()`;
