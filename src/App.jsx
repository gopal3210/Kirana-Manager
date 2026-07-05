import React, { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Stock from './pages/Stock'
import Sales from './pages/Sales'
import Expenses from './pages/Expenses'
import Invoices from './pages/Invoices'
import Settings from './pages/Settings'

const PAGES = {
  dashboard: Dashboard,
  stock: Stock,
  sales: Sales,
  expenses: Expenses,
  invoices: Invoices,
  settings: Settings,
}

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const Page = PAGES[tab]

  return (
    <AppProvider>
      <div className="min-h-screen bg-stone-50 max-w-lg mx-auto relative">
        <Header active={tab} onChange={setTab} title={tab.charAt(0).toUpperCase() + tab.slice(1)} />
        <div className="pt-0">
          <Page />
        </div>
      </div>
    </AppProvider>
  )
}
