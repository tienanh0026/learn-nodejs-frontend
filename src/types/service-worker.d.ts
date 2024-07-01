interface Window {
  registration: ServiceWorkerRegistration
}

interface ServiceWorkerGlobalScopeEventMap extends ServiceWorkerGlobalScope {
  notificationclick: NotificationEvent
}

declare let self: ServiceWorkerGlobalScope & typeof globalThis
