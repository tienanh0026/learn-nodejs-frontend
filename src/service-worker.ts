import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  const data = event.data?.json()
  if (data.silent) return
  const title = data?.title || 'New Notification'
  const options = {
    body: data?.body || 'You have a new message',
    icon: 'icon.png',
    data: data?.data,
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      const data = event.notification.data
      const roomId = data?.roomId || ''
      for (const client of clientList) {
        if (client.url === `/room/${roomId}` && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow && roomId) {
        return self.clients.openWindow(`/room/${roomId}`)
      }
    })
  )
})
