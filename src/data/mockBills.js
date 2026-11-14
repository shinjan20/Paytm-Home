// Centralized mock data layer for Paytm My Bills
// Pure client-side data models — no backend required.

export const INITIAL_HOMES = {
  personal: {
    id: 'personal',
    name: 'Personal Home',
    destination: 'screen-personal-home',
    path: '/home/personal',
    icon: 'house',
    status: 'paid', // 'paid' | 'pending' | 'overdue'
    statusLabel: 'All tracked bills paid',
    bills: [
      { id: 'b-pers-1', name: 'Electricity', amount: 2150, due: '18 Nov 2026', status: 'paid' },
      { id: 'b-pers-2', name: 'Broadband', amount: 1299, due: '25 Nov 2026', status: 'paid' },
      { id: 'b-pers-3', name: 'Piped Gas', amount: 850, due: '28 Nov 2026', status: 'paid' },
    ]
  },
  flatmates: {
    id: 'flatmates',
    name: 'Flatmates',
    destination: 'screen-flatmates-home',
    path: '/home/flatmates',
    icon: 'apartment',
    status: 'pending',
    statusLabel: '2 pending',
    bills: [
      { id: 'b-flat-1', name: 'Shared Broadband', amount: 2499, due: '20 Nov 2026', status: 'pending' },
      { id: 'b-flat-2', name: 'Netflix Subscription', amount: 649, due: '22 Nov 2026', status: 'pending' },
    ]
  }
};

export const INITIAL_BILLS = [
  {
    id: 'bill-elec-01',
    name: 'Electricity',
    biller: 'BSES Rajdhani Power Ltd',
    category: 'Electricity',
    icon: '⚡',
    account: 'XXXX1234',
    amount: 1840,
    due: '18 Nov 2026',
    status: 'confirmed_pending', // 'confirmed_pending' | 'estimated' | 'paid' | 'unverified'
    statusLabel: 'Confirmed pending',
    home: 'personal',
    source: 'Verified with biller',
    refreshed: '2 hours ago',
    history: [
      { month: 'Nov 2026', amount: 3150, status: 'paid' },
      { month: 'Oct 2026', amount: 1840, status: 'paid' },
      { month: 'Sep 2026', amount: 1650, status: 'paid' },
      { month: 'Aug 2026', amount: 1780, status: 'paid' }
    ]
  },
  {
    id: 'bill-cc-01',
    name: 'Credit Card',
    biller: 'HDFC Bank Credit Card',
    category: 'Credit Card',
    icon: '💳',
    account: 'XXXX5678',
    amount: 6250,
    due: '21 Nov 2026',
    status: 'unverified',
    statusLabel: 'Marked paid elsewhere',
    home: 'personal',
    source: 'User declared (Bank app)',
    refreshed: '1 day ago'
  },
  {
    id: 'bill-bb-01',
    name: 'Broadband',
    biller: 'Airtel Xstream Fiber',
    category: 'Broadband',
    icon: '🌐',
    account: 'XXXX9012',
    amount: 999,
    due: '25 Nov 2026',
    status: 'estimated',
    statusLabel: 'Upcoming · Estimated',
    home: 'personal',
    source: 'Historical cycle prediction',
    refreshed: '3 days ago'
  },
  {
    id: 'bill-ins-01',
    name: 'Insurance',
    biller: 'HDFC Life Insurance',
    category: 'Insurance',
    icon: '🛡️',
    account: 'XXXX3456',
    amount: 2400,
    due: '28 Nov 2026',
    status: 'paid',
    statusLabel: 'Paid · Verified',
    home: 'personal',
    source: 'Paytm payment transaction',
    refreshed: 'Just now'
  }
];

export const AVAILABLE_REWARDS = [
  { id: 'cashback-50', icon: '💸', name: '₹50 cashback', desc: 'Credited to your Paytm wallet' },
  { id: 'bill-discount', icon: '🧾', name: '10% off next bill', desc: 'Up to ₹200 on any bill' },
  { id: 'movie-ticket', icon: '🎬', name: 'Free movie ticket', desc: 'One ticket at partner cinemas' },
  { id: 'wallet-credit', icon: '💳', name: '₹100 wallet credit', desc: 'Valid for 30 days' }
];

export const EMAIL_CANDIDATES = [
  {
    id: 'electricity',
    biller: 'Electricity Board',
    icon: '⚡',
    subject: 'Your electricity bill for October 2026',
    sender: 'billing@electricityboard.in',
    received: '2 days ago',
    amount: 1840,
    due: '18 Nov 2026',
    kind: 'Bill email',
    checked: true,
    added: false
  },
  {
    id: 'broadband',
    biller: 'CityFiber Broadband',
    icon: '🌐',
    subject: 'Tax invoice for account #CF-89241',
    sender: 'ebill@cityfiber.net',
    received: '4 days ago',
    amount: 999,
    due: '22 Nov 2026',
    kind: 'PDF attached',
    checked: true,
    added: false
  },
  {
    id: 'pipedgas',
    biller: 'Indraprastha Gas',
    icon: '🔥',
    subject: 'IGL bi-monthly bill notification',
    sender: 'notifications@igl.co.in',
    received: '6 days ago',
    amount: 620,
    due: '27 Nov 2026',
    kind: 'Bill email',
    checked: true,
    added: false
  }
];
