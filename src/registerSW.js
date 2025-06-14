import { registerSW as registerServiceWorker } from 'virtual:pwa-register'

export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    const updateSW = registerServiceWorker({
      onNeedRefresh() {
        if (confirm('Este disponibilă o nouă versiune. Doriți să actualizați?')) {
          updateSW(true)
        }
      },
      onOfflineReady() {
        console.log('Aplicația este pregătită pentru utilizare offline')
      },
    })
  }
}
