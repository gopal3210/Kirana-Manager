import React from 'react'
import { useApp } from '../context/AppContext'

export default function Header({ title }) {
  const { settings } = useApp()
  return (
    <header className="sticky top-0 z-30 bg-forest-700 text-white px-4 pt-4 pb-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-forest-200">{settings.shopName || 'Kirana Manager'}</p>
      <h1 className="text-xl font-bold leading-tight">{title}</h1>
    </header>
  )
}
