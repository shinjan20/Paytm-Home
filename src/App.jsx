import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LegacyApp, { SCREEN_TO_PATH } from './LegacyApp.jsx';
import NotFound from './NotFound.jsx';

const KNOWN_PATHS = new Set(Object.values(SCREEN_TO_PATH));

export default function App() {
  const location = useLocation();
  const rawPath = location.pathname;
  const normalizedPath = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  const isKnown = KNOWN_PATHS.has(normalizedPath);

  if (!isKnown || normalizedPath === '/404') {
    return <NotFound />;
  }

  return (
    <Routes>
      <Route path="*" element={<LegacyApp />} />
    </Routes>
  );
}
