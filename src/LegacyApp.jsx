import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import legacyHtml from '../_legacy_backup/index.html?raw';
import legacyScript from '../_legacy_backup/script.js?raw';

export const SCREEN_TO_PATH = {
  'screen-recharge-bills': '/',
  'screen-my-bills': '/bills',
  'screen-home-selection': '/homes',
  'screen-personal-home': '/home/personal',
  'screen-flatmates-home': '/home/flatmates',
  'screen-add-bill': '/add-bill',
  'screen-camera': '/camera',
  'screen-upload': '/upload',
  'screen-biller-search': '/biller-search',
  'screen-verification': '/verification',
  'screen-ocr-review': '/ocr-review',
  'screen-bill-detail': '/bill-detail',
  'screen-pay-bill': '/pay-bill',
  'screen-payment-success': '/payment-success',
  'screen-payment-pending': '/payment-pending',
  'screen-payment-failed': '/payment-failed',
  'screen-smart-insight': '/insight',
  'screen-calendar': '/calendar',
  'screen-personal-calendar': '/calendar/personal',
  'screen-flatmates-calendar': '/calendar/flatmates',
  'screen-reminder': '/reminders',
  'screen-voucher-details': '/voucher',
  'screen-empty-bills': '/empty-bills',
  'screen-ocr-loading': '/ocr-loading',
  'screen-bill-loading': '/bill-loading',
  'screen-bill-error': '/bill-error',
  'screen-offline': '/offline',
  'screen-stale-data': '/stale',
  'screen-email-consent': '/email/consent',
  'screen-email-scanning': '/email/scanning',
  'screen-email-candidates': '/email/candidates',
  'screen-email-connected': '/email/connected',
  'screen-widget-preview': '/widget',
  'screen-camera-denied': '/camera-denied',
  'screen-notification-denied': '/notifications-denied',
  'screen-email-disconnected': '/email/disconnected',
  'screen-bill-history': '/bill-history',
  'screen-home-details': '/home-details',
  'screen-reward-chooser': '/reward-chooser',
};
const PATH_TO_SCREEN = Object.fromEntries(Object.entries(SCREEN_TO_PATH).map(([k, v]) => [v, k]));

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
