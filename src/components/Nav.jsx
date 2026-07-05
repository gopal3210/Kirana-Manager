import React from 'react'

const TABS = [
  { key: 'dashboard', label: 'Home', icon: '⌂' },
  { key: 'sales', label: 'Sell', icon: '🛒' },
  { key: 'stock', label: 'Stock', icon: '📦' },
  { key: 'expenses', label: 'Expense', icon: '💸' },
  { key: 'invoices', label: 'Bills', icon: '🧾' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

export default function Nav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] z-40">
      <div className="flex justify-between max-w-lg mx-auto no-scrollbar overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex-1 min-w-[56px] flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              active === tab.key ? 'text-forest-700' : 'text-stone-400'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
            {active === tab.key && (
              <span className="absolute -mt-6 h-1 w-6 rounded-full bg-forest-600" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
