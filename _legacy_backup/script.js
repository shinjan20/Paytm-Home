// Paytm My Bills Prototype - JavaScript

// Navigation function
let previousScreenId = null;

function navigateTo(screenId) {
    // Remember where the user came from
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen && currentScreen.id !== screenId) {
        previousScreenId = currentScreen.id;
    }

    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    } else {
        const notFoundScreen = document.getElementById('screen-404');
        if (notFoundScreen) {
            notFoundScreen.classList.add('active');
        }
    }

    // Camera control: turn on for OCR/scan QR cases
    handleCameraForScreen(screenId);

    syncTabStates();

    // Scroll to top
    window.scrollTo(0, 0);
}

let __cameraStream = null;
function handleCameraForScreen(screenId) {
    const video = document.getElementById('camera-preview');
    if (screenId === 'screen-camera') {
        if (video && !__cameraStream) {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                    .then(stream => {
                        __cameraStream = stream;
                        video.srcObject = stream;
                        video.play().catch(() => {});
                    })
                    .catch(err => {
                        console.warn('Camera access denied or unavailable:', err);
                        // Fall back to static placeholder
                        const denied = document.getElementById('screen-camera-denied');
                        // keep on camera screen; show hint
                    });
            } else {
                console.warn('getUserMedia not supported');
            }
        }
    } else {
        if (__cameraStream) {
            __cameraStream.getTracks().forEach(t => t.stop());
            __cameraStream = null;
            if (video) video.srcObject = null;
        }
    }
}

// Return from Add bill to wherever it was opened from
function backFromAddBill() {
    const destination = previousScreenId && previousScreenId !== 'screen-add-bill'
        ? previousScreenId
        : 'screen-my-bills';

    navigateTo(destination);
}

// Tab switching function
function switchTab(tab) {
    if (tab === 'me') {
        // Show My Bills (Me tab)
        navigateTo('screen-my-bills');
    } else if (tab === 'home') {
        // Show Home selection screen
        navigateTo('screen-home-selection');
    }
}

// Home selector bottom sheet
function showHomeSelector() {
    document.getElementById('home-selector-sheet').classList.add('active');
}

function closeHomeSelector() {
    document.getElementById('home-selector-sheet').classList.remove('active');
}

function selectHome(home) {
    closeHomeSelector();

    activeHome = home;
    renderLandingOverview();

    if (home === 'personal') {
        navigateTo('screen-personal-home');
    } else if (home === 'flatmates') {
        navigateTo('screen-flatmates-home');
    }
}

// All Bill Payments bottom sheet
function showAllBillsSheet() {
    document.getElementById('all-bills-sheet').classList.add('active');
}

function closeAllBillsSheet() {
    document.getElementById('all-bills-sheet').classList.remove('active');
}

// Bill detail secondary actions
function openBillActions() {
    document.getElementById('bill-actions-sheet').classList.add('active');
}

function closeBillActions() {
    document.getElementById('bill-actions-sheet').classList.remove('active');
}

// Landing bill-payment offers banner (two slides, each with a defined destination)
const OFFER_SLIDES = [
    {
        title: 'Get up to ₹150 Off',
        sub: 'using top bank cards',
        action: 'all-bills',
        aria: 'Get up to ₹150 Off using top bank cards. Opens all bill payments.'
    },
    {
        title: 'Earn a bill voucher',
        sub: 'on your 3rd bill payment',
        action: 'reward',
        aria: 'Earn a bill payment voucher on your 3rd qualifying bill payment. Opens voucher details.'
    }
];
let offerSlideIndex = 0;

function setOfferSlide(index) {
    const slide = OFFER_SLIDES[index];
    if (!slide) return;

    offerSlideIndex = index;

    const title = document.getElementById('offers-banner-title');
    const sub = document.getElementById('offers-banner-sub');
    const banner = document.getElementById('offers-banner-hit');

    if (title) title.textContent = slide.title;
    if (sub) sub.textContent = slide.sub;
    if (banner) banner.setAttribute('aria-label', slide.aria);

    document.querySelectorAll('.offers-dot').forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
}

function handleOfferBannerClick() {
    const slide = OFFER_SLIDES[offerSlideIndex];
    if (slide && slide.action === 'reward') {
        navigateTo('screen-voucher-details');
    } else {
        showAllBillsSheet();
    }
}

function openBillerSearch(category) {
    closeAllBillsSheet();

    const searchInput = document.getElementById('biller-search-input');
    if (searchInput) {
        searchInput.value = category;
    }

    navigateTo('screen-biller-search');
}

// Landing "My Bills" overview (Me / Home modes)
let landingMode = 'me';
let activeHome = 'personal';

const ME_BILL_DATA = {
    destination: 'screen-my-bills',
    bills: [
        { name: 'Electricity', amount: '₹1,840' },
        { name: 'Credit Card', amount: '₹6,250' }
    ]
};

const HOME_DATA = {
    personal: {
        name: 'Personal Home',
        destination: 'screen-personal-home',
        icon: 'house',
        bills: [1840, 999, 850]
    },
    flatmates: {
        name: 'Flatmates',
        destination: 'screen-flatmates-home',
        icon: 'apartment',
        bills: [2499, 649]
    }
};

function formatRupees(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function homeIconSvg(type) {
    if (type === 'apartment') {
        return '<svg viewBox="0 0 48 48" aria-hidden="true">' +
            '<rect x="11" y="8" width="26" height="32" rx="4" fill="#8b7bf7"/>' +
            '<rect x="15" y="13" width="7" height="7" rx="1.5" fill="#fff"/>' +
            '<rect x="26" y="13" width="7" height="7" rx="1.5" fill="#fff"/>' +
            '<rect x="15" y="23" width="7" height="7" rx="1.5" fill="#fff"/>' +
            '<rect x="26" y="23" width="7" height="7" rx="1.5" fill="#fff"/>' +
            '<path d="M19 40v-5a5 5 0 0 1 10 0v5z" fill="#fff"/>' +
            '</svg>';
    }

    return '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        '<path d="M8 24 L24 10 L40 24" fill="none" stroke="#0f9fd0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M12 22v18h24V22" fill="#3ec6f0"/>' +
        '<rect x="21" y="29" width="6" height="11" rx="1" fill="#fff"/>' +
        '<rect x="15" y="25.5" width="4.5" height="4.5" rx="1" fill="#e6f7ff"/>' +
        '<rect x="28.5" y="25.5" width="4.5" height="4.5" rx="1" fill="#e6f7ff"/>' +
        '</svg>';
}

function createHomeTile(key, home) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'home-tile';
    tile.setAttribute('aria-label', `${home.name}, ${formatRupees(home.bills.reduce((total, bill) => total + bill, 0))} due`);
    tile.onclick = function() {
        openLandingHome(key);
    };

    const art = document.createElement('span');
    art.className = 'home-tile-art';
    art.innerHTML = homeIconSvg(home.icon);

    const tooltip = document.createElement('span');
    tooltip.className = 'home-due-tooltip';
    tooltip.textContent = `${formatRupees(home.bills.reduce((total, bill) => total + bill, 0))} due`;
    art.appendChild(tooltip);

    const name = document.createElement('span');
    name.className = 'home-tile-name';
    name.textContent = home.name;

    const meta = document.createElement('span');
    meta.className = 'home-tile-meta';
    meta.textContent = `${home.bills.length} bill${home.bills.length === 1 ? '' : 's'}`;

    tile.append(art, name, meta);
    return tile;
}

function createAddHomeTile() {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'home-tile add-home-tile';
    tile.onclick = showAddHomeModal;

    const art = document.createElement('span');
    art.className = 'home-tile-art add-home-art';
    art.textContent = '+';

    const name = document.createElement('span');
    name.className = 'home-tile-name';
    name.textContent = 'Add home';

    const meta = document.createElement('span');
    meta.className = 'home-tile-meta';
    meta.textContent = 'New house';

    tile.append(art, name, meta);
    return tile;
}

function setLandingMode(mode) {
    landingMode = mode;
    renderLandingOverview();
    syncTabStates();
}

function renderLandingOverview() {
    const preview = document.getElementById('landing-preview');
    const openLabel = document.getElementById('landing-open-label');

    if (!preview) {
        return;
    }

    document.querySelectorAll('.card-toggle .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === landingMode);
    });

    const isHomeMode = landingMode === 'home';

    preview.innerHTML = '';
    preview.classList.toggle('home-tiles', isHomeMode);

    if (isHomeMode) {
        Object.keys(HOME_DATA).forEach(homeKey => {
            preview.appendChild(createHomeTile(homeKey, HOME_DATA[homeKey]));
        });
        preview.appendChild(createAddHomeTile());
    } else {
        ME_BILL_DATA.bills.forEach(bill => {
            const item = document.createElement('div');
            item.className = 'bill-preview-item';

            const name = document.createElement('span');
            name.className = 'bill-preview-name';
            name.textContent = bill.name;

            const amount = document.createElement('span');
            amount.className = 'bill-preview-amount';
            amount.textContent = bill.amount;

            item.append(name, amount);
            preview.appendChild(item);
        });
    }

    if (openLabel) {
        openLabel.textContent = isHomeMode ? 'View all homes' : 'View my bills';
    }
}

function openLandingHome(homeKey) {
    const home = HOME_DATA[homeKey];
    if (!home) {
        return;
    }

    activeHome = homeKey;
    navigateTo(home.destination);
}

function openLandingBills() {
    navigateTo(landingMode === 'home' ? 'screen-home-selection' : ME_BILL_DATA.destination);
}

// Bill payment flow and voucher progress
let meVoucherStep = 1;

function openPayBill() {
    renderPayVoucherHint();
    navigateTo('screen-pay-bill');
}

function renderPayVoucherHint() {
    const copy = document.getElementById('pay-voucher-copy');
    const fill = document.getElementById('pay-voucher-fill');
    const meta = document.getElementById('pay-voucher-meta');

    if (fill) {
        fill.style.width = Math.round((meVoucherStep / 3) * 100) + '%';
    }

    if (copy) {
        copy.textContent = meVoucherStep >= 3
            ? 'You have already completed 3 qualifying payments, so this payment will not add to your voucher progress.'
            : `This eligible payment takes you from ${meVoucherStep} of 3 to ${meVoucherStep + 1} of 3 qualifying payments.`;
    }

    if (meta) {
        meta.textContent = `${meVoucherStep} of 3 completed · only successful Paytm payments count`;
    }
}

