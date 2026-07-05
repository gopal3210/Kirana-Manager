import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import { formatMoney } from '../utils/format'

const EMPTY_FORM = { name: '', category: '', unit: 'pc', stock: '', costPrice: '', sellPrice: '' }

export default function Stock() {
  const { products, addProduct, updateProduct, deleteProduct, settings, currencies } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      unit: form.unit,
      stock: Number(form.stock) || 0,
      costPrice: Number(form.costPrice) || 0,
      sellPrice: Number(form.sellPrice) || 0,
    }
    if (editingId) {
      updateProduct(editingId, payload)
    } else {
      addProduct(payload)
    }
    resetForm()
  }

  const startEdit = (p) => {
    setForm({
      name: p.name, category: p.category, unit: p.unit,
      stock: String(p.stock), costPrice: String(p.costPrice), sellPrice: String(p.sellPrice),
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  return (
    <div className="pb-24">
      <Header title="Stock" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="bg-forest-600 text-white px-4 rounded-lg text-sm font-semibold"
          >
            + Add
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-stone-700 text-sm">{editingId ? 'Edit product' : 'New product'}</p>
            <input placeholder="Product name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <input placeholder="Category (optional)" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                {['pc', 'kg', 'g', 'ltr', 'ml', 'packet', 'box', 'dozen'].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <input placeholder="Stock qty" type="number" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Cost price (₹)" type="number" value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <input placeholder="Sell price (₹)" type="number" value={form.sellPrice}
                onChange={(e) => setForm({ ...form, sellPrice: e.target.value })}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSubmit} className="flex-1 bg-forest-600 text-white rounded-lg py-2 text-sm font-semibold">
                {editingId ? 'Save changes' : 'Add product'}
              </button>
              <button onClick={resetForm} className="px-4 rounded-lg border border-stone-300 text-sm text-stone-600">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-8">No products yet. Tap + Add to create one.</p>
          )}
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800">{p.name}</p>
                <p className="text-xs text-stone-400">{p.category || 'Uncategorized'} · {fmt(p.sellPrice)}/{p.unit}</p>
                <p className={`text-xs font-semibold ${p.stock <= (settings.lowStockThreshold ?? 5) ? 'text-amber-600' : 'text-forest-600'}`}>
                  Stock: {p.stock} {p.unit}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-xs px-2 py-1 rounded-lg border border-stone-300 text-stone-600">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
