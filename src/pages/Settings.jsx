import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import { DEFAULT_CURRENCIES } from '../data/currencies'

export default function Settings() {
  const { settings, setSettings, currencies, setCurrencies } = useApp()
  const [fetchStatus, setFetchStatus] = useState('')
  const [editRates, setEditRates] = useState(false)

  const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }))

  const fetchLiveRates = async () => {
    setFetchStatus('Fetching...')
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/INR')
      const data = await res.json()
      if (data.result !== 'success') throw new Error('API error')
      const updated = currencies.map((c) => {
        const rate = data.rates?.[c.code]
        return rate ? { ...c, rate } : c
      })
      setCurrencies(updated)
      update({ lastRateUpdate: Date.now() })
      setFetchStatus('Rates updated ✓')
    } catch (e) {
      setFetchStatus('Fetch failed — check internet, or edit rates manually below.')
    }
    setTimeout(() => setFetchStatus(''), 4000)
  }

  const resetRates = () => setCurrencies(DEFAULT_CURRENCIES)

  const updateRate = (code, rate) => {
    setCurrencies((prev) => prev.map((c) => (c.code === code ? { ...c, rate: Number(rate) || 0 } : c)))
  }

  return (
    <div className="pb-24">
      <Header title="Settings" />
      <div className="p-4 space-y-4">
        <Section title="Shop details">
          <Field label="Shop name" value={settings.shopName} onChange={(v) => update({ shopName: v })} />
          <Field label="Owner name" value={settings.ownerName} onChange={(v) => update({ ownerName: v })} />
          <Field label="Phone" value={settings.phone} onChange={(v) => update({ phone: v })} />
          <Field label="Address" value={settings.address} onChange={(v) => update({ address: v })} textarea />
        </Section>

        <Section title="Display currency">
          <select
            value={settings.currency}
            onChange={(e) => update({ currency: e.target.value })}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>
            ))}
          </select>
          <p className="text-xs text-stone-400">
            Prices are always entered in ₹ (INR). Choosing a different currency here only changes how
            prices are displayed, using the conversion rates below.
          </p>

          <div className="flex gap-2 pt-1">
            <button onClick={fetchLiveRates} className="flex-1 bg-forest-600 text-white rounded-lg py-2 text-sm font-semibold">
              Refresh live rates
            </button>
            <button onClick={() => setEditRates(!editRates)} className="px-3 rounded-lg border border-stone-300 text-sm text-stone-600">
              {editRates ? 'Hide' : 'Edit'} rates
            </button>
          </div>
          {fetchStatus && <p className="text-xs text-stone-500">{fetchStatus}</p>}
          {settings.lastRateUpdate && (
            <p className="text-xs text-stone-400">Last updated: {new Date(settings.lastRateUpdate).toLocaleString('en-IN')}</p>
          )}

          {editRates && (
            <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 mt-2 max-h-72 overflow-y-auto">
              {currencies.map((c) => (
                <div key={c.code} className="flex items-center justify-between px-3 py-2 gap-2">
                  <span className="text-sm text-stone-600 w-24">{c.code}</span>
                  <input
                    type="number"
                    step="any"
                    disabled={c.code === 'INR'}
                    value={c.rate}
                    onChange={(e) => updateRate(c.code, e.target.value)}
                    className="flex-1 rounded-lg border border-stone-300 px-2 py-1 text-sm text-right disabled:bg-stone-100"
                  />
                </div>
              ))}
              <div className="p-2">
                <button onClick={resetRates} className="w-full text-xs text-stone-500 border border-stone-300 rounded-lg py-1.5">
                  Reset to default rates
                </button>
              </div>
            </div>
          )}
        </Section>

        <Section title="Stock alerts">
          <Field
            label="Low stock threshold"
            value={String(settings.lowStockThreshold)}
            onChange={(v) => update({ lowStockThreshold: Number(v) || 0 })}
            type="number"
          />
        </Section>

        <p className="text-center text-xs text-stone-400 pt-2">Kirana Manager · all data stored locally on this device</p>
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
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm mt-0.5"
      />
    </div>
  )
}
