import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import { formatMoney, formatDate } from '../utils/format'

const CATEGORIES = ['Rent', 'Electricity', 'Transport', 'Salary', 'Maintenance', 'Supplies', 'Other']

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, settings, currencies } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleAdd = () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) return
    addExpense({ category, description: description.trim(), amount: amt })
    setDescription('')
    setAmount('')
    setShowForm(false)
  }

  return (
    <div className="pb-24">
      <Header title="Expenses" />
      <div className="p-4 space-y-3">
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400">Total expenses</p>
            <p className="text-xl font-bold text-amber-600">{fmt(total)}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <input
              placeholder="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 bg-amber-500 text-white rounded-lg py-2 text-sm font-semibold">
                Save expense
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 rounded-lg border border-stone-300 text-sm text-stone-600">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {expenses.length === 0 && <p className="text-sm text-stone-400 text-center py-8">No expenses recorded yet.</p>}
          {expenses.map((e) => (
            <div key={e.id} className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800 text-sm">{e.category}</p>
                {e.description && <p className="text-xs text-stone-400">{e.description}</p>}
                <p className="text-xs text-stone-400">{formatDate(e.timestamp)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-600">{fmt(e.amount)}</span>
                <button onClick={() => deleteExpense(e.id)} className="text-xs text-red-400">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
