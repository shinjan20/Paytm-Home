import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import legacyHtml from '../_legacy_backup/index.html?raw';
import legacyScript from '../_legacy_backup/script.js?raw';
import { SCREEN_TO_PATH, PATH_TO_SCREEN } from './config/routes.js';
import './context/BillsStore.js';

function extractAppMarkup(html) {
  const match = html.match(/<div id="app">([\s\S]*)<\/body>/i);
  if (!match) return '';
  return match[1].replace(/<script[\s\S]*?<\/script>\s*$/i, '').trim();
}

// Treat "/bills/" and "/bills" as the same screen. Anything else is unknown
// and resolves to the in-app 404, which is the only 404 implementation.
function screenFromPath(pathname) {
  const normalized = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  return PATH_TO_SCREEN[normalized];
}

export default function LegacyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!window.__legacyScriptInjected) {
      const script = document.createElement('script');
      script.textContent = legacyScript;
      document.body.appendChild(script);
      window.__legacyScriptInjected = true;

      const original = window.navigateTo;
      window.navigateTo = function (screenId) {
        const result = original ? original(screenId) : undefined;
        const path = SCREEN_TO_PATH[screenId];
        if (path && window.location.pathname !== path) {
          const method = window.__legacyHistoryMode === 'replace' ? 'replaceState' : 'pushState';
          window.history[method]({ screenId }, '', path);
        }
        // A screen should always open at its top. Without this, returning to
        // the long landing page from a deeper screen kept the old scroll
        // offset and looked like navigation had failed.
        window.scrollTo(0, 0);
        window.requestAnimationFrame(() => window.scrollTo(0, 0));
        return result;
      };
    }

    const initialScreen = screenFromPath(location.pathname) || 'screen-404';
    if (typeof window.navigateTo === 'function') {
      // Resolve the first URL in place so an unknown path does not leave an
      // extra history entry that a browser Back would return to.
      window.__legacyHistoryMode = 'replace';
      try { window.navigateTo(initialScreen); } catch (e) {} finally { delete window.__legacyHistoryMode; }
    }

    const onPop = (e) => {
      const screenId = (e.state && e.state.screenId) || screenFromPath(window.location.pathname) || 'screen-404';
      if (typeof window.navigateTo === 'function') {
        window.__legacyHistoryMode = 'replace';
        try { window.navigateTo(screenId); } catch (err) {} finally { delete window.__legacyHistoryMode; }
      }
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => window.scrollTo(0, 0));
    };
    window.addEventListener('popstate', onPop);

    ['renderLandingOverview', 'renderPaperCalendars', 'renderEmailExperience', 'updateHomePendingInvite', 'updateHomeInviteBadge', 'updateHomeReward', 'renderHomeRewards', 'renderRewardChooser'].forEach((fn) => {
      if (typeof window[fn] === 'function') {
        try { window[fn](); } catch (e) {}
      }
    });

    return () => window.removeEventListener('popstate', onPop);
  }, [navigate, location.pathname]);

  const markup = extractAppMarkup(legacyHtml);

  return (
    <div id="app" ref={containerRef} dangerouslySetInnerHTML={{ __html: markup }} />
  );
}