// Payment transaction state machine
let paymentSimulationMode = 'auto'; // 'auto' | 'pending' | 'failed'
let pendingTimer = null;

function setPaymentSimulationMode(mode) {
    paymentSimulationMode = mode;
    document.querySelectorAll('.sim-mode-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-mode') === mode);
    });
    if (mode === 'failed') {
        showAppToast('Simulator set to: Bank Timeout / Payment Failed');
    } else if (mode === 'pending') {
        showAppToast('Simulator set to: Processing / Pending with BBPS');
    } else {
        showAppToast('Simulator set to: Auto (Pending → Success)');
    }
}

function payBill() {
    initiatePayment();
}

function initiatePayment() {
    if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingTimer = null;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const timestampStr = `${formattedDate}, ${formattedTime}`;

    const pendingTime = document.getElementById('pending-time-display');
    const failedTime = document.getElementById('failed-time-display');
    if (pendingTime) pendingTime.textContent = timestampStr;
    if (failedTime) failedTime.textContent = timestampStr;

    navigateTo('screen-payment-pending');
    resetPendingTimeline();

    if (paymentSimulationMode === 'failed') {
        // Direct simulation of timeout failure after a brief check
        pendingTimer = setTimeout(() => {
            resolvePayment('failed');
        }, 1500);
    } else if (paymentSimulationMode === 'pending') {
        // Keeps user in pending state to examine reassurance, timeline & check status
        showAppToast('Payment in progress · awaiting biller clearance');
    } else {
        // Auto resolve: pending with animated progression to success
        setTimeout(() => {
            const step2 = document.getElementById('pending-step-2');
            if (step2) step2.classList.add('active');
        }, 800);

        pendingTimer = setTimeout(() => {
            resolvePayment('success');
        }, 2200);
    }
}

function resetPendingTimeline() {
    const step1 = document.getElementById('pending-step-1');
    const step2 = document.getElementById('pending-step-2');
    const step3 = document.getElementById('pending-step-3');
    if (step1) {
        step1.className = 'timeline-step completed';
    }
    if (step2) {
        step2.className = 'timeline-step active';
    }
    if (step3) {
        step3.className = 'timeline-step upcoming';
    }
}

function resolvePayment(outcome) {
    if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingTimer = null;
    }

    if (outcome === 'success') {
        if (meVoucherStep < 3) {
            meVoucherStep += 1;
        }

        updateMeVoucher();
        updateVoucherDetails();
        updateSuccessCue();

        showAppToast('Payment confirmed by biller ✓');
        navigateTo('screen-payment-success');
    } else if (outcome === 'failed') {
        showAppToast('Payment failed · Bank switch timeout');
        navigateTo('screen-payment-failed');
    }
}

function checkPendingStatus() {
    showAppToast('Checking status with BSES Rajdhani & BBPS...');
    const btn = document.querySelector('#screen-payment-pending .primary-btn');
    if (btn) {
        btn.textContent = 'Checking...';
        btn.disabled = true;
    }

    setTimeout(() => {
        if (btn) {
            btn.textContent = 'Check status';
            btn.disabled = false;
        }
        if (paymentSimulationMode === 'failed') {
            resolvePayment('failed');
        } else {
            resolvePayment('success');
        }
    }, 1200);
}

function retryPayment() {
    const walletRadio = document.querySelector('input[name="pay-method"][value="wallet"]');
    if (walletRadio) walletRadio.checked = true;
    showAppToast('Selected Paytm Wallet for retry');
    navigateTo('screen-pay-bill');
}

function contactPaymentSupport() {
    showAppToast('Support Ticket #PTM-98421 opened · Ref: PTM-FAIL-582910');
}

function updateVoucherDetails() {
    const fill = document.getElementById('voucher-progress-fill');
    const text = document.getElementById('voucher-progress-text');
    const status = document.getElementById('voucher-status-badge');
    const item = document.getElementById('voucher-electricity-item');
    const date = document.getElementById('voucher-electricity-date');
    const badge = document.getElementById('voucher-electricity-badge');
    const percent = Math.round((meVoucherStep / 3) * 100);

    if (fill) {
        fill.style.width = percent + '%';
    }
    if (text) {
        text.textContent = `${meVoucherStep} of 3 qualifying payments`;
    }
    if (status) {
        status.classList.toggle('in-progress', meVoucherStep < 3);
        status.classList.toggle('unlocked', meVoucherStep >= 3);
        status.textContent = meVoucherStep >= 3 ? 'Unlocked' : 'In progress';
    }

    if (item && meVoucherStep >= 2) {
        item.classList.remove('pending');
        item.classList.add('completed');
    }
    if (date && meVoucherStep >= 2) {
        date.textContent = 'Paid today';
    }
    if (badge && meVoucherStep >= 2) {
        badge.classList.remove('pending');
        badge.classList.add('counted');
        badge.textContent = 'Counted';
    }
    updateHomeReward();
}

function updateMeVoucher() {
    const fill = document.getElementById('me-voucher-fill');
    const text = document.getElementById('me-voucher-text');
    const status = document.getElementById('me-voucher-status');
    const percent = Math.round((meVoucherStep / 3) * 100);

    if (fill) {
        fill.style.width = percent + '%';
    }
    if (text) {
        text.textContent = `${meVoucherStep} of 3 qualifying bill payments completed`;
    }
    if (status) {
        status.textContent = meVoucherStep >= 3 ? 'Unlocked' : 'In progress';
    }
    updateHomeReward();
}

function updateSuccessCue() {
    const fill = document.getElementById('success-voucher-fill');
    const text = document.getElementById('success-voucher-text');

    if (fill) {
        fill.style.width = Math.round((meVoucherStep / 3) * 100) + '%';
    }

    if (text) {
        if (meVoucherStep >= 3) {
            text.textContent = '3 of 3 qualifying payments completed. Your bill payment voucher is unlocked.';
        } else {
            const remaining = 3 - meVoucherStep;
            text.textContent = `${meVoucherStep} of 3 qualifying payments completed. ${remaining} more to unlock your bill payment voucher.`;
        }
    }
}

// Home reward card + celebration flow
const REWARD_ICON_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
const REWARD_ICON_TICKET = `<svg ${REWARD_ICON_ATTRS}><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v1a2.5 2.5 0 0 0 0 5v1a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15.5v-1a2.5 2.5 0 0 0 0-5v-1Z"/><path d="M14.5 6.5v2M14.5 11v2M14.5 15.5v2"/></svg>`;
const REWARD_ICON_PERCENT = `<svg ${REWARD_ICON_ATTRS}><path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>`;
const REWARD_ICON_TV = `<svg ${REWARD_ICON_ATTRS}><rect x="3.5" y="6.5" width="17" height="11.5" rx="2"/><path d="m8 3.5 4 3 4-3"/></svg>`;
const REWARD_ICON_WIFI = `<svg ${REWARD_ICON_ATTRS}><path d="M3.5 9.5a12 12 0 0 1 17 0"/><path d="M6.8 13a8 8 0 0 1 10.4 0"/><path d="M10 16.4a3.4 3.4 0 0 1 4 0"/><circle cx="12" cy="19.3" r="1"/></svg>`;

// Voucher options (max 4) the user can choose from after the 3rd qualifying bill payment.
// Rewards are always bill-payment vouchers - never cashback or a free bill payment.
const AVAILABLE_REWARDS = [
    { id: 'voucher-100', icon: REWARD_ICON_TICKET, name: '₹100 bill voucher', desc: 'Redeem on any bill of ₹500 or more' },
    { id: 'voucher-10pc', icon: REWARD_ICON_PERCENT, name: '10% off next bill', desc: 'Up to ₹200 on any bill payment' },
    { id: 'voucher-dth', icon: REWARD_ICON_TV, name: '₹75 DTH voucher', desc: 'On your next DTH recharge' },
    { id: 'voucher-broadband', icon: REWARD_ICON_WIFI, name: '₹50 broadband voucher', desc: 'On your next broadband bill' }
];
let claimedRewardId = null;

function renderHomeRewards() {
    const list = document.getElementById('home-rewards-list');
    if (!list) return;

    const unlocked = meVoucherStep >= 3;
    list.innerHTML = AVAILABLE_REWARDS.map(reward => {
        const claimed = claimedRewardId === reward.id;
        const status = claimed ? 'Claimed' : (unlocked ? 'Claim' : 'Locked');
        return `<div class="home-reward-card${claimed ? ' claimed' : ''}${unlocked ? ' unlocked' : ''}">
            <div class="home-reward-card-icon">${reward.icon}</div>
            <div class="home-reward-card-body">
                <span class="home-reward-card-name">${reward.name}</span>
                <span class="home-reward-card-desc">${reward.desc}</span>
                <span class="home-reward-card-expiry">Expires in 30 days</span>
            </div>
            <button class="home-reward-card-cta" ${unlocked ? '' : 'disabled'} onclick="openHomeReward()">${status}</button>
        </div>`;
    }).join('');
}

function renderRewardChooser() {
    const list = document.getElementById('reward-chooser-list');
    if (!list) return;

    list.innerHTML = AVAILABLE_REWARDS.map(reward => {
        const claimed = claimedRewardId === reward.id;
        return `<div class="reward-chooser-item${claimed ? ' claimed' : ''}">
            <div class="reward-chooser-item-icon">${reward.icon}</div>
            <div class="reward-chooser-item-info">
                <h3>${reward.name}</h3>
                <p>${reward.desc}</p>
            </div>
            <button class="primary-btn reward-chooser-claim${claimed ? ' claimed' : ''}" ${claimed ? 'disabled' : ''} onclick="claimReward('${reward.id}')">
                ${claimed ? '✓ Claimed' : 'Claim'}
            </button>
        </div>`;
    }).join('');
}

function claimReward(rewardId) {
    const reward = AVAILABLE_REWARDS.find(item => item.id === rewardId);
    if (!reward || claimedRewardId) return;

    claimedRewardId = rewardId;
    renderHomeRewards();
    renderRewardChooser();
    showAppToast(`Voucher claimed: ${reward.name}`);
    navigateTo('screen-recharge-bills');
}

function toggleRewardsExpand() {
    const list = document.getElementById('home-rewards-list');
    const toggle = document.getElementById('home-rewards-toggle');
    if (!list || !toggle) return;

    const expanded = list.classList.toggle('expanded');
    const arrow = toggle.querySelector('.home-rewards-expand-arrow');
    if (arrow) arrow.textContent = expanded ? '↑' : '↓';
    toggle.setAttribute('aria-label', expanded ? 'Show fewer rewards' : 'Show more rewards');
    toggle.classList.toggle('expanded', expanded);
}

