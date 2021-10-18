self.addEventListener('install', (event) => {
	console.log('[Service Worker] Installing Service worker...', event);
	event.waitUntil(
		caches.open('static').then((cache) => {
			console.log('[Service Worker] Precaching App Shell');
			cache.addAll([
				'/',
				'/index.html',
				'/src/js/app.js',
				'/src/js/feed.js',
				'/src/js/material.min.js',
				'/src/css/app.css',
				'/src/css/feed.css',
				'/src/images/main-image.jpg',
				'https://fonts.googleapis.com/css?family=Roboto:400,700',
				'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
				'https://fonts.googleapis.com/icon?family=Material+Icons',
			]);
		}),
	);
});

self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activating Service Worker...', event);

	return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	caches.keys().then((keys) => {
		console.log(keys);
	});
	event.respondWith(
		caches.match(event.request).then((response) => {
			console.log(response);
			if (response) {
				return response;
			} else {
				return fetch(event.request);
			}
		}),
	);
});
