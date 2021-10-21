const STATIC_SW_VERSION = 'static-v6';
const DYNAMIC_SW_VERSION = 'dynamic-v6';

self.addEventListener('install', (event) => {
	console.log('[Service Worker] Installing Service worker...', event);
	event.waitUntil(
		caches.open(STATIC_SW_VERSION).then((cache) => {
			console.log('[Service Worker] Precaching App Shell');
			cache.addAll([
				'/',
				'/index.html',
				'/offline.html',
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

	//Activate Event
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== DYNAMIC_SW_VERSION && key !== STATIC_SW_VERSION) {
						console.log('Removing static cache', key);
						return caches.delete(key);
					}
				}),
			);
		}),
	);
	return self.clients.claim();
});

// self.addEventListener('fetch', (event) => {
// 	event.respondWith(
// 		caches.match(event.request).then((response) => {
// 			if (response) {
// 				return response;
// 			} else {
// 				return fetch(event.request)
// 					.then((res) => {
// 						return caches.open(DYNAMIC_SW_VERSION).then((cache) => {
// 							cache.put(event.request.url, res.clone());
// 							return res;
// 						});
// 					})
// 					.catch((err) => {
// 						console.log(err);
// 						return caches.open(STATIC_SW_VERSION).then((cache) => {
// 							return cache.match('/offline.html');
// 						});
// 					});
// 			}
// 		}),
// 	);
// });

// self.addEventListener('fetch', (event) => {
// 	event.respondWith(
// 		fetch(event.request)
// 			.then((response) => {
// 				return caches.open(DYNAMIC_SW_VERSION).then((cache) => {
// 					cache.put(event.request.url, response.clone());
// 					return response;
// 				});
// 			})
// 			.catch((err) => {
// 				return caches.match(event.request);
// 			}),
// 	);
// });

self.addEventListener('fetch', (event) => {
	const url = 'https://httpbin.org/get';
	if (event.request.url.indexOf(url) > -1) {
		event.respondWith(
			caches.open(DYNAMIC_SW_VERSION).then((cache) => {
				return fetch(event.request).then((res) => {
					cache.put(event.request, res.clone());
					return res;
				});
			}),
		);
	} else {
		event.respondWith(
			caches.match(event.request).then((response) => {
				if (response) {
					return response;
				} else {
					return fetch(event.request)
						.then((res) => {
							return caches.open(DYNAMIC_SW_VERSION).then((cache) => {
								cache.put(event.request.url, res.clone());
								return res;
							});
						})
						.catch((err) => {
							console.log(err);
							return caches.open(STATIC_SW_VERSION).then((cache) => {
								if (event.request.headers.get('accept').includes('text/html')) {
									return cache.match('/offline.html');
								}
							});
						});
				}
			}),
		);
	}
});
