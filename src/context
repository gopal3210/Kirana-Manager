import React, { createContext, useContext, useEffect, useState } from 'react'
import { loadData, saveData, newId } from '../utils/storage'
import { DEFAULT_CURRENCIES } from '../data/currencies'

const AppContext = createContext(null)

const DEFAULT_SETTINGS = {
  shopName: 'My Kirana Store',
  ownerName: '',
  phone: '',
  address: '',
  currency: 'INR',
  lowStockThreshold: 5,
  lastRateUpdate: null,
}

export function AppProvider({ children }) {
  const [products, setProducts] = useState(() => loadData('products', []))
  const [sales, setSales] = useState(() => loadData('sales', []))
  const [expenses, setExpenses] = useState(() => loadData('expenses', []))
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...loadData('settings', {}) }))
  const [currencies, setCurrencies] = useState(() => loadData('currencies', DEFAULT_CURRENCIES))
  const [cart, setCart] = useState([])

  useEffect(() => saveData('products', products), [products])
  useEffect(() => saveData('sales', sales), [sales])
  useEffect(() => saveData('expenses', expenses), [expenses])
  useEffect(() => saveData('settings', settings), [settings])
  useEffect(() => saveData('currencies', currencies), [currencies])

  // Products
  const addProduct = (p) => setProducts((prev) => [...prev, { ...p, id: newId() }])
  const updateProduct = (id, patch) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id))

  // Cart
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { productId: product.id, name: product.name, price: product.sellPrice, qty }]
    })
  }
  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId))
    } else {
      setCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)))
    }
  }
  const removeFromCart = (productId) => setCart((prev) => prev.filter((i) => i.productId !== productId))
  const clearCart = () => setCart([])

  // Checkout -> creates a sale, decrements stock
  const checkout = ({ paymentMethod = 'Cash', customerName = '', discount = 0 } = {}) => {
    if (cart.length === 0) return null
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0) - discount
    const sale = {
      id: newId(),
      timestamp: Date.now(),
      items: cart,
      total: Math.max(0, total),
      discount,
      paymentMethod,
      customerName,
    }
    setSales((prev) => [sale, ...prev])
    setProducts((prev) =>
      prev.map((p) => {
        const item = cart.find((i) => i.productId === p.id)
        return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p
      })
    )
    clearCart()
    return sale
  }

  const deleteSale = (id) => setSales((prev) => prev.filter((s) => s.id !== id))

  // Expenses
  const addExpense = (e) => setExpenses((prev) => [{ ...e, id: newId(), timestamp: Date.now() }, ...prev])
  const deleteExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  const value = {
    products, addProduct, updateProduct, deleteProduct,
    sales, deleteSale,
    expenses, addExpense, deleteExpense,
    settings, setSettings,
    currencies, setCurrencies,
    cart, addToCart, updateCartQty, removeFromCart, clearCart, checkout,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
