// Centralized UX copy and microcopy strings

export const APP_COPY = {
  notFound: {
    title: 'Oops!',
    description: "You've found a page that doesn't exist. You can go back or open it in our app",
    homeCta: 'Go to Homepage',
    backCta: 'Go Back',
    searchPlaceholder: 'Search for Mutual Funds',
    signIn: 'Sign In',
  },
  payment: {
    pendingTitle: 'Payment is being processed',
    pendingSubtitle: 'Awaiting biller confirmation',
    doNotPayAgain: 'Your payment is safely in progress. If money was debited, your bill will be updated automatically. Reminders are paused.',
    failedTitle: 'Payment could not be completed',
    failedSubtitle: 'Transaction failed',
    refundAssurance: 'If any money was debited from your account, it will be automatically reversed to your bank account within 2 to 3 business days.',
    voucherSafeguard: 'Failed transactions do not count toward your bill payment voucher milestone.',
  },
  home: {
    allPaid: 'All tracked bills paid',
    neverAllBills: 'Tracked bills taken care of',
    addHome: 'Add another home',
  },
  voucher: {
    quotaText: (step, target = 3) => `${step} of ${target} qualifying bill payments completed`,
    unlockedMessage: 'Voucher unlocked! You have completed 3 qualifying payments.',
  }
};
