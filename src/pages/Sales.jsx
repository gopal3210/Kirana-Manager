import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { formatMoney } from '../utils/format'

export default function Sales() {
  const { products, addSale, settings, currencies } = useApp()
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [customerName, setCustomerName] = useState('')
  const [discount, setDiscount] = useState('')
  const [lastReceipt, setLastReceipt] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setFavorites(parsed)
      }
    } catch (e) {
      console.error('Failed to load favorites:', e)
    }
  }, [])

  const fmt = (v) => formatMoney(v, settings.currency, currencies)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
  )

  const favoriteProducts = products.filter(p => favorites.includes(p.id) && p.stock > 0)

  const addToFavorites = (productId) => {
    const updated = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    setFavorites(updated)
    try { localStorage.setItem('favorites', JSON.stringify(updated)) } catch (e) {}
  }

  const addToCart = (product) => {
    const existing = cart.find((i) => i.productId === product.id)
    if (existing) {
      if (existing.qty < product.stock) {
        setCart(cart.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i)))
      }
    } else {
      setCart([...cart, { productId: product.id, name: product.name, price: product.sellPrice, qty: 1 }])
    }
  }

  const quickAddMultiple = (product, qty) => {
    const existing = cart.find((i) => i.productId === product.id)
    const maxQty = Math.min(qty, product.stock)
    if (existing) {
      const newQty = Math.min(existing.qty + maxQty, product.stock)
      setCart(cart.map((i) => (i.productId === product.id ? { ...i, qty: newQty } : i)))
    } else {
      setCart([...cart, { productId: product.id, name: product.name, price: product.sellPrice, qty: maxQty }])
    }
  }

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((i) => i.productId !== productId))
    } else {
      const product = products.find((p) => p.id === productId)
      if (product && qty <= product.stock) {
        setCart(cart.map((i) => (i.productId === productId ? { ...i, qty } : i)))
      }
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((i) => i.productId !== productId))
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discountVal = Number(discount) || 0
  const finalTotal = Math.max(0, cartTotal - discountVal)

  const handleCheckout = () => {
    if (cart.length === 0) return
    const items = cart.map((i) => ({
      productId: i.productId,
      name: i.name,
      quantity: i.qty,
      price: i.price,
    }))
    const sale = {
      items,
      total: finalTotal,
      paymentMethod,
      customerName: customerName || 'Walk-in',
      discount: discountVal,
    }
    addSale(sale)
    setLastReceipt({ ...sale })
    setCart([])
    setShowCheckout(false)
    setCustomerName('')
    setDiscount('')
  }

  if (lastReceipt) {
    return (
      <div className="pb-safe p-4">
        <div className="bg-gradient-to-br from-green-50 to-forest-50 border border-green-200 rounded-xl p-4">
          <p className="text-center text-green-600 text-4xl mb-2">✓</p>
          <p className="text-center text-stone-700 font-semibold mb-4">Sale Completed!</p>
          <div className="bg-white rounded-lg p-3 space-y-2 mb-4">
            {lastReceipt.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="flex-1">{i.name}</span>
                <span className="font-medium mx-2">{i.quantity} × {fmt(i.price)}</span>
                <span className="font-semibold">{fmt(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          {lastReceipt.discount > 0 && (
            <div className="text-sm text-amber-700 mb-2">Discount: −{fmt(lastReceipt.discount)}</div>
          )}
          <div className="text-lg font-bold text-forest-700 mb-4 text-center">
            Total: {fmt(lastReceipt.total)}
          </div>
          <button
            onClick={() => setLastReceipt(null)}
            className="w-full bg-forest-600 text-white rounded-lg py-3 font-semibold"
          >
            New Sale
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="p-4 space-y-3">

        {/* Favorites row */}
        {favoriteProducts.length > 0 && !showFavorites && (
          <button
            onClick={() => setShowFavorites(true)}
            className="w-full text-xs text-forest-600 font-semibold flex items-center gap-1"
          >
            ⭐ {favoriteProducts.length} Favorites — tap to expand
          </button>
        )}

        {showFavorites && favoriteProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <p className="text-xs font-semibold text-yellow-800 mb-2">Quick Favorites</p>
            <div className="grid grid-cols-2 gap-2">
              {favoriteProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { addToCart(p); setShowFavorites(false) }}
                  className="bg-white border border-yellow-200 rounded-lg p-2 text-left text-xs"
                >
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-yellow-700 font-bold">{fmt(p.sellPrice)}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFavorites(false)}
              className="w-full text-xs text-stone-500 mt-2"
            >
              Hide
            </button>
          </div>
        )}

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />

        {/* Product list */}
        <div className="space-y-2">
          {filtered.map((p) => {
            const isFav = favorites.includes(p.id)
            const inCart = cart.find((i) => i.productId === p.id)
            return (
              <div
                key={p.id}
                className={`bg-white border rounded-lg p-3 ${inCart ? 'border-forest-400 bg-forest-50' : 'border-stone-200'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm text-stone-800 truncate">{p.name}</p>
                      <button onClick={() => addToFavorites(p.id)} className="text-base flex-shrink-0">
                        {isFav ? '⭐' : '☆'}
                      </button>
                      {inCart && (
                        <span className="ml-1 text-xs bg-forest-600 text-white rounded-full px-2 py-0.5 font-bold">
                          ×{inCart.qty}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">{p.category}</p>
                    <p className="text-xs text-stone-500">Stock: {p.stock} {p.unit}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-forest-700">{fmt(p.sellPrice)}</p>
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => quickAddMultiple(p, 1)}
                        className="px-2 py-1 bg-forest-600 text-white text-xs rounded font-semibold"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => quickAddMultiple(p, 5)}
                        className="px-2 py-1 bg-forest-500 text-white text-xs rounded font-semibold"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-8">No products found</p>
          )}
        </div>
      </div>

      {/* Bottom bar — only the checkout button, no list */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-30 px-4 pb-safe pt-3 bg-white border-t border-stone-200 shadow-lg">
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-forest-600 text-white py-3 rounded-xl font-bold text-base flex items-center justify-between px-4"
          >
            <span>🛒 {cart.length} items</span>
            <span>{fmt(cartTotal)} →</span>
          </button>
        </div>
      )}

      {/* Checkout Sheet — cart list + payment details here */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCheckout(false)}>
          <div
            className="bg-white w-full rounded-t-2xl max-w-lg mx-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-stone-300 rounded-full" />
            </div>

            <div className="px-4 pb-2 flex items-center justify-between">
              <p className="font-bold text-lg text-stone-800">Review & Pay</p>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-stone-400 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 space-y-4 pb-4">
              {/* Cart items list */}
              <div className="bg-stone-50 rounded-xl p-3 space-y-2">
                {cart.map((i) => (
                  <div key={i.productId} className="flex items-center gap-2 text-sm">
                    <span className="flex-1 font-medium text-stone-700 truncate">{i.name}</span>
                    <button
                      onClick={() => updateCartQty(i.productId, i.qty - 1)}
                      className="w-6 h-6 rounded border border-stone-300 text-stone-600 flex items-center justify-center text-base"
                    >−</button>
                    <span className="w-6 text-center font-bold text-stone-800">{i.qty}</span>
                    <button
                      onClick={() => updateCartQty(i.productId, i.qty + 1)}
                      className="w-6 h-6 rounded border border-stone-300 text-stone-600 flex items-center justify-center text-base"
                    >+</button>
                    <span className="w-16 text-right font-semibold text-forest-700">{fmt(i.price * i.qty)}</span>
                    <button onClick={() => removeFromCart(i.productId)} className="text-red-400 font-bold text-base">×</button>
                  </div>
                ))}
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-stone-600">Subtotal</span>
                  <span>{fmt(cartTotal)}</span>
                </div>
              </div>

              {/* Customer name */}
              <input
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />

              {/* Discount */}
              <input
                placeholder="Discount (₹)"
                type="number"
                inputMode="decimal"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />

              {/* Payment method */}
              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Card', 'Credit'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 rounded-lg text-sm font-bold border transition ${
                      paymentMethod === m
                        ? 'bg-forest-600 text-white border-forest-600'
                        : 'border-stone-300 text-stone-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-xl p-4 text-white text-center">
                {discountVal > 0 && (
                  <p className="text-forest-200 text-sm line-through mb-1">{fmt(cartTotal)}</p>
                )}
                <p className="text-sm text-forest-100">Amount to Pay</p>
                <p className="text-4xl font-bold">{fmt(finalTotal)}</p>
              </div>
            </div>

            {/* Complete button */}
            <div className="px-4 pt-2 pb-safe">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white rounded-xl py-4 text-base font-bold"
              >
                Complete Sale ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