const REWARD_LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
const REWARD_CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

function updateLandingRewardsCard() {
    const step = meVoucherStep;
    const remaining = Math.max(3 - step, 0);
    const unlocked = step >= 3;

    const number = document.getElementById('rewards-progress-number');
    const ring = document.getElementById('rewards-ring-fill');
    const title = document.getElementById('rewards-progress-title');
    const desc = document.getElementById('rewards-progress-desc');
    const nextStatus = document.getElementById('rewards-next-status');
    const card = document.getElementById('rewards-voucher-card');
    const subtitle = document.getElementById('rewards-voucher-subtitle');
    const progress = document.getElementById('rewards-voucher-progress');
    const lock = document.getElementById('rewards-voucher-lock');

    if (number) number.textContent = String(step);
    if (ring) ring.setAttribute('stroke-dashoffset', String(Math.round(220 * (1 - Math.min(step, 3) / 3))));
    if (title) title.textContent = unlocked ? 'Voucher unlocked' : 'Almost there!';
    if (desc) {
        desc.textContent = unlocked
            ? 'Tap to claim your voucher'
            : `Pay ${remaining} more bill${remaining === 1 ? '' : 's'} to unlock your voucher`;
    }
    if (nextStatus) nextStatus.textContent = unlocked ? 'Ready to claim' : 'Unlocks on your 3rd bill payment';
    if (card) card.classList.toggle('locked', !unlocked);
    if (subtitle) subtitle.textContent = unlocked ? 'Unlocked · ready to claim' : 'Earned after 3 qualifying bill payments';
    if (progress) progress.textContent = `${step}/3`;
    if (lock) {
        lock.innerHTML = unlocked ? REWARD_CHECK_SVG : REWARD_LOCK_SVG;
        lock.classList.toggle('unlocked', unlocked);
    }
}

function updateHomeReward() {
    const status = document.getElementById('home-rewards-status');
    const fill = document.getElementById('home-rewards-fill');
    const percent = Math.round((meVoucherStep / 3) * 100);

    if (fill) {
        fill.style.width = percent + '%';
    }
    if (status) {
        status.textContent = meVoucherStep >= 3
            ? 'Unlocked · tap to claim your voucher'
            : `In progress · ${meVoucherStep} of 3 qualifying payments`;
    }
    updateLandingRewardsCard();
    renderHomeRewards();
}

function openHomeReward() {
    const remaining = 3 - meVoucherStep;

    if (meVoucherStep >= 3) {
        showRewardCelebration();
        return;
    }

    const promptText = document.getElementById('reward-prompt-text');
    const promptFill = document.getElementById('reward-prompt-fill');
    const promptMeta = document.getElementById('reward-prompt-meta');

    if (promptText) {
        promptText.textContent = `Pay ${remaining} more qualifying bill${remaining > 1 ? 's' : ''} to unlock your voucher. Only successful Paytm bill payments count.`;
    }
    if (promptFill) {
        promptFill.style.width = Math.round((meVoucherStep / 3) * 100) + '%';
    }
    if (promptMeta) {
        promptMeta.textContent = `${meVoucherStep} of 3 completed · only successful Paytm payments count`;
    }

    const modal = document.getElementById('reward-prompt-modal');
    if (modal) modal.classList.add('active');
}

function closeRewardPrompt() {
    const modal = document.getElementById('reward-prompt-modal');
    if (modal) modal.classList.remove('active');
}

function showRewardCelebration() {
    const overlay = document.getElementById('reward-celebration');
    if (!overlay) return;
    overlay.hidden = false;
    overlay.classList.remove('reward-celebration--play');
    void overlay.offsetWidth;
    overlay.classList.add('reward-celebration--play');
}

function closeRewardCelebration() {
    const overlay = document.getElementById('reward-celebration');
    if (overlay) {
        overlay.hidden = true;
        overlay.classList.remove('reward-celebration--play');
    }
}

// Mark Paid Modal
function showMarkPaidModal() {
    document.getElementById('mark-paid-modal').classList.add('active');
}

function closeMarkPaidModal() {
    document.getElementById('mark-paid-modal').classList.remove('active');
}

// Add Home Modal
function showAddHomeModal() {
    document.getElementById('add-home-modal').classList.add('active');
}

function closeAddHomeModal() {
    document.getElementById('add-home-modal').classList.remove('active');
}

function createHome() {
    closeAddHomeModal();
    console.log('Create new home');
    showAppToast('New home created! (Prototype)');
}

function snoozeBillReminder() {
    showAppToast('Reminder snoozed · we will nudge you later');
}

function refreshBillStatus() {
    const btn = document.querySelector('#screen-bill-detail .meta-refresh-btn');
    if (btn) {
        btn.classList.remove('refreshing');
        void btn.offsetWidth;
        btn.classList.add('refreshing');
        window.setTimeout(() => btn.classList.remove('refreshing'), 700);
    }
    showAppToast('Bill status refreshed');
}

function startCreditScoreCheck() {
    showAppToast('Credit score check is illustrative in this prototype');
}

function removeBill() {
    showAppConfirm({
        title: 'Remove this bill?',
        message: 'It will be removed from My Bills. Your payment history stays intact.',
        confirmLabel: 'Remove bill',
        onConfirm: function() {
            showAppToast('Bill removed from My Bills');
            navigateTo('screen-my-bills');
        }
    });
}

function attemptOfflineRefresh() {
    showAppToast("You're offline · bills will refresh once you're back online");
}

function saveReminderPreferences() {
    showAppToast('Reminder preferences saved');
    navigateTo('screen-bill-detail');
}

// Rename home
let renameHomeTarget = null;

function openRenameHome(homeName) {
    renameHomeTarget = homeName;
    const modal = document.getElementById('rename-home-modal');
    const input = document.getElementById('rename-home-name');
    if (input) input.value = homeName || '';
    if (modal) modal.classList.add('active');
}

function closeRenameHomeModal() {
    const modal = document.getElementById('rename-home-modal');
    if (modal) modal.classList.remove('active');
    renameHomeTarget = null;
}

function renameHome() {
    const input = document.getElementById('rename-home-name');
    const newName = (input && input.value || '').trim();
    if (!newName) {
        showAppToast('Enter a new home name');
        return;
    }
    const list = document.getElementById('home-list-homes');
    if (list && renameHomeTarget) {
        list.querySelectorAll('.home-card').forEach(card => {
            const title = card.querySelector('h2, h3');
            if (title && title.textContent.trim() === renameHomeTarget) {
                title.textContent = newName;
            }
        });
    }
    showAppToast(`Home renamed to "${newName}"`);
    closeRenameHomeModal();
}

function switchInsightState(state) {
    const screen = document.getElementById('screen-smart-insight');
    if (!screen) return;

    screen.querySelectorAll('.insight-state-tab').forEach(tab => {
        const active = tab.dataset.state === state;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.setAttribute('tabindex', active ? '0' : '-1');
    });
    screen.querySelectorAll('.insight-panel').forEach(panel => {
        panel.hidden = panel.dataset.panel !== state;
    });
}

function acceptHomeInvite(homeName) {
    const name = homeName || 'this home';
    removeHomeInviteCard(name);
    updateHomeCardAfterAccept(name);
    updateHomePendingInvite();
    updateHomeInviteBadge();
    // Take the user to that group's bill details page and prompt to pay off remaining bills
    const groupNameEl = document.querySelector('#screen-flatmates-home .home-name');
    if (groupNameEl) groupNameEl.textContent = '👥 ' + name;
    const banner = document.getElementById('pay-remaining-banner');
    if (banner) banner.hidden = false;
    navigateTo('screen-flatmates-home');
    setTimeout(() => {
        showAppToast(`Welcome to ${name}! Pay off the remaining bills.`);
    }, 300);
}

function declineHomeInvite(homeName) {
    removeHomeInviteCard(homeName);
    removeHomeCard(homeName);
    updateHomePendingInvite();
    updateHomeInviteBadge();
    showAppToast('Invitation declined');
}

function updateHomeCardAfterAccept(homeName) {
    const list = document.getElementById('home-list-homes');
    if (!list) return;
    list.querySelectorAll('.home-card').forEach(card => {
        const title = card.querySelector('h2, h3');
        if (title && title.textContent.trim() === homeName) {
            const badge = card.querySelector('.home-badge');
            if (badge) {
                badge.className = 'home-badge home-badge-joined';
                badge.textContent = 'Joined · invite closed';
            }
            card.classList.remove('invite-open');
            card.classList.add('joined');
        }
    });
}

function removeHomeInviteCard(homeName) {
    const list = document.getElementById('home-list-invitations');
    if (!list) return;
    list.querySelectorAll('.home-invite-card').forEach(card => {
        const title = card.querySelector('h2, h3');
        if (title && title.textContent.trim() === homeName) {
            card.remove();
        }
    });
    const empty = document.getElementById('home-invite-empty');
    if (empty && !list.querySelector('.home-invite-card')) {
        empty.hidden = false;
    }
}

function removeHomeCard(homeName) {
    const list = document.getElementById('home-list-homes');
    if (!list) return;
    list.querySelectorAll('.home-card').forEach(card => {
        const title = card.querySelector('h2, h3');
        if (title && title.textContent.trim() === homeName) {
            card.remove();
        }
    });
}

function updateHomeInviteBadge() {
    const badge = document.getElementById('home-invite-badge');
    const list = document.getElementById('home-list-invitations');
    if (!badge || !list) return;
    const count = list.querySelectorAll('.home-invite-card').length;
    badge.textContent = String(count);
    badge.hidden = count === 0;
    updateHomePendingInvite();
}

function updateHomePendingInvite() {
    const banner = document.getElementById('home-pending-invite');
    const list = document.getElementById('home-list-invitations');
    if (!banner || !list) return;
    const card = list.querySelector('.home-invite-card');
    if (!card) {
        banner.hidden = true;
        return;
    }
    const nameEl = card.querySelector('h2, h3');
    const reasonEl = card.querySelector('.home-invite-reason');
    const name = nameEl ? nameEl.textContent.trim() : 'a home';
    const reason = reasonEl ? reasonEl.textContent.trim() : '';
    const nameTarget = document.getElementById('home-pending-invite-name');
    const reasonTarget = document.getElementById('home-pending-invite-reason');
    if (nameTarget) nameTarget.textContent = name;
    if (reasonTarget) reasonTarget.textContent = reason;
    // wire accept/decline buttons to this home
    banner.querySelectorAll('[onclick*="HomeInvite"]').forEach(btn => {
        if (btn.getAttribute('onclick').includes('acceptHomeInvite')) {
            btn.setAttribute('onclick', `acceptHomeInvite('${name}')`);
        } else if (btn.getAttribute('onclick').includes('declineHomeInvite')) {
            btn.setAttribute('onclick', `declineHomeInvite('${name}')`);
        }
    });
    banner.hidden = false;
}

