var deferredPrompt;

const enableNotificationButtons = document.querySelectorAll(
	".enable-notifications",
);

if ("serviceWorker" in navigator) {
	//checks if the browser provides support for service workers
	navigator.serviceWorker
		.register("/sw.js") //second param { scope: 'path of sw'} to overwrite scope of the sw
		.then(() => {
			console.log("Service Worker Registered");
		})
		.catch((e) => {
			console.log(e);
		});
}

window.addEventListener("beforeinstallprompt", (event) => {
	console.log("beforeinstallprompt fired...");
	event.preventDefault();
	deferredPrompt = event;
	return false;
});

const grantPermission = () => {
	console.log("EE");
	Notification.requestPermission((result) => {
		if (result !== "granted") {
			console.log("Notifications not required");
		} else {
			console.log("Permission granted");
		}
	});
};

if ("Notification" in window) {
	for (let i = 0; i < enableNotificationButtons.length; i++) {
		enableNotificationButtons[i].style.display = "inline-block";
		enableNotificationButtons[i].addEventListener("click", grantPermission);
	}
}
