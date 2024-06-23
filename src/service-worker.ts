declare const self: ServiceWorkerGlobalScope;

self.addEventListener("fetch", (e: FetchEvent) => {
  e.respondWith(
    (async () => {
      // Handling fetch
      console.log(`Handling req for '${e.request.url}'`);
      //   const cachedRes = await caches.match(e.request, {
      //     cacheName: CACHE_NAME,
      //   });
      //   if (cachedRes) {
      //     console.log(`Serving cached response for '${e.request.url}'`);
      //   }
      return await fetch(e.request);
    })()
  );
});

export default null;
