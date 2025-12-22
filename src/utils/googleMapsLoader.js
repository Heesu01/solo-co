let loadingPromise = null

export function loadGoogleMaps({ libraries = [] } = {}) {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps)
  }

  if (loadingPromise) return loadingPromise

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return Promise.reject(new Error('Google Maps API key is missing'))
  }

  const libParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : ''

  const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${libParam}&v=weekly`

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true

    script.onload = () => {
      if (!window.google?.maps) {
        reject(new Error('Google Maps failed to load'))
        return
      }
      resolve(window.google.maps)
    }

    script.onerror = () => reject(new Error('Google Maps script load error'))

    document.head.appendChild(script)
  })

  return loadingPromise
}
