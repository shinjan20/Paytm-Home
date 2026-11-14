import { INITIAL_BILLS, INITIAL_HOMES, AVAILABLE_REWARDS, EMAIL_CANDIDATES } from '../data/mockBills.js';

class BillsStore {
  constructor() {
    this.bills = [...INITIAL_BILLS];
    this.homes = { ...INITIAL_HOMES };
    this.activeHomeId = 'personal';
    this.voucherStep = 1;
    this.claimedRewardId = null;
    this.availableRewards = [...AVAILABLE_REWARDS];
    this.emailCandidates = [...EMAIL_CANDIDATES];
    this.simulationMode = 'auto'; // 'auto' | 'pending' | 'failed'
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  getState() {
    return {
      bills: this.bills,
      homes: this.homes,
      activeHomeId: this.activeHomeId,
      activeHome: this.homes[this.activeHomeId],
      voucherStep: this.voucherStep,
      claimedRewardId: this.claimedRewardId,
      availableRewards: this.availableRewards,
      emailCandidates: this.emailCandidates,
      simulationMode: this.simulationMode,
    };
  }

  setActiveHome(homeId) {
    if (this.homes[homeId]) {
      this.activeHomeId = homeId;
      this.notify();
    }
  }

  setSimulationMode(mode) {
    this.simulationMode = mode;
    this.notify();
  }

  payBill(billId) {
    const bill = this.bills.find(b => b.id === billId);
    if (bill) {
      bill.status = 'paid';
      bill.statusLabel = 'Paid · Verified';
      bill.refreshed = 'Just now';
      if (this.voucherStep < 3) {
        this.voucherStep += 1;
      }
      this.notify();
    }
  }

  markPaidOffline(billId, method = 'bank', ref = '') {
    const bill = this.bills.find(b => b.id === billId);
    if (bill) {
      bill.status = 'unverified';
      bill.statusLabel = 'Marked paid · awaiting confirmation';
      bill.paymentMethod = method;
      bill.paymentRef = ref;
      bill.refreshed = 'Just now';
      this.notify();
    }
  }

  claimReward(rewardId) {
    if (!this.claimedRewardId && this.voucherStep >= 3) {
      this.claimedRewardId = rewardId;
      this.notify();
    }
  }
}

// Global store instance
export const billsStore = new BillsStore();
if (typeof window !== 'undefined') {
  window.__paytmBillsStore = billsStore;
}
