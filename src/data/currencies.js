// Base currency for all stock/price entry is always INR.
// "rate" = how many units of that currency equal 1 INR.
// These are approximate defaults — editable in Settings, or refreshable via live fetch.

export const DEFAULT_CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.012 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.011 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0095 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 1.85 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 0.018 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.0165 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.0105 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 0.086 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 0.044 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rate: 0.045 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 0.0162 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 0.053 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 0.42 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 190 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 16.5 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 1.1 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 0.065 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 0.22 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 0.020 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rate: 0.21 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 0.68 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 300 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', rate: 1.3 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 3.3 },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू', rate: 1.6 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', rate: 3.5 },
]

export function getCurrency(code, currencies = DEFAULT_CURRENCIES) {
  return currencies.find((c) => c.code === code) || currencies[0]
}