function switchHomeTab(tab) {
    const homes = document.getElementById('home-list-homes');
    const invites = document.getElementById('home-list-invitations');
    const buttons = document.querySelectorAll('.home-tab-btn');

    buttons.forEach(button => {
        button.classList.toggle('active', button.dataset.homeTab === tab);
    });

    if (homes) homes.hidden = tab !== 'homes';
    if (invites) invites.hidden = tab !== 'invitations';
    syncTabStates();
}

function copyInviteLink(elementId) {
    const el = document.getElementById(elementId);
    const text = el ? (el.textContent || '').trim() : '';
    if (!text) {
        showAppToast('Nothing to copy');
        return;
    }

    const done = function() { showAppToast('Invite link copied'); };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function() { fallbackCopy(text, done); });
    } else {
        fallbackCopy(text, done);
    }
}

function fallbackCopy(text, callback) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        callback();
    } catch (err) {
        showAppToast('Copy failed · select the link manually');
    }
}

let addHomeMemberCount = 0;

function addHomeMember() {
    const input = document.getElementById('add-home-member-name');
    const list = document.getElementById('add-home-member-list');
    const sendButton = document.getElementById('add-home-invite-send');
    const inviteText = document.getElementById('add-home-invite-link-text');

    const name = (input && input.value || '').trim();
    if (!name) {
        showAppToast('Enter a name to send the invite');
        return;
    }

    const count = list ? list.childElementCount : addHomeMemberCount;
    if (count >= 5) {
        showAppToast('Up to 5 people can join a home');
        return;
    }

    if (list) {
        const item = document.createElement('div');
        item.className = 'add-home-member-item';
        item.innerHTML = `<span>${name}</span><button type="button" class="add-home-member-remove" onclick="removeHomeMember(this)">Remove</button>`;
        list.appendChild(item);
    }

    addHomeMemberCount += 1;
    if (input) input.value = '';
    if (inviteText) inviteText.textContent = `paytm://join/hm-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function removeHomeMember(button) {
    const item = button.closest('.add-home-member-item');
    if (item && item.parentElement) {
        item.parentElement.removeChild(item);
    }
}

// ============================================================
// Email bill discovery
// Invitation → consent → simulated read-only scan → review → connected
// ============================================================
let emailConnection = 'disconnected';
let emailProvider = 'gmail';
let emailInviteDismissed = false;
let emailStatusDismissed = false;
let emailLastScanLabel = 'Not scanned yet';
let emailScanOrigin = 'consent';
let emailConsentOrigin = 'screen-add-bill';
let emailScanTimers = [];
let appToastTimer = null;

const EMAIL_CANDIDATES = [
    {
        id: 'electricity',
        biller: 'Electricity Board',
        icon: '⚡',
        subject: 'Your electricity bill for November 2026',
        sender: 'billing@electricityboard.in',
        received: '2 days ago',
        amount: 1840,
        due: '18 Nov 2026',
        kind: 'Bill email',
        checked: true,
        added: false
    },
    {
        id: 'credit-card',
        biller: 'Credit Card Statement',
        icon: '💳',
        subject: 'Your November credit card bill',
        sender: 'statements@bankmail.in',
        received: '1 week ago',
        amount: 6250,
        due: '21 Nov 2026',
        kind: 'PDF attachment',
        checked: true,
        added: false
    },
    {
        id: 'broadband',
        biller: 'Broadband Invoice',
        icon: '🌐',
        subject: 'Your broadband bill for November',
        sender: 'accounts@fibernet.in',
        received: '3 days ago',
        amount: 999,
        due: '20 Nov 2026',
        kind: 'Bill email',
        checked: false,
        added: false
    }
];

function emailProviderName() {
    return emailProvider === 'gmail' ? 'Gmail' : 'Outlook';
}

function emailProviderSignIn() {
    return emailProvider === 'gmail' ? 'Google' : 'Microsoft';
}

function emailAddedCount() {
    return EMAIL_CANDIDATES.filter(candidate => candidate.added).length;
}

function openEmailConsent() {
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen && currentScreen.id !== 'screen-email-consent') {
        emailConsentOrigin = currentScreen.id;
    }
    selectEmailProvider(emailProvider);
    navigateTo('screen-email-consent');
}

function backFromEmailConsent() {
    navigateTo(emailConsentOrigin || 'screen-add-bill');
}

function declineEmailConsent() {
    emailInviteDismissed = true;
    renderEmailExperience();
    navigateTo(emailConsentOrigin || 'screen-add-bill');
}

function selectEmailProvider(provider) {
    emailProvider = provider;
    const isGmail = provider === 'gmail';

    const gmail = document.getElementById('provider-gmail');
    const outlook = document.getElementById('provider-outlook');
    if (gmail) gmail.classList.toggle('selected', isGmail);
    if (outlook) outlook.classList.toggle('selected', !isGmail);

    const gmailRadio = gmail && gmail.querySelector('input');
    const outlookRadio = outlook && outlook.querySelector('input');
    if (gmailRadio) gmailRadio.checked = isGmail;
    if (outlookRadio) outlookRadio.checked = !isGmail;

    const connectButton = document.getElementById('email-connect-button');
    if (connectButton) {
        connectButton.textContent = `Continue with ${emailProviderSignIn()}`;
    }

    const inlineProvider = document.getElementById('email-provider-name-inline');
    if (inlineProvider) inlineProvider.textContent = emailProviderSignIn();

    const scanSub = document.getElementById('email-scan-sub');
    if (scanSub) scanSub.textContent = `Searching the last 12 months of ${emailProviderName()}`;

    const providerLabel = document.getElementById('candidate-provider-label');
    if (providerLabel) providerLabel.textContent = emailProviderName();

    renderEmailConnection();
}

function startEmailScan(origin) {
    emailScanOrigin = origin || (emailConnection === 'connected' ? 'connected' : 'consent');
    clearEmailScanTimers();
    navigateTo('screen-email-scanning');

    const steps = Array.from(document.querySelectorAll('.email-scan-step'));
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === 0);
        step.classList.remove('done');
    });

    const fill = document.querySelector('.email-scan-fill');
    if (fill) {
        fill.style.animation = 'none';
        void fill.offsetWidth;
        fill.style.animation = '';
    }

    emailScanTimers.push(setTimeout(() => setEmailScanStep(1), 750));
    emailScanTimers.push(setTimeout(() => setEmailScanStep(2), 1500));
    emailScanTimers.push(setTimeout(finishEmailScan, 2400));
}

function setEmailScanStep(index) {
    document.querySelectorAll('.email-scan-step').forEach((step, stepIndex) => {
        step.classList.toggle('active', stepIndex === index);
        step.classList.toggle('done', stepIndex < index);
    });
}

function finishEmailScan() {
    emailScanTimers = [];
    emailConnection = 'connected';
    emailLastScanLabel = 'Just now';
    renderEmailExperience();
    navigateTo('screen-email-candidates');
}

function cancelEmailScan() {
    clearEmailScanTimers();
    if (emailConnection === 'connected' || emailScanOrigin === 'connected') {
        navigateTo('screen-email-connected');
    } else {
        navigateTo('screen-email-consent');
    }
}

function clearEmailScanTimers() {
    emailScanTimers.forEach(timer => clearTimeout(timer));
    emailScanTimers = [];
}

function renderMyBillsEmailCard() {
    const card = document.getElementById('my-bills-email-card');
    if (!card) return;

    const icon = document.getElementById('my-bills-email-icon');
    const title = document.getElementById('my-bills-email-title');
    const copy = document.getElementById('my-bills-email-copy');
    const action = document.getElementById('my-bills-email-action');
    const dismiss = document.getElementById('my-bills-email-dismiss');
    const connected = emailConnection === 'connected';

    if (!connected && emailStatusDismissed) {
        card.hidden = true;
        return;
    }

    card.hidden = false;
    card.classList.toggle('connected', connected);

    if (connected) {
        const added = emailAddedCount();
        const total = EMAIL_CANDIDATES.length;
        const remaining = total - added;

        icon.textContent = '📬';
        title.textContent = 'Email connected';
        copy.textContent = added
            ? `${added} of ${total} bills found in your inbox added to My Bills.`
            : `${total} bills found in your inbox, ready to review.`;
        action.textContent = remaining
            ? `Review ${remaining} found bill${remaining > 1 ? 's' : ''} →`
            : 'Manage email connection →';
        action.onclick = function() {
            navigateTo(remaining ? 'screen-email-candidates' : 'screen-email-connected');
        };
        if (dismiss) dismiss.hidden = true;
    } else {
        icon.textContent = '📧';
        title.textContent = 'Bills hiding in your inbox?';
        copy.textContent = 'Paytm can find bill emails and add the details for you, after you approve them.';
        action.textContent = 'Find my bills →';
        action.onclick = openEmailConsent;
        if (dismiss) dismiss.hidden = false;
    }
}

function renderEmailConnection() {
    const isGmail = emailProvider === 'gmail';
    const mark = document.getElementById('email-account-mark');
    const address = document.getElementById('email-account-address');

    if (mark) {
        mark.textContent = isGmail ? 'G' : 'O';
        mark.classList.toggle('gmail', isGmail);
        mark.classList.toggle('outlook', !isGmail);
    }
    if (address) {
        address.textContent = isGmail ? 's•••••@gmail.com' : 's•••••@outlook.com';
    }

    const lastScan = document.getElementById('email-last-scan');
    if (lastScan) lastScan.textContent = emailLastScanLabel;

    const found = document.getElementById('email-found-count');
    if (found) found.textContent = String(EMAIL_CANDIDATES.length);

    const added = document.getElementById('email-added-count');
    if (added) added.textContent = String(emailAddedCount());
}

function candidateItemHTML(candidate) {
    return `<label class="candidate-item${candidate.added ? ' added' : ''}" data-candidate-id="${candidate.id}">
        <span class="candidate-checkbox">
            <input type="checkbox" ${candidate.checked && !candidate.added ? 'checked' : ''} ${candidate.added ? 'disabled' : ''} onchange="updateCandidateSelection()">
            <span class="checkmark"></span>
        </span>
        <span class="candidate-info">
            <span class="candidate-header">
                <span class="candidate-biller"><span class="candidate-icon">${candidate.icon}</span>${candidate.biller}</span>
                <span class="candidate-kind">${candidate.kind}</span>
            </span>
            <span class="candidate-subject">${candidate.subject}</span>
            <span class="candidate-details">
                <span class="candidate-amount">${formatINR(candidate.amount)}</span>
                <span class="candidate-due">Due ${candidate.due}</span>
                ${candidate.added ? '<span class="candidate-added-badge">Added</span>' : ''}
            </span>
            <span class="candidate-sender">${candidate.sender} · ${candidate.received}</span>
        </span>
    </label>`;
}

function renderCandidates() {
    const list = document.getElementById('candidate-list');
    if (!list) return;

    list.innerHTML = EMAIL_CANDIDATES.map(candidateItemHTML).join('');

    const active = EMAIL_CANDIDATES.filter(candidate => !candidate.added);
    const added = emailAddedCount();
    const title = document.getElementById('candidate-banner-title');
    const copy = document.getElementById('candidate-banner-copy');
    const toolbar = document.getElementById('candidate-toolbar');
    const actions = document.getElementById('candidate-actions');
    const empty = document.getElementById('candidate-empty');

    if (active.length) {
        title.textContent = `${active.length} bill${active.length > 1 ? 's' : ''} found`;
        copy.textContent = 'Nothing is added yet. Uncheck anything that isn\'t yours.';
    } else {
        title.textContent = added
            ? `${added} bill${added > 1 ? 's' : ''} reviewed`
            : 'No bills found';
        copy.textContent = 'No new bills to review. New bill emails will appear after the next scan.';
    }

    if (toolbar) toolbar.hidden = active.length === 0;
    if (actions) actions.hidden = active.length === 0;
    if (empty) empty.hidden = active.length !== 0;
    if (list) list.hidden = active.length === 0;

    updateCandidateSelection();
}

function updateCandidateSelection() {
    document.querySelectorAll('#candidate-list .candidate-item').forEach(item => {
        const candidate = EMAIL_CANDIDATES.find(entry => entry.id === item.dataset.candidateId);
        const input = item.querySelector('input');
        if (candidate && input && !candidate.added) {
            candidate.checked = input.checked;
        }
    });

    const selectable = EMAIL_CANDIDATES.filter(candidate => !candidate.added);
    const selected = selectable.filter(candidate => candidate.checked);
    const total = selected.reduce((sum, candidate) => sum + candidate.amount, 0);
    const button = document.getElementById('add-candidates-btn');

    if (button) {
        button.disabled = selected.length === 0;
        button.textContent = selected.length
            ? `Add ${selected.length} bill${selected.length > 1 ? 's' : ''} · ${formatINR(total)}`
            : 'Select a bill to add';
    }

    const selectAll = document.getElementById('select-all-candidates');
    if (selectAll) {
        selectAll.checked = selectable.length > 0 && selected.length === selectable.length;
        selectAll.indeterminate = selected.length > 0 && selected.length < selectable.length;
        selectAll.disabled = selectable.length === 0;
    }
}

function toggleAllCandidates(checked) {
    EMAIL_CANDIDATES.forEach(candidate => {
        if (!candidate.added) candidate.checked = checked;
    });
    renderCandidates();
}

function addSelectedCandidates() {
    const selected = EMAIL_CANDIDATES.filter(candidate => !candidate.added && candidate.checked);
    if (!selected.length) return;

    selected.forEach(candidate => {
        candidate.added = true;
    });

    emailLastScanLabel = 'Just now';
    renderEmailExperience();
    navigateTo('screen-my-bills');
    showAppToast(`${selected.length} bill${selected.length > 1 ? 's' : ''} added to My Bills`);
}

function disconnectEmail() {
    showAppConfirm({
        title: 'Disconnect email?',
        message: 'Future scans stop immediately. Bills already in My Bills stay, and you can reconnect anytime.',
        confirmLabel: 'Disconnect email',
        onConfirm: function() {
            emailConnection = 'disconnected';
            emailLastScanLabel = 'Not scanned yet';
            emailStatusDismissed = false;
            renderEmailExperience();
            navigateTo('screen-email-disconnected');
        }
    });
}

function dismissAddBillInvite() {
    emailInviteDismissed = true;
    renderEmailExperience();
}

function dismissMyBillsEmailCard() {
    emailStatusDismissed = true;
    renderEmailExperience();
}

function renderEmailExperience() {
    const connected = emailConnection === 'connected';
    const invite = document.getElementById('add-bill-email-invite');
    const compact = document.getElementById('email-invite-compact');

    if (invite) invite.hidden = connected || emailInviteDismissed;
    if (compact) compact.hidden = connected || !emailInviteDismissed;

    renderMyBillsEmailCard();
    renderEmailConnection();
    renderCandidates();
}

function showAppToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(appToastTimer);
    appToastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3200);
}

function confirmMarkPaid() {
    closeMarkPaidModal();

    // Show toast
    const toast = document.getElementById('undo-toast');
    toast.classList.remove('hidden');

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

function undoMarkPaid() {
    const toast = document.getElementById('undo-toast');
    toast.classList.add('hidden');

    // In a real app, this would revert the bill status
    console.log('Undo mark paid');
}

// ============================================================
// Bills calendar
// A month grid with due/estimated/paid marks and a selected-day
// bill list underneath.
// ============================================================
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const PAPER_CALENDARS = {
    'screen-calendar': {
        monthIndex: 10,
        year: 2026,
        today: 15,
        selected: 18,
        filter: 'all',
        bills: {
            18: [{ key: 'electricity', name: 'Electricity', account: 'XXXX1234', amount: 1840, state: 'due', tag: '₹1.8k', note: 'Confirmed with biller · pay from UPI' }],
            21: [{ key: 'credit-card', name: 'Credit Card', account: 'XXXX5678', amount: 6250, state: 'unverified', tag: '₹6.3k', note: 'Marked paid on the HDFC app · not confirmed yet' }],
            20: [{ key: 'broadband', name: 'Broadband', account: 'XXXX9012', amount: 999, state: 'due', tag: '₹1k', note: 'Auto-pay is on · don’t pay twice' }]
        },
        marks: { 1: ['payday'], 18: ['starred'] }
    },
    'screen-personal-calendar': {
        monthIndex: 10,
        year: 2026,
        today: 15,
        selected: 18,
        filter: 'all',
        bills: {
            10: [{ key: 'water', name: 'Water', account: 'XXXX3456', amount: 450, state: 'paid', tag: '₹450', note: 'Paid from Paytm Wallet · verified' }],
            18: [{ key: 'electricity', name: 'Electricity', account: 'XXXX1234', amount: 1840, state: 'due', tag: '₹1.8k', note: 'Confirmed with biller · pay from UPI' }],
            20: [{ key: 'broadband', name: 'Broadband', account: 'XXXX9012', amount: 999, state: 'due', tag: '₹1k', note: 'Auto-pay is on · don’t pay twice' }],
            22: [{ key: 'gas', name: 'Gas', account: 'XXXX9012', amount: 850, state: 'estimated', tag: '₹850', note: 'Estimate from last month · meter reading pending' }]
        },
        marks: { 18: ['starred'] }
    },
    'screen-flatmates-calendar': {
        monthIndex: 10,
        year: 2026,
        today: 15,
        selected: 19,
        filter: 'all',
        bills: {
            1: [{ key: 'rent', name: 'Rent (Nov)', account: 'Apartment 4B', amount: 25000, state: 'paid', tag: '₹25k', note: 'Paid from the joint account · verified' }],
            19: [{ key: 'shared-broadband', name: 'Shared Broadband', account: 'XXXX7890', amount: 2499, state: 'due', tag: '₹2.5k', note: 'Split 3 ways · confirmed with biller' }],
            25: [{ key: 'netflix', name: 'Netflix (Shared)', account: 'Family Plan', amount: 649, state: 'estimated', tag: '₹650', note: '₹216 each · renews on the 25th' }]
        },
        marks: { 19: ['starred'] }
    }
};

function billIsCrossed(bill) {
    return bill.state === 'paid' || bill.state === 'unverified';
}

function formatINR(value) {
    return '₹' + value.toLocaleString('en-IN');
}

function dayBills(cal, day) {
    return cal.bills[day] || [];
}

function allCalendarBills(cal) {
    return Object.keys(cal.bills).reduce((all, day) => all.concat(cal.bills[day]), []);
}

function calendarBillNote(bill) {
    if (bill.state === 'paid' && bill.baseState !== 'paid') {
        return 'Paid just now · tap the check to undo';
    }
    if (bill.state === 'due' && bill.baseState === 'unverified') {
        return 'Marked unpaid again · tap the check to redo';
    }
    if (bill.state === 'due' && bill.baseState === 'paid') {
        return 'Marked unpaid again · tap the check to redo';
    }
    return bill.note;
}

function calendarBillStateLabel(bill) {
    if (bill.state === 'paid') return 'Paid';
    if (bill.state === 'unverified') return 'Marked paid';
    if (bill.state === 'estimated') return 'Estimated';
    return 'Due';
}

function dayAriaLabel(cal, day, bills) {
    const month = MONTH_NAMES[cal.monthIndex];
    let label = `${day} ${month}`;

    if (day === cal.today) {
        label += ', today';
    }
    if (!bills.length) {
        return label + ', no bills';
    }

    const described = bills.map(bill => {
        const state = bill.state === 'unverified' ? 'marked paid, unconfirmed' : bill.state;
        return `${bill.name}, ${bill.amount} rupees, ${state}`;
    });

    if ((cal.marks[day] || []).includes('starred')) {
        described.push('important');
    }
    return `${label}, ${described.join('; ')}`;
}

function renderPaperGrid(screenId) {
    const cal = PAPER_CALENDARS[screenId];
    const grid = document.querySelector(`[data-calendar-grid="${screenId}"]`);
    if (!cal || !grid) return;

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const firstWeekday = new Date(cal.year, cal.monthIndex, 1).getDay();
    const daysInMonth = new Date(cal.year, cal.monthIndex + 1, 0).getDate();

    let html = weekdays.map(day => `<div class="calendar-day-header" role="columnheader">${day}</div>`).join('');

    for (let i = 0; i < firstWeekday; i += 1) {
        html += '<div class="calendar-day empty" role="gridcell" aria-hidden="true"></div>';
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const bills = dayBills(cal, day);
        const states = bills.map(bill => bill.state);
        const marks = cal.marks[day] || [];
        const crossed = bills.length > 0 && bills.every(billIsCrossed);
        const hasUnverified = states.includes('unverified');
        const classes = ['calendar-day'];

        if (day === cal.today) classes.push('today');
        if (day === cal.selected) classes.push('selected');
        if ((day + firstWeekday - 1) % 7 === 0) classes.push('sunday');
        if (bills.length) classes.push('has-bill');
        if (states.includes('due')) classes.push('is-due');
        if (states.includes('estimated')) classes.push('is-estimated');
        if (states.includes('paid')) classes.push('is-paid');
        if (hasUnverified) classes.push('is-unverified');
        if (crossed) classes.push('crossed');
        if (hasUnverified) classes.push('unverified');
        marks.forEach(mark => classes.push(mark));

        const star = marks.includes('starred') ? '<span class="day-star" aria-hidden="true"></span>' : '';
        const tags = bills.map(bill => `<span class="day-tag ${bill.state}" title="${bill.name} · ${bill.tag}">${bill.tag}</span>`).join('');
        const paydayTag = marks.includes('payday') ? '<span class="day-tag payday">salary</span>' : '';

        html += `<div class="${classes.join(' ')}" data-day="${day}" role="gridcell" tabindex="0" aria-label="${dayAriaLabel(cal, day, bills)}" onclick="selectCalendarDay('${screenId}', ${day})">
            <span class="day-number">${day}</span>${star}${tags}${paydayTag}
        </div>`;
    }

    const totalCells = firstWeekday + daysInMonth;
    const trailingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < trailingCells; i += 1) {
        html += '<div class="calendar-day empty" role="gridcell" aria-hidden="true"></div>';
    }

    grid.innerHTML = html;
}

function nextBillDay(cal, fromDay) {
    const days = Object.keys(cal.bills)
        .map(Number)
        .filter(day => cal.bills[day].length)
        .sort((a, b) => a - b);

    if (!days.length) return null;

    const day = days.find(candidate => candidate > fromDay) || days[0];
    return { day, bill: cal.bills[day][0] };
}

function matchesCalendarFilter(bill, filter) {
    if (filter === 'attention') {
        return bill.state === 'due' || bill.state === 'estimated' || bill.state === 'unverified';
    }
    if (filter === 'paid') return bill.state === 'paid';
    return true;
}

function agendaItemHTML(screenId, day, bill) {
    const cal = PAPER_CALENDARS[screenId];
    const crossed = billIsCrossed(bill);
    const note = calendarBillNote(bill);
    const month = MONTH_NAMES[cal.monthIndex].slice(0, 3);
    const stateLabel = calendarBillStateLabel(bill);

    return `<div class="agenda-item${crossed ? ' completed' : ''}${bill.potential ? ' potential' : ''}" data-screen="${screenId}" data-day="${day}" data-key="${bill.key}" data-state="${bill.state}">
        <div class="agenda-info">
            <h4 class="${crossed ? 'strike-through' : ''}">${bill.name}</h4>
            <span class="agenda-account">${bill.account} · ${stateLabel} ${day} ${month}</span>
            ${note ? `<span class="agenda-note">${note}</span>` : ''}
        </div>
        <div class="agenda-amount${crossed ? ' strike-through' : ''}">${formatINR(bill.amount)}</div>
        <button class="check-btn${crossed ? ' checked' : ''}" type="button" onclick="toggleComplete(this)" aria-pressed="${crossed}" aria-label="${crossed ? 'Mark unpaid' : 'Mark paid'} ${bill.name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${crossed ? '<path d="m5 12.5 4.5 4.5L19 7.5"/>' : ''}</svg></button>
    </div>`;
}

function renderAgenda(screenId) {
    const cal = PAPER_CALENDARS[screenId];
    const agenda = document.querySelector(`[data-agenda="${screenId}"]`);
    if (!cal || !agenda) return;

    const day = cal.selected;
    const bills = dayBills(cal, day);
    const visibleBills = bills.filter(bill => matchesCalendarFilter(bill, cal.filter));
    const weekday = new Date(cal.year, cal.monthIndex, day).toLocaleDateString('en-IN', { weekday: 'long' });
    const month = MONTH_NAMES[cal.monthIndex];

    let html = `<div class="agenda-head">
        <div>
            <h3>${day} ${month}</h3>
            <p class="agenda-sub">${weekday}${bills.length ? ` · ${bills.length} bill${bills.length > 1 ? 's' : ''}` : ' · no bills'}</p>
        </div>
        ${day === cal.today ? '<span class="agenda-today-pin">today</span>' : ''}
    </div>`;

    if (!bills.length) {
        html += '<p class="agenda-empty">No bills on this date.</p>';
        const next = nextBillDay(cal, day);
        if (next) {
            html += `<p class="agenda-set-date">Next: <button type="button" class="agenda-link" onclick="selectCalendarDay('${screenId}', ${next.day})">${next.bill.name} · ${formatINR(next.bill.amount)} · ${next.day} ${month}</button></p>`;
        }
    } else if (!visibleBills.length) {
        const filterName = cal.filter === 'paid' ? 'Paid' : 'Needs attention';
        html += `<p class="agenda-empty">No bills match the “${filterName}” filter.</p>`;
        html += `<p class="agenda-set-date"><button type="button" class="agenda-link" onclick="applyCalendarFilter('${screenId}', 'all')">Show all bills</button></p>`;
    } else {
        visibleBills.forEach(bill => {
            html += agendaItemHTML(screenId, day, bill);
        });
    }

    agenda.innerHTML = html;
}

function updatePaperSummary(screenId) {
    const cal = PAPER_CALENDARS[screenId];
    if (!cal) return;

    const bills = allCalendarBills(cal);
    const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const crossedBills = bills.filter(billIsCrossed);
    const crossed = crossedBills.reduce((sum, bill) => sum + bill.amount, 0);

    const left = document.querySelector(`[data-summary-left="${screenId}"]`);
    if (left) left.textContent = formatINR(total - crossed);

    const progress = document.querySelector(`[data-paper-progress="${screenId}"]`);
    if (progress) {
        progress.textContent = `${crossedBills.length} of ${bills.length} paid`;
    }
}

function selectCalendarDay(screenId, day) {
    const cal = PAPER_CALENDARS[screenId];
    if (!cal) return;

    cal.selected = day;

    document.querySelectorAll(`[data-calendar-grid="${screenId}"] .calendar-day.selected`).forEach(cell => {
        cell.classList.remove('selected');
    });

    const selectedCell = document.querySelector(`[data-calendar-grid="${screenId}"] [data-day="${day}"]`);
    if (selectedCell) selectedCell.classList.add('selected');

    renderAgenda(screenId);
}

function applyCalendarFilter(screenId, filter) {
    const cal = PAPER_CALENDARS[screenId];
    const screen = document.getElementById(screenId);
    if (!cal) return;

    cal.filter = filter;

    if (screen) {
        ['all', 'attention', 'paid'].forEach(name => {
            screen.classList.toggle(`filter-${name}`, name === filter);
        });
        screen.querySelectorAll('.calendar-filters .filter-btn').forEach(button => {
            button.classList.toggle('active', button.dataset.filter === filter);
        });
    }

    renderAgenda(screenId);
}

function toggleComplete(button) {
    const item = button.closest('.agenda-item');
    if (!item) return;

    const screenId = item.dataset.screen;
    const day = Number(item.dataset.day);
    const key = item.dataset.key;
    const cal = PAPER_CALENDARS[screenId];
    const bill = (cal && cal.bills[day] || []).find(candidate => candidate.key === key);
    if (!bill) return;

    // Toggle paid / unpaid while keeping the updated state visible.
    if (billIsCrossed(bill)) {
        bill.state = 'due';
    } else {
        bill.state = bill.baseState === 'unverified' ? 'unverified' : 'paid';
    }

    renderPaperGrid(screenId);
    renderAgenda(screenId);
    updatePaperSummary(screenId);
}

function shiftCalendarMonth(cal, delta) {
    const target = new Date(cal.year, cal.monthIndex + delta, 1);
    return { monthIndex: target.getMonth(), year: target.getFullYear() };
}

function buildMonthBills(cal, monthIndex, year) {
    const sourceDays = Object.keys(cal.bills)
        .map(Number)
        .filter(day => cal.bills[day] && cal.bills[day].length)
        .sort((a, b) => a - b);

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const result = {};

    sourceDays.forEach(sourceDay => {
        const targetDay = Math.min(sourceDay, daysInMonth);
        cal.bills[sourceDay].forEach(bill => {
            const nextState = bill.state === 'paid' ? 'due' : (bill.state === 'estimated' ? 'estimated' : 'due');
            const potential = bill.state === 'estimated';
            result[targetDay] = result[targetDay] || [];
            result[targetDay].push({
                key: bill.key,
                name: bill.name,
                account: bill.account,
                amount: bill.amount,
                state: nextState,
                baseState: nextState,
                potential,
                generated: true,
                tag: bill.tag,
                note: bill.note
            });
        });
    });

    return result;
}

function navigateCalendarMonth(screenId, direction) {
    const cal = PAPER_CALENDARS[screenId];
    if (!cal) return;

    const history = cal.monthHistory || (cal.monthHistory = []);

    if (direction > 0) {
        // Remember the current month only when moving forward, so Back
        // restores exactly one month instead of pushing a duplicate entry.
        history.push({
            monthKey: `${cal.year}-${cal.monthIndex}`,
            bills: JSON.parse(JSON.stringify(cal.bills || {})),
            marks: Object.assign({}, cal.marks || {}),
            selected: cal.selected,
            filter: cal.filter
        });
    } else {
        const previous = history.pop();
        if (!previous) return;
        cal.bills = previous.bills;
        cal.marks = previous.marks || {};
        cal.selected = previous.selected;
        cal.filter = previous.filter;
    }

    const target = new Date(cal.year, cal.monthIndex + direction, 1);
    const targetMonthIndex = target.getMonth();
    const targetYear = target.getFullYear();

    if (direction > 0) {
        cal.bills = buildMonthBills(cal, targetMonthIndex, targetYear);
    }

    cal.monthIndex = targetMonthIndex;
    cal.year = targetYear;

    const daysInMonth = new Date(cal.year, cal.monthIndex + 1, 0).getDate();
    const billDays = Object.keys(cal.bills)
        .map(Number)
        .filter(day => cal.bills[day] && cal.bills[day].length)
        .sort((a, b) => a - b);
    if (cal.selected > daysInMonth) {
        cal.selected = billDays[0] || cal.today;
    }

    renderPaperCalendars();

    const sheet = document.querySelector(`#${screenId} .paper-sheet`);
    if (sheet) {
        sheet.classList.add('calendar-sheet-anim');
        void sheet.offsetWidth;
        sheet.classList.remove('calendar-sheet-anim');
    }

    const heading = document.querySelector(`#${screenId} .paper-month`);
    const headingTitle = heading ? (heading.tagName === 'H2' ? heading : heading.querySelector('h2')) : null;
    const headingYear = heading ? heading.querySelector('.paper-year') : null;
    if (headingTitle) headingTitle.firstChild.nodeValue = MONTH_NAMES[cal.monthIndex] + ' ';
    if (headingYear) headingYear.textContent = String(cal.year);
}

