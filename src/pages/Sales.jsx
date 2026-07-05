import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import { formatMoney } from '../utils/format'

export default function Sales() {
  const { products, cart, addToCart, updateCartQty, removeFromCart, checkout, settings, currencies } = useApp()
  const [search, setSearch] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [customerName, setCustomerName] = useState('')
  const [discount, setDiscount] = useState('')
  const [lastReceipt, setLastReceipt] = useState(null)

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
  )

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discountVal = Number(discount) || 0
  const finalTotal = Math.max(0, cartTotal - discountVal)

  const handleCheckout = () => {
    const sale = checkout({ paymentMethod, customerName, discount: discountVal })
    if (sale) {
      setLastReceipt(sale)
      setShowCheckout(false)
      setCustomerName('')
      setDiscount('')
    }
  }

  if (lastReceipt) {
    return (
      <div className="pb-24">
        <Header title="Sale complete" />
        <div className="p-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-center text-forest-600 text-3xl mb-2">✓</p>
            <p className="text-center text-stone-500 text-sm mb-4">Sale recorded successfully</p>
            <div className="divide-y divide-stone-100">
              {lastReceipt.items.map((i) => (
                <div key={i.productId} className="py-2 flex justify-between text-sm">
                  <span>{i.name} × {i.qty}</span>
                  <span>{fmt(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-200 mt-2 pt-2 flex justify-between font-bold text-forest-700">
              <span>Total</span>
              <span>{fmt(lastReceipt.total)}</span>
            </div>
            <button
              onClick={() => setLastReceipt(null)}
              className="w-full mt-4 bg-forest-600 text-white rounded-lg py-2 font-semibold text-sm"
            >
              New sale
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-40">
      <Header title="Sell" />
      <div className="p-4 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product to add..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-white border border-stone-200 rounded-xl p-3 text-left active:bg-forest-50"
            >
              <p className="font-medium text-sm text-stone-800 truncate">{p.name}</p>
              <p className="text-xs text-stone-400">{p.stock} {p.unit} left</p>
              <p className="text-sm font-bold text-forest-700 mt-1">{fmt(p.sellPrice)}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-sm text-stone-400 text-center py-8">No matching in-stock products.</p>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-stone-200 shadow-lg max-h-[45vh] flex flex-col z-30">
          <div className="overflow-y-auto px-4 pt-3 space-y-2">
            {cart.map((i) => (
              <div key={i.productId} className="flex items-center justify-between text-sm">
                <span className="flex-1 truncate">{i.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQty(i.productId, i.qty - 1)} className="w-6 h-6 rounded-full border border-stone-300 text-stone-600">−</button>
                  <span className="w-6 text-center">{i.qty}</span>
                  <button onClick={() => updateCartQty(i.productId, i.qty + 1)} className="w-6 h-6 rounded-full border border-stone-300 text-stone-600">+</button>
                  <span className="w-16 text-right font-medium">{fmt(i.price * i.qty)}</span>
                  <button onClick={() => removeFromCart(i.productId)} className="text-red-400 text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400">Total</p>
              <p className="font-bold text-forest-700">{fmt(cartTotal)}</p>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="bg-forest-600 text-white px-6 py-2 rounded-lg font-semibold text-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 space-y-3">
            <p className="font-semibold text-stone-700">Checkout</p>
            <input
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <input
              placeholder="Discount amount (₹, optional)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              {['Cash', 'UPI', 'Card', 'Credit'].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                    paymentMethod === m ? 'bg-forest-600 text-white border-forest-600' : 'border-stone-300 text-stone-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg text-forest-700 pt-1">
              <span>Payable</span>
              <span>{fmt(finalTotal)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCheckout(false)} className="flex-1 border border-stone-300 rounded-lg py-2 text-sm text-stone-600">
                Cancel
              </button>
              <button onClick={handleCheckout} className="flex-1 bg-forest-600 text-white rounded-lg py-2 text-sm font-semibold">
                Confirm sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
