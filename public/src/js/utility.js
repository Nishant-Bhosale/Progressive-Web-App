const dbPromise = idb.open('posts-store', 1, (db) => {
	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', { keyPath: 'id' });
	}
});

const writeData = (st, data) => {
	dbPromise.then((db) => {
		const tx = db.transaction(st, 'readwrite');
		const store = tx.openStore('posts');
		store.put(data);
		return tx.complete;
	});
};