function renderPaperCalendars() {
    Object.keys(PAPER_CALENDARS).forEach(screenId => {
        const cal = PAPER_CALENDARS[screenId];
        allCalendarBills(cal).forEach(bill => {
            bill.baseState = bill.baseState || bill.state;
        });
        renderPaperGrid(screenId);
        updatePaperSummary(screenId);
        applyCalendarFilter(screenId, cal.filter);
    });
}

// Month navigation (prev / next) on the paper calendars
document.addEventListener('click', function(event) {
    const button = event.target.closest('.month-nav button');
    if (!button) return;

    const screen = button.closest('.screen');
    if (!screen || !screen.id) return;

    const direction = button.getAttribute('aria-label') === 'Previous month' ? -1 : 1;
    navigateCalendarMonth(screen.id, direction);
});

// Filter clicks (event delegation keeps working after the agenda re-renders)
document.addEventListener('click', function(event) {
    const button = event.target.closest('.calendar-screen .filter-btn');
    if (!button) return;

    const screen = button.closest('.screen');
    if (screen) applyCalendarFilter(screen.id, button.dataset.filter);
});

// Keyboard access for calendar dates
document.addEventListener('keydown', function(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const cell = event.target.closest('.paper-grid .calendar-day[data-day]');
    if (!cell) return;

    event.preventDefault();
    const grid = cell.closest('[data-calendar-grid]');
    selectCalendarDay(grid.dataset.calendarGrid, Number(cell.dataset.day));
});

