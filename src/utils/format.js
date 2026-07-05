import { getCurrency } from '../data/currencies'

// amountInINR: number stored in base currency (INR)
// Converts to target currency using rate (units of target per 1 INR)
export function convert(amountInINR, currencyCode, currencies) {
  const cur = getCurrency(currencyCode, currencies)
  return amountInINR * cur.rate
}

export function formatMoney(amountInINR, currencyCode, currencies) {
  const cur = getCurrency(currencyCode, currencies)
  const converted = convert(amountInINR, currencyCode, currencies)
  const decimals = ['JPY', 'KRW', 'IDR', 'VND'].includes(currencyCode) ? 0 : 2
  const formatted = converted.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${cur.symbol}${formatted}`
}

export function formatDate(ts) {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
