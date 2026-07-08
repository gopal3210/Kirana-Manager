import React from 'react'
import { useApp } from '../context/AppContext'

const TABS = [
  { key: 'dashboard', label: 'Home', icon: '⌂' },
  { key: 'sales', label: 'Sell', icon: '🛒' },
  { key: 'stock', label: 'Stock', icon: '📦' },
  { key: 'expenses', label: 'Expense', icon: '💸' },
  { key: 'invoices', label: 'Bills', icon: '🧾' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

export default function Header({ title, active, onChange }) {
  const { settings } = useApp()
  
  return (
    <header className="sticky top-0 z-30 bg-forest-700 text-white px-4 pb-1 shadow-sm" style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-forest-200">{settings.businessName || 'Kirana Manager'}</p>
          <h1 className="text-lg font-bold leading-tight">{title}</h1>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <nav className="flex justify-between -mx-4 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex-1 min-w-[50px] flex flex-col items-center gap-0.5 py-2 px-2 text-xs font-medium transition-colors relative ${
              active === tab.key ? 'text-white' : 'text-forest-100'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
            {active === tab.key && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-4 rounded-full bg-white" />
            )}
          </button>
        ))}
      </nav>
    </header>
  )
}
