import { ref, watch } from 'vue'

/**
 * Reaktiver Wert, der automatisch in localStorage gespeichert wird.
 * Alle localStorage-Zugriffe der App passieren nur hier.
 *
 * @template T
 * @param {string} key          Schlüssel in localStorage
 * @param {T} defaultValue      Startwert, falls noch nichts gespeichert ist
 * @returns {import('vue').Ref<T>}
 */
export function useLocalStorage(key, defaultValue) {
  const value = /** @type {import('vue').Ref<T>} */ (ref(load(key, defaultValue)))

  // deep: true, damit auch Änderungen innerhalb des Arrays (z. B. unshift) gespeichert werden
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  return value
}

/**
 * @template T
 * @param {string} key
 * @param {T} defaultValue
 * @returns {T}
 */
function load(key, defaultValue) {
  const raw = localStorage.getItem(key)
  if (raw === null) return defaultValue

  try {
    return JSON.parse(raw)
  } catch {
    // kaputte Daten im Storage -> lieber mit dem Startwert weitermachen als abstürzen
    return defaultValue
  }
}
