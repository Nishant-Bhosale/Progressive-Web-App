var deferredPrompt;

if ('serviceWorker' in navigator) {
	//checks if the browser provides support for service workers
	navigator.serviceWorker
		.register('/sw.js') //second param { scope: 'path of sw'} to overwrite scope of the sw
		.then(() => {
			console.log('Service Worker Registered');
		})
		.catch((e) => {
			console.log(e);
		});
}

window.addEventListener('beforeinstallprompt', (event) => {
	console.log('beforeinstallprompt fired...');
	event.preventDefault();
	deferredPrompt = event;
	return false;
});
