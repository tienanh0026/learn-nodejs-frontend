export async function askForPermission() {
  return await Notification.requestPermission();
}

export async function askUserPermission() {
  return await Notification.requestPermission();
}

export async function createNotificationSubscription() {
  const serviceWorker = await navigator.serviceWorker.ready;
  console.log(import.meta.env.VITE_SERVICE_WORKER_PUBLIC);
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

// export function registerServiceWorker() {
//   if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//       const isDev = import.meta.env.MODE === "development";
//       const origin = window.location.origin;
//       console.log(isDev);

//       navigator.serviceWorker
//         .register(
//           isDev ? origin + "/src/service-worker.ts" : "/service-worker.js"
//         )
//         .then((registration: ServiceWorkerRegistration) => {
//           console.log("Service worker registered:", registration);
//         })
//         .catch((error: Error) => {
//           console.error("Failed to register service worker:", error);
//         });
//     });
//   }
//   // if ("serviceWorker" in navigator) {
//   //   window.addEventListener("load", () => {
//   //     navigator.serviceWorker
//   //       .register("/service-worker.js")
//   //       .then((registration) => {
//   //         console.log(
//   //           "ServiceWorker registration successful with scope: ",
//   //           registration.scope
//   //         );
//   //       })
//   //       .catch((error) => {
//   //         console.error("ServiceWorker registration failed: ", error);
//   //       });
//   //   });
//   // }
// }
