const dbPromise = idb.open("posts-store", 1, (db) => {
	if (!db.objectStoreNames.contains("posts")) {
		db.createObjectStore("posts", { keyPath: "id" });
	}

	if (!db.objectStoreNames.contains("sync-posts")) {
		db.createObjectStore("sync-posts", { keyPath: "id" });
	}
});

const writeData = (st, data) => {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.put(data);
		return tx.complete;
	});
};

const readAllData = (st) => {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readonly");
		const store = tx.objectStore(st);
		return store.getAll();
	});
};

const clearAllData = (st) => {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.clear();
		return tx.complete;
	});
};

const deleteSingleItem = (st, key) => {
	dbPromise
		.then((db) => {
			const tx = db.transaction(st, "readwrite");
			const store = tx.objectStore(st);
			store.delete(key);
			return tx.complete;
		})
		.then(() => {
			console.log("DELETED successfully");
		});
};

function urlBase64ToUint8Array(base64String) {
	var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

	console.log(base64String);
	var rawData = window.atob(base64);
	var outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}

	console.log(outputArray);
	return outputArray;
}
