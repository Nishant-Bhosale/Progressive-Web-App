importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const STATIC_SW_VERSION = 'static-v19';
const DYNAMIC_SW_VERSION = 'dynamic-v17';

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
				'/src/js/promise.js',
				'/src/js/idb.js',
				'/src/js/utility.js',
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

self.addEventListener('fetch', (event) => {
	const url =
		'https://progressive-web-app-48a59-default-rtdb.firebaseio.com/posts.json';
	if (event.request.url.indexOf(url) > -1) {
		event.respondWith(
			fetch(event.request).then((res) => {
				const clonedResponse = res.clone();

				clearAllData('posts')
					.then(() => {
						return clonedResponse.json();
					})
					.then((data) => {
						for (let key in data) {
							writeData('posts', data[key]).then(() => {
								deleteSingleItem('posts', key);
							});
						}
					});

				return res;
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
								// trimCache(DYNAMIC_SW_VERSION, 4);
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

// const trimCache = (cacheName, maxLength) => {
// 	caches.open(cacheName).then((cache) => {
// 		return cache.keys().then((keys) => {
// 			if (keys.length > maxLength) {
// 				cache.delete(keys[0]).then(trimCache(cacheName, maxLength));
// 			}
// 		});
// 	});
// };

// importScripts('/src/js/idb.js');

// const dbPromise = idb.open('posts-store', 1, (db) => {
// 	if(!db.objectStoreNames.contains('posts')){
// 		db.createObjectStore('posts', {keyPath: "id"})
// 	}
// })

//sdlfjaklfjdlj

// fetch(event.request).then(res => {
// 	const clonedRes = res.clone();
// 	clonedRes.json().then(data => {
// 		for(let key in data){
// 			dbPromise.then(db => {
// 				const tx = db.transaction('posts', 'readwrite');
// 				const store = tx.objectStore('posts');
// 				store.put(data[key])
// 				return tx.complete;
// 			})
// 		}
// 	})
// 	return res;
// })
