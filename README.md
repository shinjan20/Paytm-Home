# Paytm My Bills Prototype

A mobile-first interactive prototype for the Paytm My Bills feature, built according to the UI/UX and Feature PRD specifications.

## Overview

This prototype demonstrates the core user journey for managing recurring bills within Paytm's existing Recharge & Bills section. It follows the design principle of "familiar first, intelligent second" and implements the physical-calendar metaphor for bill tracking.

## Screens Implemented

1. **Recharge & Bills Landing** - Entry point with Add New Bill action, View All bill categories sheet, and a My Bills card with a Me/Home toggle (Home mode shows each home as a custom house icon with its due amount and name)
2. **My Bills Dashboard (Me Tab)** - Personal bills with Needs attention, Upcoming, and Recently paid sections
3. **Home Selection Screen** - Choose between multiple homes (Personal Home, Flatmates)
4. **Personal Home Dashboard** - Separate bill view for personal household
5. **Flatmates Home Dashboard** - Separate bill view for shared flatmate bills
6. **Add Bill Chooser** - Camera, Upload, and Search biller options
7. **Camera Capture** - Bill scanning interface
8. **File Upload** - Image/PDF upload interface
9. **Biller Search** - Category-based biller discovery
10. **OCR Review** - Editable extracted bill fields
11. **Bill Details** - Payment and mark-paid options
12. **Bills Calendar (Me)** - Paper wall-calendar view of all bills with pen marks and a day agenda
13. **Calendar (Personal Home)** - Paper calendar with personal home bills
14. **Calendar (Flatmates Home)** - Paper calendar with flatmate bills
15. **Reminder Settings** - Notification preferences
16. **Home Details / Invite Join** - Paytm home details screen with members, reason, invite link, accept/decline
16. **Email Bill Discovery – Consent** - Value-led invitation, provider/scope consent, read-only promise
17. **Email Bill Discovery – Scanning** - Simulated read-only scan of the last 12 months of bill emails
18. **Email Bill Discovery – Candidate Review** - Select which found bills to add, with dynamic totals
19. **Email Bill Discovery – Connected / Disconnected** - Connection management, stats, reconnect/disconnect

## Key Features

- **Home/Me Tab Toggle**: Switch between personal bills and multiple household views
- **Multiple Home Support**: Personal Home, Flatmates, and ability to create new homes
- **Separate Bill Dashboards**: Each home has its own distinct billing information
- **Status Confidence System**: Distinguishes between confirmed pending, estimated, user-declared, and verified paid states
- **Physical-Calendar Metaphor**: A paper wall calendar with a spiral binding, printed month header, ledger totals, ruled date cells, a folded page corner and a stuck-on sticky note
  - **Hand-drawn marks**: red ink circles around due dates, amber dashed loops around estimates, stars for important bills, highlighter swipes for today/payday, and green cross-offs for paid dates
  - **Paper trail**: crossed-off dates and bills stay visible instead of disappearing
  - **Margin and sticky notes**: handwritten reminders sit beside the grid and on the desk below it
  - **Pen-marks legend**: explains each mark without relying on colour alone
  - **Day agenda**: selecting a date rewrites the lined agenda page, including a "next up" note on empty days
  - **Working filters**: All / Needs attention / Paid dim non-matching dates and filter the agenda
- **Multiple Bill Addition Paths**: Camera, upload, and manual entry
- **Email Bill Discovery**: Optional, read-only inbox scan that finds bill emails and attachments, then routes them through a review step before anything is added
  - **Value-led invitation**: Add a bill screen and My Bills status card explain what the feature does and why it helps (catch bills you would have missed, no more typing amounts/due dates)
  - **Consent**: Provider choice (Google/Gmail or Outlook), explicit scope summary (allowed vs not allowed), retention note, and no-password sign-in promise
  - **Scanning**: Simulated read-only scan with step progression (bill senders → attachments → amount/due-date matching) and reduced-motion support
  - **Candidate review**: Found bills with amount/due date/biller, select-all, per-item selection, live total, added state
  - **Connected state**: Account card, last-scan / found / added stats, scan again, manage connection, disconnect
  - **Opt-out**: "Not now" on the invite, dismiss on the My Bills card, and disconnect from the connected screen all leave core bill management untouched
- **Home Onboarding (optional)**: New home profiles support an optional invite step — add up to 5 people and generate a join invite link (`paytm://join/hm-…`) to onboard them into the home
  - **Optional by design**: This step is not required for every household (e.g., digital-child/analog-parent setups); the ICP deliberately focuses on single-person LTV rather than the referral funnel
- **External/Offline Payment**: "I paid elsewhere" confirmation with unverified status
- **Voucher-linked Payment Cues**: Pre-payment eligibility hint on bill detail and Pay bill, post-success progress cue, and progress updated consistently on the dashboard, success screen, and reward details
- **Undo Functionality**: Revert accidental actions
- **Responsive Design**: Mobile-first layout optimized for common Android viewport sizes