// Category item selection
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function() {
        const name = this.textContent.trim();
        console.log('Selected category:', name);
        const searchInput = document.getElementById('biller-search-input');
        if (searchInput) searchInput.value = name;
        // Keep dummy values in frontend; flow continues to verification
        navigateTo('screen-verification');
    });
});

// Add bill option selection
document.querySelectorAll('.add-bill-option').forEach(option => {
    option.addEventListener('click', function() {
        // Navigation is handled by onclick in HTML
        console.log('Selected add bill option');
    });
});

// Camera capture button
document.querySelector('.camera-btn')?.addEventListener('click', function() {
    // Simulate capture and navigate to OCR review
    setTimeout(() => {
        navigateTo('screen-ocr-review');
    }, 500);
});

// File upload
(function setupUpload() {
    const area = document.getElementById('upload-area');
    const input = document.getElementById('upload-file-input');
    const chooseBtn = document.getElementById('choose-file-btn');
    function openPicker(e) {
        if (e) e.stopPropagation();
        if (input) input.click();
    }
    if (area) area.addEventListener('click', openPicker);
    if (chooseBtn) chooseBtn.addEventListener('click', openPicker);
    if (input) {
        input.addEventListener('change', function() {
            const file = this.files && this.files[0];
            if (!file) return;
            console.log('Selected file:', file.name);
            const hint = area ? area.querySelector('p') : null;
            if (hint) hint.textContent = file.name;
            // Simulate OCR processing then review
            setTimeout(() => navigateTo('screen-ocr-loading'), 300);
            setTimeout(() => navigateTo('screen-ocr-review'), 1800);
        });
    }
})();

