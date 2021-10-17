self.addEventListener('install', (event) => {
	console.log('[Service Worker] Installing Service worker...', event);
});

self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activating Service Worker...', event);

	return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	event.respondWith(fetch(event.request));
});