## Design System

- **Primary Color**: Paytm Blue (#00baf2)
- **Secondary Colors**: Status-specific (red for pending, amber for estimated, green for paid)
- **Typography**: System fonts following platform conventions, with a unified type scale (title 20px, subtitle/flow 18px, section 16px, card 15px, body 13px, supporting 12px, label 11px)
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable bill cards, status badges, and form fields

## How to Use

1. Open the prototype in a browser
2. Navigate from the Recharge & Bills landing to My Bills
3. **Toggle between Me and Home tabs** in the My Bills header
4. **Click "Home" tab** to see the Home Selection screen with multiple home options
5. **Select "Personal Home"** to view personal household bills (Electricity, Broadband, Gas, Water)
6. **Select "Flatmates"** to view shared flatmate bills (Shared Broadband, Netflix, Rent)
7. **Create new homes** using the "Add new home" option
8. Each home has its own separate calendar and bill data
9. Try adding a bill through different methods
10. Test the calendar: tap a date to update the agenda, toggle a bill's check box to cross it off (and undo), and try the All / Needs attention / Paid filters
11. Experience the mark-paid flow with undo
12. **Discover bills by email**: open Add a bill → "Connect email" → consent → scan → review → add; or use the "Find my bills" card on My Bills
13. **Manage the email connection**: scan again, review found bills, or disconnect from the connected screen

## Technical Details

- **Technologies**: HTML5, CSS3, Vanilla JavaScript
- **No Frameworks**: Pure web technologies for easy testing
- **Responsive**: Mobile-optimized (max-width: 430px)
- **Synthetic Data**: All bill data is simulated for prototype purposes

## Important Notes

- This is a **prototype only** - no real payments, data storage, or integrations
- All data is synthetic and masked (e.g., XXXX1234)
- No actual OCR, bill fetching, or email discovery is connected
- Camera and file upload are simulated interactions
- Designed for user testing and validation, not production use

## PRD Compliance

The prototype implements the P0/MVP core requirements from both PRDs:

✅ Entry point within Recharge & Bills
✅ Bills overview with pending-first dashboard
✅ Add bill via camera, upload, and manual entry
✅ OCR extraction and user review/correction
✅ Biller verification status display
✅ Bill details and payment deep link
✅ "I paid elsewhere" confirmation
✅ Payment-aware reminders
✅ Calendar with monthly view and completion interaction
✅ Status confidence visualization

## Email Discovery Flow

- **Screens**: Add a bill invite → consent → scanning → candidate review → connected/disconnected
- **Entry points**: Add a bill screen invitation, My Bills status card ("Find my bills →"), connected-state management
- **Behaviour**: Read-only simulated scan; nothing is added without user review; user can disconnect anytime
- **Privacy**: No password collection, no broad inbox access, bill content not stored, disconnect stops future scans

## File Structure

```
Paytm Home/
├── index.html      # All screens and markup
├── styles.css      # Complete styling and design system
├── script.js       # Navigation and interaction logic
└── README.md       # This file
```

## Running the Prototype

1. Open `index.html` directly in a browser, or
2. Run a local server: `python3 -m http.server 8000`
3. Navigate to `http://localhost:8000`

## Testing Checklist

- [ ] Navigate from landing to My Bills
- [ ] View Needs attention, Upcoming, and Recently paid sections
- [ ] Try each Add bill method (Camera, Upload, Search)
- [ ] Review OCR fields and edit them
- [ ] View bill details and see status confidence
- [ ] Mark a bill as paid elsewhere
- [ ] Use the calendar to select dates
- [ ] Cross off a bill in the agenda
- [ ] Undo a cross-off action
- [ ] Configure reminder settings
- [ ] Walk the email flow end to end: invite → consent → scan → candidates → add → My Bills connected card → manage → scan → empty state → disconnect → reconnect

## Future Enhancements (P1/P2)

- Home-screen widget concepts
- Household profiles and sharing
- Rewards and incentives
- Enhanced calendar filters and summaries

## React + Router (current build)

This project has been transformed into a **React + Vite + React Router** app.
The full prototype UI/logic is preserved via `src/LegacyApp.jsx`, which renders
the original markup and runs the original script, while React Router syncs the
browser URL with the active screen (`/`, `/bills`, `/calendar`, `/email/consent`, …).

### File structure
```
Paytm Home/
├── index.html          # Vite entry
├── package.json        # React + Vite + React Router
├── vite.config.js
├── src/
│   ├── main.jsx        # React root + BrowserRouter
│   ├── App.jsx         # Routes (catch-all -> LegacyApp)
│   ├── LegacyApp.jsx   # Renders the full prototype, syncs URL <-> screen
│   └── styles.css      # Global styles (ported from legacy)
├── _legacy_backup/     # Original HTML/CSS/JS (source of truth for markup/logic)
└── README.md
```

### Running
1. `npm install`
2. `npm run dev` → http://localhost:5173
3. `npm run build` → `dist/`
4. `npm run preview`
