import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatMoney } from '../utils/format'

const DEFAULT_CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 82 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 88 },
]

export default function Settings() {
  const { settings, updateSettings, currencies } = useApp()
  const [fetchStatus, setFetchStatus] = useState('')
  const [editRates, setEditRates] = useState(false)

  const handleUpdate = (key, value) => {
    updateSettings({ [key]: value })
  }

  return (
    <div className="pb-6">
      <div className="p-4 space-y-4">
        <Section title="Shop details">
          <Field 
            label="Business name" 
            value={settings.businessName || ''} 
            onChange={(v) => handleUpdate('businessName', v)} 
          />
          <Field 
            label="Owner name" 
            value={settings.ownerName || ''} 
            onChange={(v) => handleUpdate('ownerName', v)} 
          />
          <Field 
            label="Phone" 
            value={settings.phone || ''} 
            onChange={(v) => handleUpdate('phone', v)} 
          />
          <Field 
            label="Address" 
            value={settings.address || ''} 
            onChange={(v) => handleUpdate('address', v)} 
            textarea 
          />
        </Section>

        <Section title="Display currency">
          <select
            value={settings.currency || 'INR'}
            onChange={(e) => handleUpdate('currency', e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            {DEFAULT_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>
            ))}
          </select>
          <p className="text-xs text-stone-400 mt-2">
            Prices are always entered in ₹ (INR). Choosing a different currency here only changes how prices are displayed.
          </p>
        </Section>

        <Section title="Stock alerts">
          <Field
            label="Low stock threshold"
            value={String(settings.lowStockThreshold || 5)}
            onChange={(v) => handleUpdate('lowStockThreshold', Number(v) || 5)}
            type="number"
          />
          <p className="text-xs text-stone-400 mt-2">You'll be notified when stock falls below this number.</p>
        </Section>

        <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-stone-700">Legal</p>
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2 border-b border-stone-100"
          >
            <span className="text-sm text-stone-700">🔒 Privacy Policy</span>
            <span className="text-stone-400 text-xs">Open →</span>
          </a>
          <a
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2"
          >
            <span className="text-sm text-stone-700">📄 Terms of Service</span>
            <span className="text-stone-400 text-xs">Open →</span>
          </a>
        </div>

        <div className="text-center text-xs text-stone-400 pb-4">
          <p>Kirana Manager · Pi Network Ecosystem</p>
          <p>All data stored locally on this device</p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
      <p className="text-sm font-semibold text-stone-700">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, textarea, type = 'text' }) {
  const Comp = textarea ? 'textarea' : 'input'
  return (
    <div>
      <label className="text-xs text-stone-400">{label}</label>
      <Comp
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm mt-1"
      />
    </div>
  )
}
