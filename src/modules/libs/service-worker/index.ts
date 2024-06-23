export async function askForPermission() {
  return await Notification.requestPermission();
}

export async function createNotificationSubscription() {
  const serviceWorker = await navigator.serviceWorker.ready;
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_SERVICE_WORKER_PUBLIC,
  });
}

export function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then(function (serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function (pushSubscription) {
      return pushSubscription;
    });
}

export function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}
