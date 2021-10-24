const dbPromise = idb.open('posts-store', 1, (db) => {
	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', { keyPath: 'id' });
	}
});

const writeData = (st, data) => {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, 'readwrite');
		const store = tx.objectStore('posts');
		store.put(data);
		return tx.complete;
	});
};

const readAllData = (st) => {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, 'read');
		const store = tx.objectStore('posts');
		return store.getAll();
	});
};
