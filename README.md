# Kirana Manager

Mobile-first grocery shop management app — Stock, Sales/POS, Cart & Checkout,
Expenses, Invoice History, Dashboard, and Settings. No Pi Network / crypto —
plain multi-currency shop app for everyday use.

## Features
- **Dashboard** — today's sales, expenses, profit, low-stock alerts, recent sales
- **Stock** — add/edit/delete products, track quantity, cost & sell price
- **Sell (POS + Cart)** — tap products to add to cart, adjust qty, checkout with
  payment method, discount, and customer name
- **Expenses** — categorized expense tracking
- **Invoice History** — every past sale with itemized breakdown
- **Settings** — shop details, 27 currencies with editable exchange rates
  (live-refreshable via a free no-key API), low-stock threshold

## Currency system
All prices are entered and stored in **₹ (INR)** as the base currency.
In Settings, pick any of 27 currencies to *display* prices in — sell price,
dashboard stats, invoices all convert automatically using the stored rate.
Rates can be:
- Left as sensible defaults, or
- Refreshed live (tap "Refresh live rates" — uses open.er-api.com, free, no key), or
- Edited manually per currency (tap "Edit rates")

## Local development
```bash
npm install
npm run dev
```

## Deploy
1. Push this project to a new GitHub repo
2. Import the repo in Vercel → Framework: **Vite** (auto-detected) → Root
   Directory: blank → Deploy
3. No environment variables needed — everything runs client-side with
   localStorage, no backend required

## Data storage
All data (products, sales, expenses, settings, currency rates) is stored in
the browser's `localStorage` — single-device, single-store, no login needed.
Clearing browser data will erase it, so consider periodic manual backups if
this matters to you (a JSON export feature can be added later).
