# Kirana Manager

Mobile-first grocery shop management app built with React + Vite + Tailwind CSS.

## Stack
- **Frontend:** React 18, Vite 5, Tailwind CSS 3
- **Storage:** Browser localStorage (no backend, no database)
- **Currency:** All prices stored in ₹ INR; display currency configurable in Settings

## Running the app
```bash
npm run dev   # starts dev server on port 5000
npm run build # production build
```

The workflow "Start application" runs `npm run dev` automatically.

## Project structure
```
src/
  App.jsx              # root, routing between pages
  context/
    AppContext.jsx      # global state (products, sales, expenses, settings) + localStorage persistence
  pages/
    Dashboard.jsx       # today's stats, low-stock alerts, recent sales
    Sales.jsx           # POS / cart / checkout
    Stock.jsx           # add/edit/delete products
    Expenses.jsx        # expense tracking
    Invoices.jsx        # invoice history
    Settings.jsx        # shop details, currency, exchange rates
  components/           # shared UI components
  data/                 # static data (currency list, defaults)
  utils/                # format helpers
```

## Data model
All data lives in a single `kirana-data` localStorage key as `{ products, sales, expenses, settings }`.
Favorites (starred products in the POS) are stored separately under `favorites`.

## User preferences
