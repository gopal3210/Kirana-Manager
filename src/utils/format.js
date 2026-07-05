export function formatMoney(amount, currency = 'INR', currencies = {}) {
  const curr = currencies[currency] || { symbol: '₹' }
  
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0
  }
  
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return `${curr.symbol}${formatted}`
}

export function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(timestamp) {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`
}
