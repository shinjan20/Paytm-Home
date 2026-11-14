import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LegacyApp from './LegacyApp.jsx';
import NotFound from './NotFound.jsx';
import { KNOWN_PATHS } from './config/routes.js';

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
