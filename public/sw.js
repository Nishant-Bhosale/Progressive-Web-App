importScripts("/src/js/idb.js");
importScripts("/src/js/utility.js");

const STATIC_SW_VERSION = "static-3333";
const DYNAMIC_SW_VERSION = "dynamic-v17";

self.addEventListener("install", (event) => {
	console.log("[Service Worker] Installing Service worker...", event);
	event.waitUntil(
		caches.open(STATIC_SW_VERSION).then((cache) => {
			console.log("[Service Worker] Precaching App Shell");
			cache.addAll([
				"/",
				"/index.html",
				"/offline.html",
				"/src/js/main-app.js",
				"/src/js/feed.js",
				"/src/js/promise.js",
				"/src/js/idb.js",
				"/src/js/utility.js",
				"/src/js/material.min.js",
				"/src/css/app.css",
				"/src/css/feed.css",
				"/src/images/main-image.jpg",
				"https://fonts.googleapis.com/css?family=Roboto:400,700",
				"https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
				"https://fonts.googleapis.com/icon?family=Material+Icons",
			]);
		}),
	);
});

self.addEventListener("activate", (event) => {
	console.log("[Service Worker] Activating Service Worker...", event);

	//Activate Event
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== DYNAMIC_SW_VERSION && key !== STATIC_SW_VERSION) {
						console.log("Removing static cache", key);
						return caches.delete(key);
					}
				}),
			);
		}),
	);
	return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	if (event.request.url.indexOf("http://localhost:5000/posts") > -1) {
		event.respondWith(
			fetch(event.request).then((res) => {
				const clonedResponse = res.clone();

				clearAllData("posts")
					.then(() => {
						return clonedResponse.json();
					})
					.then((data) => {
						console.log(data);
						for (let post of data.posts) {
							console.log(post);
							writeData("posts", post).then(() => {
								console.log("DONE");
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
								return cache.match("/offline.html");
							});
						});
				}
			}),
		);
	}
});

self.addEventListener("sync", (event) => {
	if (event.tag === "sync-new-posts") {
		event.waitUntil(
			readAllData("sync-posts").then((data) => {
				for (let post of data) {
					fetch("http://localhost:5000/post", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							id: post.id,
							title: post.title,
							location: post.location,
							img: post.image,
						}),
					})
						.then((res) => {
							if (res.ok) {
								res.json().then((data) => {
									deleteSingleItem("sync-posts", data.id);
								});
							}
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}),
		);
	}
});

self.addEventListener("notificationclick", (event) => {
	const notification = event.notification;
	const action = event.action;

	console.log(notification);

	if (action === "confirm") {
		console.log("Confirmed Notification");
		notification.close();
	} else {
		console.log(action);
		event.waitUntil(
			//Match all the browser tabs
			clients.matchAll().then((clis) => {
				//Check if a browser tab is open
				let client = clis.find((c) => {
					return c.visibilityState === "visible";
				});

				if (client !== undefined) {
					//Navigate to specified url
					client.navigate("http://localhost:8080");
					client.focus();
				} else {
					//Opens a new browser tab/window
					clients.openWindow("http://localhost:8080");
				}
				notification.close();
			}),
		);
	}
});

self.addEventListener("push", (event) => {
	console.log("Push notification received", event);

	let data = { title: "new", content: "testing" };
	if (event.data) {
		data = JSON.parse(event.data.text());
	}

	const options = {
		body: data.content,
		icon: "/src/images/icons/app-icon-96x96.png",
		badge: "/src/images/icons/app-icon-96x96.png",
	};

	event.waitUntil(self.registration.showNotification(data.title, options));
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
