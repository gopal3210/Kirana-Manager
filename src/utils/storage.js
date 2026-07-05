const PREFIX = 'kirana_'

export function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load', key, e)
    return fallback
  }
}

export function saveData(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save', key, e)
  }
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
