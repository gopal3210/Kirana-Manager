import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import { formatMoney, formatDate } from '../utils/format'

export default function Invoices() {
  const { sales, deleteSale, settings, currencies } = useApp()
  const [openId, setOpenId] = useState(null)

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  return (
    <div className="pb-24">
      <Header title="Invoice History" />
      <div className="p-4 space-y-2">
        {sales.length === 0 && <p className="text-sm text-stone-400 text-center py-8">No sales recorded yet.</p>}
        {sales.map((s) => (
          <div key={s.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
              className="w-full p-3 flex items-center justify-between text-left"
            >
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {s.customerName || 'Walk-in customer'} · {s.paymentMethod}
                </p>
                <p className="text-xs text-stone-400">{formatDate(s.timestamp)} · {s.items.length} items</p>
              </div>
              <span className="font-bold text-forest-700">{fmt(s.total)}</span>
            </button>
            {openId === s.id && (
              <div className="border-t border-stone-100 p-3 space-y-1">
                {s.items.map((i) => (
                  <div key={i.productId} className="flex justify-between text-sm text-stone-600">
                    <span>{i.name} × {i.qty}</span>
                    <span>{fmt(i.price * i.qty)}</span>
                  </div>
                ))}
                {s.discount > 0 && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>Discount</span>
                    <span>−{fmt(s.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-forest-700 pt-1 border-t border-stone-100">
                  <span>Total</span>
                  <span>{fmt(s.total)}</span>
                </div>
                <button
                  onClick={() => deleteSale(s.id)}
                  className="w-full mt-2 text-xs text-red-500 border border-red-200 rounded-lg py-1.5"
                >
                  Delete invoice
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
