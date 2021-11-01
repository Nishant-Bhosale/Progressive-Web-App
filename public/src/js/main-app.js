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

const displayConfirmNotification = () => {
	if ("serviceWorker" in navigator) {
		const options = {
			body: "You successfully subscribed our Notification",
			icon: "/src/images/icons/app-icon-96x96.png",
			image: "/src/images/sf-boat.jpg",
			dir: "ltr",
			lang: "en-US", //BCP 47
			vibrate: [100, 50, 200],
			badge: "/src/images/icons/app-icon-96x96.png",
			tag: "confirm-notification",
			renotify: false,
			actions: [
				{
					action: "confirm",
					title: "OK",
					icon: "/src/images/icons/app-icon-96x96.png",
				},
				{
					action: "cancel",
					title: "Cancel",
					icon: "/src/images/icons/app-icon-96x96.png",
				},
			],
		};

		navigator.serviceWorker.ready.then((swreg) => {
			swreg.showNotification("Successfully Subscribed", options);
		});
	}
};

const grantPermission = () => {
	Notification.requestPermission((result) => {
		if (result === "granted") {
			displayConfirmNotification();
			console.log("Permission granted");
		} else {
			console.log("Notifications not required");
			if (Notification.permission === "denied") {
				Notification.requestPermission((res) => {
					if (res === "granted") {
						displayConfirmNotification();
					}
				});
			}
		}
	});
};

if ("Notification" in window) {
	for (let i = 0; i < enableNotificationButtons.length; i++) {
		enableNotificationButtons[i].style.display = "inline-block";
		enableNotificationButtons[i].addEventListener("click", grantPermission);
	}
}
