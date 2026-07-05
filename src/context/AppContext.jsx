import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
}

const DEFAULT_SETTINGS = {
  lowStockThreshold: 5,
  currency: 'INR',
  businessName: 'My Kirana Store',
  ownerName: '',
  phone: '',
  address: '',
}

export function AppProvider({ children }) {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [expenses, setExpenses] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kirana-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setProducts(data.products || [])
        setSales(data.sales || [])
        setExpenses(data.expenses || [])
        setSettings(data.settings || DEFAULT_SETTINGS)
      } catch (e) {
        console.error('Failed to load saved data:', e)
      }
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    const data = { products, sales, expenses, settings }
    localStorage.setItem('kirana-data', JSON.stringify(data))
  }, [products, sales, expenses, settings])

  // Product operations
  const addProduct = (product) => {
    const newProduct = {
      id: Date.now().toString(),
      ...product,
      createdAt: new Date().toISOString(),
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id, updates) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  // Sales operations
  const addSale = (sale) => {
    const newSale = {
      id: Date.now().toString(),
      ...sale,
      timestamp: new Date().getTime(),
    }
    setSales([...sales, newSale])

    // Reduce stock
    sale.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        updateProduct(item.productId, {
          stock: product.stock - item.quantity,
        })
      }
    })
  }

  const deleteSale = (id) => {
    const sale = sales.find((s) => s.id === id)
    if (sale) {
      // Restore stock
      sale.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product) {
          updateProduct(item.productId, {
            stock: product.stock + item.quantity,
          })
        }
      })
      setSales(sales.filter((s) => s.id !== id))
    }
  }

  // Expenses operations
  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      timestamp: new Date().getTime(),
    }
    setExpenses([...expenses, newExpense])
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  // Settings operations
  const updateSettings = (updates) => {
    setSettings({ ...settings, ...updates })
  }

  const value = {
    // Data
    products,
    sales,
    expenses,
    settings,
    currencies: CURRENCIES,

    // Product actions
    addProduct,
    updateProduct,
    deleteProduct,

    // Sales actions
    addSale,
    deleteSale,

    // Expenses actions
    addExpense,
    deleteExpense,

    // Settings actions
    updateSettings,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
