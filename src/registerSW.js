export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    // Service worker registration is disabled for now
    // Will be re-enabled when vite-plugin-pwa is properly configured
    console.log('Service worker registration is currently disabled')
  }
}
