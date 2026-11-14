import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Oops! Page Not Found - Paytm';
  }, []);

  const handleGoHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={styles.page}>
      {/* Top Navbar */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button type="button" style={styles.hamburgerBtn} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#243364" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Paytm Money Logo */}
          <a href="/" onClick={handleGoHome} style={styles.logoLink}>
            <div style={styles.logoMark}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M4 16L20 4L28 12L16 28L4 16Z" fill="#243364" />
                <path d="M12 16L20 10L24 14L18 22L12 16Z" fill="#55baed" />
                <text x="13" y="19" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="system-ui">₹</text>
              </svg>
            </div>
            <div style={styles.logoText}>
              <span style={styles.logoPaytm}>Paytm</span>
              <span style={styles.logoMoney}>Money</span>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div style={styles.headerCenter}>
          <div style={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search for Mutual Funds"
              style={styles.searchInput}
              readOnly
            />
          </div>
        </div>

        {/* Sign In Button */}
        <div style={styles.headerRight}>
          <button type="button" style={styles.signInBtn} onClick={handleGoHome}>
            Sign In
          </button>
        </div>
      </header>

      {/* Main 404 Center Area */}
      <main style={styles.main}>
        <div style={styles.contentCard}>
          {/* 404 Custom Artwork */}
          <div style={styles.illustrationWrapper}>
            <svg width="280" height="150" viewBox="0 0 280 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Flying bird top left */}
              <g transform="translate(68, 12)">
                {/* Motion action lines */}
                <path d="M -6 16 L -13 14 M -4 8 L -11 4 M 3 4 L 1 -2" stroke="#55baed" strokeWidth="1.6" strokeLinecap="round" />
                {/* Bird body, wings & tail */}
                <path
                  d="M 12 16 C 9 8 18 1 24 5 C 28 8 26 15 20 19 C 26 19 32 23 30 29 C 28 34 20 35 14 31 C 8 37 -1 35 -3 27 C -5 21 3 15 12 16 Z"
                  fill="#ffffff"
                  stroke="#55baed"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M 6 20 C 8 14 14 12 18 14" fill="none" stroke="#55baed" strokeWidth="1.5" strokeLinecap="round" />
                {/* Eye and Beak */}
                <circle cx="23" cy="22" r="1.8" fill="#243364" />
                <path d="M 27 22 L 32 24 L 26 26 Z" fill="#f7d757" stroke="#d4a83a" strokeWidth="0.8" />
              </g>

              {/* Radiating burst sparks above nest */}
              <path d="M 123 44 L 118 36 M 132 40 L 132 31 M 142 42 L 148 35 M 153 46 L 160 42" stroke="#243364" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 135 27 L 135 22 M 135 19 L 135 17" stroke="#243364" strokeWidth="2" strokeLinecap="round" />

              {/* Number 4 Left */}
              <path
                d="M 80 84 L 80 73 L 64 73 L 78 48 L 84 48 L 84 67 L 90 67 L 90 73 L 84 73 L 84 84 Z M 70 67 L 80 67 L 80 52 Z"
                fill="#243364"
              />

              {/* Cracked egg / golden nest center */}
              <g transform="translate(120, 50)">
                <path
                  d="M 2 24 C 2 9 10 1 18 1 C 26 1 34 9 34 24 Z"
                  fill="#f6e7a8"
                  stroke="#f7d757"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Crack zigzag line */}
                <path
                  d="M 6 16 L 12 21 L 18 15 L 24 22 L 30 17"
                  fill="none"
                  stroke="#d4a83a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Number 4 Right */}
              <path
                d="M 188 84 L 188 73 L 172 73 L 186 48 L 192 48 L 192 67 L 198 67 L 198 73 L 192 73 L 192 84 Z M 178 67 L 188 67 L 188 52 Z"
                fill="#243364"
              />

              {/* Cyan Ring / Water Pond */}
              <ellipse cx="134" cy="98" rx="66" ry="14" fill="#55baed" stroke="#3a9ad9" strokeWidth="2" />
              <ellipse cx="134" cy="96" rx="58" ry="10" fill="#7cc8f0" />
              <path d="M 80 98 C 92 108 178 108 190 98" fill="none" stroke="#243364" strokeWidth="2.6" strokeLinecap="round" />

              {/* Leaves on sides */}
              {/* Left leaf */}
              <path d="M 68 100 C 60 96 62 86 70 88 C 74 89 76 95 68 100 Z" fill="#5cbe7f" stroke="#4aa86a" strokeWidth="1.2" />
              <path d="M 67 98 C 71 95 73 93 75 90" fill="none" stroke="#3d8f55" strokeWidth="1" strokeLinecap="round" />
              {/* Right leaf */}
              <path d="M 200 100 C 208 96 206 86 198 88 C 194 89 192 95 200 100 Z" fill="#5cbe7f" stroke="#4aa86a" strokeWidth="1.2" />

              {/* Decorative bubbles & dots */}
              <circle cx="58" cy="72" r="2.5" fill="#243364" />
              <circle cx="208" cy="75" r="2.5" fill="#243364" />
              <circle cx="218" cy="67" r="1.8" fill="#55baed" />
              <circle cx="52" cy="80" r="1.5" fill="#55baed" />
            </svg>
          </div>

          {/* Heading */}
          <h1 style={styles.title}>Oops!</h1>

          {/* Body message */}
          <p style={styles.description}>
            You've found a page that doesn't exist. You can go back or open it in our app
          </p>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={handleGoHome}
              style={styles.homeBtn}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3aa0e0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#55baed';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Go to Homepage
            </button>

            <button
              type="button"
              onClick={handleGoBack}
              style={styles.backBtn}
              onMouseOver={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7f9',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#293066',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  header: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e8ecf1',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  hamburgerBtn: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoMark: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  },
  logoPaytm: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#243364',
    letterSpacing: '-0.3px',
  },
  logoMoney: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#55baed',
    letterSpacing: '0.2px',
  },
  headerCenter: {
    flex: '0 1 440px',
    margin: '0 24px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #bbbbbb',
    borderRadius: '6px',
    padding: '8px 14px',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
  },
  searchIcon: {
    marginRight: '10px',
    flexShrink: 0,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '13.5px',
    color: '#293066',
    width: '100%',
    cursor: 'default',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  signInBtn: {
    backgroundColor: '#55baed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 22px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#f5f7f9',
  },
  contentCard: {
    maxWidth: '540px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  illustrationWrapper: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#55baed',
    margin: '16px 0 10px 0',
    letterSpacing: '-0.3px',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.55',
    color: '#293066',
    maxWidth: '460px',
    margin: '0 0 28px 0',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    width: '100%',
  },
  homeBtn: {
    backgroundColor: '#55baed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '24px',
    padding: '12px 38px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(85, 186, 237, 0.28)',
    transition: 'all 0.15s ease',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#55baed',
    fontSize: '13.5px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '4px 8px',
    textDecoration: 'none',
  },
};
