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

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) setFavorites(JSON.parse(saved))
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
    localStorage.setItem('favorites', JSON.stringify(updated))
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
      removeFromCart(productId)
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

  const clearCart = () => {
    if (cart.length > 0 && confirm('Clear cart?')) {
      setCart([])
    }
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
      <div className="pb-6">
        <div className="p-4">
          <div className="bg-gradient-to-br from-green-50 to-forest-50 border border-green-200 rounded-xl p-4">
            <p className="text-center text-green-600 text-4xl mb-2">✓</p>
            <p className="text-center text-stone-700 font-semibold mb-4">Sale Completed!</p>
            <div className="bg-white rounded-lg p-3 space-y-2 mb-4">
              {lastReceipt.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{i.name}</span>
                  <span className="font-medium">{i.quantity} × {fmt(i.price)}</span>
                  <span className="font-semibold">{fmt(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            {lastReceipt.discount > 0 && (
              <div className="text-sm text-amber-700 mb-2">Discount: −{fmt(lastReceipt.discount)}</div>
            )}
            <div className="text-lg font-bold text-forest-700 mb-4 text-center">Total: {fmt(lastReceipt.total)}</div>
            <button
              onClick={() => setLastReceipt(null)}
              className="w-full bg-forest-600 text-white rounded-lg py-2 font-semibold"
            >
              New Sale
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-40">
      <div className="p-4 space-y-3">
        {/* Quick Favorite Products */}
        {favoriteProducts.length > 0 && !showFavorites && (
          <div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="w-full text-xs text-forest-600 font-semibold mb-2 flex items-center gap-1"
            >
              ⭐ {favoriteProducts.length} Favorites - Click to expand
            </button>
          </div>
        )}

        {showFavorites && favoriteProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 space-y-1">
            <p className="text-xs font-semibold text-yellow-800 mb-2">Quick Favorites</p>
            <div className="grid grid-cols-2 gap-2">
              {favoriteProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    addToCart(p)
                    setShowFavorites(false)
                  }}
                  className="bg-white border border-yellow-200 rounded-lg p-2 text-left text-xs hover:bg-yellow-50"
                >
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-yellow-700 font-bold">{fmt(p.sellPrice)}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFavorites(false)}
              className="w-full text-xs text-stone-600 mt-2"
            >
              Hide Favorites
            </button>
          </div>
        )}

        {/* Search Bar */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />

        {/* Products List */}
        <div className="space-y-2">
          {filtered.map((p) => {
            const isFav = favorites.includes(p.id)
            return (
              <div key={p.id} className="bg-white border border-stone-200 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm text-stone-800 truncate">{p.name}</p>
                      <button
                        onClick={() => addToFavorites(p.id)}
                        className="text-lg flex-shrink-0"
                      >
                        {isFav ? '⭐' : '☆'}
                      </button>
                    </div>
                    <p className="text-xs text-stone-400">{p.category}</p>
                    <p className="text-xs text-stone-600">Stock: {p.stock} {p.unit}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-forest-700">{fmt(p.sellPrice)}</p>
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => quickAddMultiple(p, 1)}
                        className="px-2 py-1 bg-forest-600 text-white text-xs rounded font-semibold hover:bg-forest-700"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => quickAddMultiple(p, 5)}
                        className="px-2 py-1 bg-forest-500 text-white text-xs rounded font-semibold hover:bg-forest-600"
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

      {/* Cart Panel */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg max-h-[50vh] flex flex-col z-30 max-w-lg mx-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100 bg-forest-50">
            <p className="font-semibold text-sm text-stone-800">Cart ({cart.length})</p>
            <button
              onClick={clearCart}
              className="text-xs text-red-600 font-semibold hover:text-red-700"
            >
              Clear
            </button>
          </div>
          <div className="overflow-y-auto px-4 pt-2 space-y-1 flex-1">
            {cart.map((i) => (
              <div key={i.productId} className="flex items-center justify-between text-xs bg-stone-50 p-2 rounded">
                <span className="flex-1 truncate font-medium">{i.name}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateCartQty(i.productId, i.qty - 1)} className="w-5 h-5 rounded border text-stone-600">−</button>
                  <span className="w-5 text-center font-bold">{i.qty}</span>
                  <button onClick={() => updateCartQty(i.productId, i.qty + 1)} className="w-5 h-5 rounded border text-stone-600">+</button>
                  <span className="w-14 text-right font-bold text-forest-700">{fmt(i.price * i.qty)}</span>
                  <button onClick={() => removeFromCart(i.productId)} className="text-red-500 font-bold">×</button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-stone-100 bg-stone-50">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-stone-600">Subtotal:</span>
              <span className="font-semibold">{fmt(cartTotal)}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-forest-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-forest-700"
            >
              Checkout ({cart.length} items)
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 space-y-3 max-w-lg mx-auto animate-slideup">
            <p className="font-bold text-lg text-stone-800">Complete Sale</p>
            <input
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <input
              placeholder="Discount (₹)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              {['Cash', 'Card', 'Credit'].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 rounded-lg text-sm font-bold border transition ${
                    paymentMethod === m ? 'bg-forest-600 text-white border-forest-600' : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="bg-gradient-to-r from-forest-50 to-stone-50 p-3 rounded-lg">
              <p className="text-stone-600 text-sm">Amount to Pay</p>
              <p className="text-3xl font-bold text-forest-700">{fmt(finalTotal)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 border border-stone-300 rounded-lg py-2 text-sm text-stone-600 font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-bold hover:bg-green-700"
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
