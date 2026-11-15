import LegacyApp from './LegacyApp.jsx';

// The prototype uses one screen model for every URL. Known paths open their
// screen; unknown paths and /404 open the in-app 404 screen, so there is a
// single 404 implementation and a single visual style.
export default function App() {
  return <LegacyApp />;
}
