import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { formatMoney } from '../utils/format'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export default function Dashboard() {
  const { products, sales, expenses, settings, currencies } = useApp()

  const stats = useMemo(() => {
    const todayStart = startOfToday()
    const todaySales = sales.filter((s) => s.timestamp >= todayStart)
    const todayExpenses = expenses.filter((e) => e.timestamp >= todayStart)
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0)
    const todayExpenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0)
    const lowStock = products.filter((p) => p.stock <= (settings.lowStockThreshold ?? 5))
    const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0)
    return {
      todayRevenue,
      todayExpenseTotal,
      todayProfit: todayRevenue - todayExpenseTotal,
      todayOrders: todaySales.length,
      lowStock,
      totalStockValue,
    }
  }, [products, sales, expenses, settings])

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  return (
    <div className="pb-6">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Today's Sales" value={fmt(stats.todayRevenue)} accent="forest" />
          <StatCard label="Today's Expenses" value={fmt(stats.todayExpenseTotal)} accent="amber" />
          <StatCard label="Today's Profit" value={fmt(stats.todayProfit)} accent="forest" />
          <StatCard label="Orders Today" value={stats.todayOrders} accent="amber" />
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Total stock value (cost price)</p>
          <p className="text-2xl font-bold text-forest-800">{fmt(stats.totalStockValue)}</p>
          <p className="text-xs text-stone-400 mt-1">{products.length} products in stock</p>
        </div>

        {stats.lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">⚠ Low stock ({stats.lowStock.length})</p>
            <ul className="space-y-1">
              {stats.lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="text-sm text-amber-900 flex justify-between">
                  <span>{p.name}</span>
                  <span className="font-medium">{p.stock} {p.unit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm font-semibold text-stone-700 mb-2">Recent sales</p>
          {sales.length === 0 && <p className="text-sm text-stone-400">No sales yet. Go to Sell tab to start.</p>}
          <ul className="divide-y divide-stone-100">
            {sales.slice(0, 5).map((s) => (
              <li key={s.id} className="py-2 flex justify-between text-sm">
                <span className="text-stone-600">{s.items.length} items · {s.paymentMethod}</span>
                <span className="font-semibold text-forest-700">{fmt(s.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  const color = accent === 'forest' ? 'text-forest-700' : 'text-amber-600'
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-3">
      <p className="text-xs text-stone-500">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}