// Form field editing
document.querySelectorAll('.form-field input.editable').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '#00baf2';
    });

    input.addEventListener('blur', function() {
        this.style.borderColor = '#e0e0e0';
    });
});

// Payment method selection
document.querySelectorAll('.payment-method input').forEach(radio => {
    radio.addEventListener('change', function() {
        console.log('Selected payment method:', this.value);
    });
});

// Toggle switches
document.querySelectorAll('.toggle input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        console.log('Toggle changed:', this.checked);
    });
});

// Close modal when clicking outside
document.getElementById('mark-paid-modal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeMarkPaidModal();
    }
});

document.getElementById('add-home-modal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeAddHomeModal();
    }
});

document.getElementById('home-selector-sheet')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeHomeSelector();
    }
});

document.getElementById('all-bills-sheet')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeAllBillsSheet();
    }
});

// Initialize
// ---------------------------------------------------------------------------
// Icon system: every emoji icon is swapped for the global icon treatment -
// a navy (#0b4a9e) outline SVG with no solid chip.
// ---------------------------------------------------------------------------
const LEGACY_VECTOR_ICONS = {
    '🏠': { label: 'Home', paths: '<path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-4.5h4V20"/>' },
    '👥': { label: 'People', paths: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M17 14.5a5 5 0 0 1 3.5 4.5"/>' },
    '🫂': { label: 'Shared home', paths: '<circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><path d="M3.5 19a4.5 4.5 0 0 1 9 0"/><path d="M11.5 19a4.5 4.5 0 0 1 9 0"/>' },
    '⚡': { label: 'Electricity', paths: '<path d="M13 2.6 4.9 13.1h5.3L10.3 21.4 18.9 9.9h-5.4L13 2.6Z"/>' },
    '💳': { label: 'Card', paths: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M7 14.5h3"/>' },
    '🌐': { label: 'Internet', paths: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"/>' },
    '🛡️': { label: 'Protected', paths: '<path d="M12 3.5 19 6v5.5c0 4.4-2.9 7.6-7 9-4.1-1.4-7-4.6-7-9V6l7-2.5Z"/><path d="m9 12 2.2 2.2L15.5 10"/>' },
    '💧': { label: 'Water', paths: '<path d="M12 3.5s6 6.2 6 10.2a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5Z"/>' },
    '📺': { label: 'TV', paths: '<rect x="3.5" y="6.5" width="17" height="11.5" rx="2"/><path d="m8 3.5 4 3 4-3"/>' },
    '🔥': { label: 'Gas', paths: '<path d="M12 3.5c3 3.4 5.5 6.2 5.5 9.5a5.5 5.5 0 0 1-11 0c0-1.6.8-3 1.9-4.4.5 1.2 1.3 2 2.4 2.4-.5-2.7-.1-5 1.2-7.5Z"/>' },
    '📱': { label: 'Mobile', paths: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>' },
    '📡': { label: 'DTH', paths: '<rect x="3.5" y="6.5" width="17" height="11.5" rx="2"/><path d="m8 3.5 4 3 4-3"/><path d="M7.5 14.5h2M14.5 14.5h2"/>' },
    '🏦': { label: 'Bank', paths: '<path d="M3.5 9.5 12 4l8.5 5.5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3.5 20.5h17"/>' },
    '🚗': { label: 'Vehicle', paths: '<path d="M4 16.5v2.2a.8.8 0 0 1-.8.8H3a.8.8 0 0 1-.8-.8v-4l2-5.2a1.5 1.5 0 0 1 1.4-1h12.8a1.5 1.5 0 0 1 1.4 1l2 5.2v4a.8.8 0 0 1-.8.8h-.2a.8.8 0 0 1-.8-.8v-2.2"/><path d="M2.7 12.5h18.6"/><circle cx="7" cy="16" r="1.4"/><circle cx="17" cy="16" r="1.4"/>' },
    '🏛️': { label: 'Government', paths: '<path d="M3 9.5 12 4l9 5.5"/><path d="M5 10.5v8M10 10.5v8M14 10.5v8M19 10.5v8"/><path d="M3 20.5h18"/>' },
    '📷': { label: 'Camera', paths: '<path d="M4 8.5h3l1.5-2h7L17 8.5h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z"/><circle cx="12" cy="13.5" r="3.2"/>' },
    '📁': { label: 'Files', paths: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5v-11Z"/>' },
    '🔍': { label: 'Search', paths: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>' },
    '🔎': { label: 'Search', paths: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="m8 10.5 1.8 1.8 3.2-3.2"/>' },
    '📧': { label: 'Email', paths: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.8 7 8.2 6 8.2-6"/>' },
    '📬': { label: 'Inbox', paths: '<rect x="3" y="8.5" width="18" height="11" rx="2"/><path d="m3.8 10 8.2 6 8.2-6"/><path d="M12 2.5v4.5"/><path d="m9.8 4.7 2.2-2.2 2.2 2.2"/>' },
    '📭': { label: 'No messages', paths: '<rect x="3" y="6.5" width="18" height="13" rx="2"/><path d="m3.8 8 8.2 6 8.2-6"/>' },
    '📄': { label: 'Bill document', paths: '<path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V3.5Z"/><path d="M14 3.5V8h4"/><path d="M9 12h6M9 16h6"/>' },
    '📊': { label: 'Chart', paths: '<path d="M4 4v16h16"/><path d="M8 16v-4M12.5 16V9M17 16v-6.5"/>' },
    '⚖️': { label: 'Compare', paths: '<path d="M12 3.5v17"/><path d="M5 6.5h14"/><path d="M8 6.5 5 13h6L8 6.5Z"/><path d="M16 6.5 13 13h6l-3-6.5Z"/><path d="M8.5 20.5h7"/>' },
    '📈': { label: 'Trend', paths: '<path d="M3.5 17.5 9 12l3.5 3.5 8-8"/><path d="M15 7.5h5.5V13"/>' },
    '🧾': { label: 'Receipt', paths: '<path d="M6 3.5h12v17l-2.4-1.6-2.4 1.6-2.4-1.6-2.4 1.6L6 20.5v-17Z"/><path d="M9 8h6M9 11.5h6M9 15h4"/>' },
    '⚠️': { label: 'Warning', paths: '<path d="M12 4 21 20H3L12 4Z"/><path d="M12 10v4"/><path d="M12 17.2v.2"/>' },
    '📶': { label: 'Signal', paths: '<path d="M5 19v-3M9.5 19v-6M14 19v-9M18.5 19V7"/>' },
    '✅': { label: 'Verified', paths: '<circle cx="12" cy="12" r="8.5"/><path d="m8 12.2 2.6 2.6L16.2 9"/>' },
    '🔔': { label: 'Notifications', paths: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15L6 16.5Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>' },
    '🎁': { label: 'Voucher', paths: '<path d="M4 10.5h16V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z"/><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v3H3v-3Z"/><path d="M12 6v14.5"/><path d="M12 6S10.6 2.5 8.3 2.5a1.75 1.75 0 1 0 0 3.5H12Z"/><path d="M12 6s1.4-3.5 3.7-3.5a1.75 1.75 0 1 1 0 3.5H12Z"/>' },
    '⌨️': { label: 'Typing', paths: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6.5 9.5h.5M10 9.5h.5M13.5 9.5h.5M17 9.5h.5M6.5 12.5h.5M10 12.5h.5M13.5 12.5h.5M17 12.5h.5"/><path d="M8 15.5h8"/>' },
    '⌨': { label: 'Typing', paths: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6.5 9.5h.5M10 9.5h.5M13.5 9.5h.5M17 9.5h.5M6.5 12.5h.5M10 12.5h.5M13.5 12.5h.5M17 12.5h.5"/><path d="M8 15.5h8"/>' },
    '⏳': { label: 'Waiting', paths: '<path d="M7 3.5h10M7 20.5h10"/><path d="M8.5 3.5c0 4 7 4.5 7 8.5s-7 4.5-7 8.5"/><path d="M15.5 3.5c0 4-7 4.5-7 8.5s7 4.5 7 8.5"/>' },
    '⏰': { label: 'Reminder', paths: '<circle cx="12" cy="13.5" r="6.5"/><path d="M12 10v3.5l2.5 1.5"/><path d="m4.5 5 2.5 2.5M19.5 5 17 7.5"/><path d="m4 20 2.5-2.5M20 20l-2.5-2.5"/>' }
};
const LEGACY_ICON_REGEX = new RegExp('(' + Object.keys(LEGACY_VECTOR_ICONS).join('|') + ')', 'g');

function legacyIconSvg(key) {
    const icon = LEGACY_VECTOR_ICONS[key];
    return `<span class="vec-icon" role="img" aria-label="${icon.label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icon.paths}</svg></span>`;
}

function vectorizeLegacyTextNode(node) {
    if (!node || !node.nodeValue || !LEGACY_ICON_REGEX.test(node.nodeValue)) return;
    LEGACY_ICON_REGEX.lastIndex = 0;
    const parent = node.parentElement;
    if (!parent || parent.closest('script, style, .vec-icon, textarea, [data-vec-skip]')) return;

    const parts = node.nodeValue.split(LEGACY_ICON_REGEX);
    const template = document.createElement('template');
    let html = '';
    parts.forEach((part, index) => {
        if (!part) return;
        if (Object.prototype.hasOwnProperty.call(LEGACY_VECTOR_ICONS, part)) {
            html += legacyIconSvg(part);
        } else {
            html += part.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
        }
    });
    template.innerHTML = html;
    node.replaceWith(template.content);
}

function vectorizeLegacyIcons(root) {
    const scope = root || document.getElementById('app');
    if (!scope) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(vectorizeLegacyTextNode);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => vectorizeLegacyIcons());
} else {
    vectorizeLegacyIcons();
}

const legacyIconObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'characterData') {
            vectorizeLegacyTextNode(mutation.target);
            return;
        }
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                vectorizeLegacyTextNode(node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('vec-icon')) {
                vectorizeLegacyIcons(node);
            }
        });
    });
});
const legacyIconRoot = document.getElementById('app');
if (legacyIconRoot) {
    legacyIconObserver.observe(legacyIconRoot, { childList: true, characterData: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', function() {
    renderLandingOverview();
    renderPaperCalendars();
    renderEmailExperience();
    updateHomePendingInvite();
    updateHomeInviteBadge();
    updateHomeReward();
    renderHomeRewards();
    renderRewardChooser();

    console.log('Paytm My Bills Prototype loaded');
    console.log('This is a prototype for demonstration purposes only');
    console.log('No real payments, data storage, or integrations are connected');
});

// ---------------------------------------------------------------------------
// Accessibility hardening: keyboard-operable cards, tab state, dialogs, focus
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
let dialogReturnFocus = null;
let activeDialog = null;
let confirmAction = null;

function syncTabStates() {
    const groups = [
        ['.tab-toggle', 'Bill view'],
        ['.card-toggle', 'Bill view'],
        ['.home-tab-toggle', 'Home view']
    ];
    groups.forEach(([selector, label]) => {
        document.querySelectorAll(selector).forEach(group => {
            group.setAttribute('role', 'group');
            if (!group.getAttribute('aria-label')) group.setAttribute('aria-label', label);
            group.querySelectorAll('button').forEach(button => {
                button.setAttribute('aria-pressed', String(button.classList.contains('active')));
            });
        });
    });
}

function enhanceClickableCards(root) {
    const scope = root || document.getElementById('app');
    if (!scope) return;
    scope.querySelectorAll('[onclick]').forEach(element => {
        if (element.matches('button, a, input, select, textarea, label, summary')) return;
        element.setAttribute('role', 'button');
        if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '0');
    });
}

function initDialogA11y(dialog) {
    dialog.setAttribute('role', dialog.id === 'app-confirm' ? 'alertdialog' : 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    if (!dialog.hasAttribute('aria-labelledby')) {
        const heading = dialog.querySelector('h2');
        if (heading) {
            if (!heading.id) heading.id = 'dialog-title-' + Math.random().toString(36).slice(2, 8);
            dialog.setAttribute('aria-labelledby', heading.id);
        }
    }
}

function getActiveDialog() {
    const dialogs = Array.from(document.querySelectorAll('.modal.active, .bottom-sheet.active'));
    return dialogs.length ? dialogs[dialogs.length - 1] : null;
}

const DIALOG_CLOSERS = {
    'rename-home-modal': () => closeRenameHomeModal(),
    'add-home-modal': () => closeAddHomeModal(),
    'mark-paid-modal': () => closeMarkPaidModal(),
    'reward-prompt-modal': () => closeRewardPrompt(),
    'all-bills-sheet': () => closeAllBillsSheet(),
    'home-selector-sheet': () => closeHomeSelector(),
    'bill-actions-sheet': () => closeBillActions(),
    'app-confirm': () => closeAppConfirm()
};

function closeTopDialog(dialog) {
    const closer = DIALOG_CLOSERS[dialog.id];
    if (closer) {
        closer();
    } else {
        dialog.classList.remove('active');
    }
}

function ensureAppConfirm() {
    let modal = document.getElementById('app-confirm');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'app-confirm';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2 id="app-confirm-title">Are you sure?</h2>
            <p id="app-confirm-message"></p>
            <div class="modal-actions">
                <button type="button" class="primary-btn" data-confirm-ok aria-describedby="app-confirm-message">Confirm</button>
                <button type="button" class="secondary-btn" data-confirm-cancel>Cancel</button>
            </div>
        </div>`;
    document.getElementById('app').appendChild(modal);
    initDialogA11y(modal);
    modal.querySelector('[data-confirm-cancel]').addEventListener('click', closeAppConfirm);
    modal.querySelector('[data-confirm-ok]').addEventListener('click', function() {
        const action = confirmAction;
        closeAppConfirm();
        if (action) action();
    });
    return modal;
}

function showAppConfirm(options) {
    const modal = ensureAppConfirm();
    modal.querySelector('#app-confirm-title').textContent = options.title;
    modal.querySelector('#app-confirm-message').textContent = options.message;
    modal.querySelector('[data-confirm-ok]').textContent = options.confirmLabel || 'Confirm';
    confirmAction = options.onConfirm || null;
    modal.classList.add('active');
    window.setTimeout(() => modal.querySelector('[data-confirm-cancel]').focus(), 0);
}

function closeAppConfirm() {
    const modal = document.getElementById('app-confirm');
    if (!modal) return;
    modal.classList.remove('active');
    confirmAction = null;
    if (dialogReturnFocus && document.contains(dialogReturnFocus)) {
        window.setTimeout(() => dialogReturnFocus.focus(), 0);
    }
}

document.addEventListener('click', function(event) {
    const trigger = event.target.closest('button, [role="button"], a');
    if (trigger && !trigger.closest('.modal, .bottom-sheet')) {
        dialogReturnFocus = trigger;
    }
}, true);

document.addEventListener('keydown', function(event) {
    const dialog = getActiveDialog();
    if (!dialog) return;

    if (event.key === 'Escape') {
        event.preventDefault();
        closeTopDialog(dialog);
        return;
    }

    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter(element => element.offsetParent !== null);
    if (!focusable.length) {
        event.preventDefault();
        const content = dialog.querySelector('.modal-content, .bottom-sheet-content');
        if (content) {
            content.setAttribute('tabindex', '-1');
            content.focus();
        }
        return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
    }
});

// Enter/Space activates card-style controls that are not native buttons
document.addEventListener('keydown', function(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const control = event.target.closest('[role="button"][onclick]');
    if (!control || control.matches('button, a')) return;
    event.preventDefault();
    control.click();
});

// Arrow-key navigation across the insight tabs
document.addEventListener('keydown', function(event) {
    const tab = event.target.closest('.insight-state-tab');
    if (!tab) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = Array.from(tab.closest('.insight-state-tabs').querySelectorAll('.insight-state-tab'));
    const current = tabs.indexOf(tab);
    let next = current;
    if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    event.preventDefault();
    tabs[next].click();
    tabs[next].focus();
});

function initAccessibility() {
    enhanceClickableCards();
    syncTabStates();
    document.querySelectorAll('.modal, .bottom-sheet').forEach(initDialogA11y);

    const dialogObserver = new MutationObserver(() => {
        const dialog = getActiveDialog();
        if (dialog && dialog !== activeDialog) {
            activeDialog = dialog;
            const target = dialog.querySelector('[data-autofocus]') || dialog.querySelector(FOCUSABLE_SELECTOR);
            if (target) window.setTimeout(() => target.focus(), 0);
        } else if (!dialog && activeDialog) {
            activeDialog = null;
            if (dialogReturnFocus && document.contains(dialogReturnFocus)) {
                window.setTimeout(() => dialogReturnFocus.focus(), 0);
            }
        }
    });

    document.querySelectorAll('.modal, .bottom-sheet').forEach(dialog => {
        dialogObserver.observe(dialog, { attributes: true, attributeFilter: ['class'] });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    initAccessibility();
}
