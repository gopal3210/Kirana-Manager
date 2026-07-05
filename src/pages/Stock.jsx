import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { formatMoney } from '../utils/format'

const UNITS = ['pc', 'kg', 'g', 'ltr', 'ml', 'packet', 'box', 'dozen']
const EMPTY_FORM = { name: '', category: '', unit: 'pc', stock: '', costPrice: '', sellPrice: '' }

export default function Stock() {
  const { products, addProduct, updateProduct, deleteProduct, settings, currencies } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [search, setSearch] = useState('')
  // per-product quick-restock delta: { [id]: number }
  const [restockDelta, setRestockDelta] = useState({})
  const nameRef = useRef(null)

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  const existingCategories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
    setShowMore(false)
  }

  const openAdd = () => {
    resetForm()
    setShowForm(true)
    setTimeout(() => nameRef.current?.focus(), 50)
  }

  const handleCostChange = (val) => {
    const cost = Number(val)
    const suggestedSell = cost > 0 ? Math.ceil(cost * 1.3) : ''
    setForm((f) => ({
      ...f,
      costPrice: val,
      // only auto-fill if sell price is still empty or was auto-filled before
      sellPrice: f._autoSell || f.sellPrice === '' ? String(suggestedSell) : f.sellPrice,
      _autoSell: cost > 0,
    }))
  }

  const handleSellChange = (val) => {
    setForm((f) => ({ ...f, sellPrice: val, _autoSell: false }))
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const startEdit = (p) => {
    setForm({
      name: p.name, category: p.category, unit: p.unit,
      stock: String(p.stock), costPrice: String(p.costPrice), sellPrice: String(p.sellPrice),
      _autoSell: false,
    })
    setEditingId(p.id)
    setShowForm(true)
    setShowMore(true)
    setTimeout(() => nameRef.current?.focus(), 50)
  }

  // Quick restock helpers
  const getDelta = (id) => restockDelta[id] ?? 0

  const changeDelta = (id, diff) => {
    setRestockDelta((prev) => {
      const cur = prev[id] ?? 0
      return { ...prev, [id]: Math.max(-9999, cur + diff) }
    })
  }

  const applyRestock = (product) => {
    const delta = getDelta(product.id)
    if (delta === 0) return
    updateProduct(product.id, { stock: Math.max(0, product.stock + delta) })
    setRestockDelta((prev) => ({ ...prev, [product.id]: 0 }))
  }

  return (
    <div className="pb-6">
      <div className="p-4 space-y-3">

        {/* Search + Add */}
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <button
            onClick={openAdd}
            className="bg-forest-600 text-white px-4 rounded-lg text-sm font-semibold"
          >
            + Add
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white border border-forest-200 rounded-xl p-4 space-y-2 shadow-sm">
            <p className="font-semibold text-stone-700 text-sm">
              {editingId ? 'Edit product' : 'New product'}
            </p>

            {/* Row 1: Name */}
            <input
              ref={nameRef}
              placeholder="Product name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />

            {/* Row 2: Stock + Sell price — the two most common fields */}
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Stock qty"
                type="number"
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                onKeyDown={handleKeyDown}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Sell price (₹) *"
                type="number"
                inputMode="decimal"
                value={form.sellPrice}
                onChange={(e) => handleSellChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Toggle: More options */}
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="text-xs text-forest-600 font-medium flex items-center gap-1"
            >
              {showMore ? '▲ Less options' : '▼ More options (cost, category, unit)'}
            </button>

            {showMore && (
              <div className="space-y-2 border-t border-stone-100 pt-2">
                {/* Cost price — auto-suggests sell price */}
                <input
                  placeholder="Cost price (₹) — sell price auto-fills at +30%"
                  type="number"
                  inputMode="decimal"
                  value={form.costPrice}
                  onChange={(e) => handleCostChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />

                {/* Category with datalist autocomplete */}
                <input
                  list="category-list"
                  placeholder="Category (optional)"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
                <datalist id="category-list">
                  {existingCategories.map((c) => <option key={c} value={c} />)}
                </datalist>

                {/* Unit */}
                <div className="flex gap-1 flex-wrap">
                  {UNITS.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setForm({ ...form, unit: u })}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                        form.unit === u
                          ? 'bg-forest-600 text-white border-forest-600'
                          : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-forest-600 text-white rounded-lg py-2 text-sm font-semibold"
              >
                {editingId ? 'Save changes' : 'Add product'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 rounded-lg border border-stone-300 text-sm text-stone-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Product list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-8">
              No products yet. Tap + Add to create one.
            </p>
          )}

          {filtered.map((p) => {
            const delta = getDelta(p.id)
            const isLow = p.stock <= (settings.lowStockThreshold ?? 5)
            return (
              <div key={p.id} className="bg-white border border-stone-200 rounded-xl p-3 space-y-2">
                {/* Top row: name + edit/del */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-stone-400">{p.category || 'Uncategorized'}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-xs px-2 py-1 rounded-lg border border-stone-300 text-stone-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500"
                    >
                      Del
                    </button>
                  </div>
                </div>

                {/* Prices row */}
                <div className="flex gap-3 text-xs text-stone-500">
                  <span>Cost: <span className="font-semibold text-stone-700">{fmt(p.costPrice)}</span></span>
                  <span>Sell: <span className="font-semibold text-forest-700">{fmt(p.sellPrice)}</span></span>
                  {p.costPrice > 0 && p.sellPrice > 0 && (
                    <span className="text-green-600 font-medium">
                      +{Math.round(((p.sellPrice - p.costPrice) / p.costPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Quick restock row */}
                <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                  <span className={`text-xs font-semibold ${isLow ? 'text-amber-600' : 'text-forest-600'}`}>
                    {isLow && '⚠ '}Stock: {p.stock} {p.unit}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      onClick={() => changeDelta(p.id, -1)}
                      className="w-7 h-7 rounded-lg border border-stone-300 text-stone-600 font-bold text-base flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className={`w-8 text-center text-sm font-bold ${delta > 0 ? 'text-forest-600' : delta < 0 ? 'text-red-500' : 'text-stone-400'}`}>
                      {delta > 0 ? `+${delta}` : delta === 0 ? '0' : delta}
                    </span>
                    <button
                      onClick={() => changeDelta(p.id, 1)}
                      className="w-7 h-7 rounded-lg border border-stone-300 text-stone-600 font-bold text-base flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => applyRestock(p)}
                      disabled={delta === 0}
                      className={`ml-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        delta !== 0
                          ? 'bg-forest-600 text-white'
                          : 'bg-stone-100 text-stone-400 cursor-default'
                      }`}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
