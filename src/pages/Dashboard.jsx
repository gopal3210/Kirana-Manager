import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { formatMoney, formatDate } from '../utils/format'

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
    const totalProfit = todaySales.reduce((sum, s) => {
      const saleCost = s.items.reduce((itemSum, i) => {
        const product = products.find(p => p.id === i.productId)
        return itemSum + (product?.costPrice || 0) * i.quantity
      }, 0)
      return sum + (s.total - saleCost)
    }, 0)
    return {
      todayRevenue,
      todayExpenseTotal,
      todayProfit: totalProfit,
      todayOrders: todaySales.length,
      lowStock,
      totalStockValue,
      totalSales: sales.length,
    }
  }, [products, sales, expenses, settings])

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  return (
    <div className="pb-6">
      <div className="p-4 space-y-4">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Today's Sales" value={fmt(stats.todayRevenue)} accent="forest" />
          <StatCard label="Today's Profit" value={fmt(stats.todayProfit)} accent="green" />
          <StatCard label="Orders Today" value={stats.todayOrders} accent="blue" />
          <StatCard label="Expenses" value={fmt(stats.todayExpenseTotal)} accent="amber" />
        </div>

        {/* Stock Value Card */}
        <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-xl p-4 text-white shadow-lg">
          <p className="text-sm text-forest-100">Total Stock Value</p>
          <p className="text-3xl font-bold">{fmt(stats.totalStockValue)}</p>
          <p className="text-xs text-forest-200 mt-1">{products.length} products in inventory</p>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStock.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">⚠️  {stats.lowStock.length} items low on stock</p>
            <div className="space-y-1">
              {stats.lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="text-xs text-amber-700 flex justify-between">
                  <span>{p.name}</span>
                  <span className="font-semibold">{p.stock} {p.unit} left</span>
                </div>
              ))}
              {stats.lowStock.length > 5 && (
                <p className="text-xs text-amber-600 mt-1">+{stats.lowStock.length - 5} more items...</p>
              )}
            </div>
          </div>
        )}

        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm font-semibold text-stone-700 mb-3">Recent Sales</p>
          {sales.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-4">No sales yet today</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sales.slice(-8).reverse().map((s) => (
                <div key={s.id} className="flex justify-between items-center text-sm p-2 bg-stone-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-stone-700">{s.customerName}</p>
                    <p className="text-xs text-stone-400">{s.items.length} items • {s.paymentMethod}</p>
                  </div>
                  <p className="font-semibold text-forest-700">{fmt(s.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">📊 Today's Summary</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-blue-600 font-bold text-lg">{stats.totalSales}</p>
              <p className="text-blue-700">Total Sales</p>
            </div>
            <div className="text-center">
              <p className="text-green-600 font-bold text-lg">{((stats.todayRevenue / (stats.totalStockValue || 1)) * 100).toFixed(1)}%</p>
              <p className="text-green-700">Turnover</p>
            </div>
            <div className="text-center">
              <p className="text-amber-600 font-bold text-lg">{settings.lowStockThreshold}</p>
              <p className="text-amber-700">Alert Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  const colors = {
    forest: 'bg-forest-50 text-forest-700 border-forest-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <div className={`${colors[accent]} rounded-xl border p-3`}>
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  )
}
