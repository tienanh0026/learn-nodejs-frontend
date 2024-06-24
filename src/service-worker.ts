if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then((registration) => {
      console.log('Custom service worker registered with scope:123123', registration.scope);
    })
    .catch((error) => {
      console.error('Error registering custom service worker:', error);
    });
}