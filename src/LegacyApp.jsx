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

export default function LegacyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
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
          window.history.pushState({ screenId }, '', path);
        }
        return result;
      };
    }

    const initialScreen = PATH_TO_SCREEN[location.pathname];
    if (initialScreen && typeof window.navigateTo === 'function') {
      try { window.navigateTo(initialScreen); } catch (e) {}
    }

    const onPop = (e) => {
      const screenId = (e.state && e.state.screenId) || PATH_TO_SCREEN[window.location.pathname];
      if (screenId && typeof window.navigateTo === 'function') {
        try { window.navigateTo(screenId); } catch (err) {}
      }
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
