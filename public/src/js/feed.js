var shareImageButton = document.querySelector("#share-image-button");
var createPostArea = document.querySelector("#create-post");
var sharedMomentsArea = document.querySelector("#shared-moments");

const titleInput = document.getElementById("title");
const locationInput = document.getElementById("location");
const form = document.querySelector("form");

var closeCreatePostModalButton = document.querySelector(
	"#close-create-post-modal-btn",
);

function openCreatePostModal() {
	createPostArea.style.display = "block";

	setTimeout(() => {
		createPostArea.style.transform = "translateY(0)";
	}, 1);

	if (deferredPrompt) {
		deferredPrompt.prompt();

		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "dismissed") {
				console.log("User dismissed");
			} else {
				console.log("User added to homescreen");
			}

			deferredPrompt = false;
		});
	}
}

function clearCards() {
	while (sharedMomentsArea.hasChildNodes()) {
		sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
	}
}

function closeCreatePostModal() {
	createPostArea.style.transform = "translateY(100vh)";
}
shareImageButton.addEventListener("click", openCreatePostModal);

closeCreatePostModalButton.addEventListener("click", closeCreatePostModal);

function createCard(data) {
	var cardWrapper = document.createElement("div");
	cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";
	var cardTitle = document.createElement("div");
	cardTitle.className = "mdl-card__title";
	cardTitle.style.backgroundImage = "url(" + data.image + ")";
	cardTitle.style.backgroundSize = "cover";
	cardTitle.style.height = "180px";
	cardWrapper.appendChild(cardTitle);
	var cardTitleTextElement = document.createElement("h2");
	cardTitleTextElement.style.color = "white";
	cardTitleTextElement.className = "mdl-card__title-text";
	cardTitleTextElement.textContent = data.title;
	cardTitle.appendChild(cardTitleTextElement);
	var cardSupportingText = document.createElement("div");
	cardSupportingText.className = "mdl-card__supporting-text";
	cardSupportingText.textContent = data.location;
	cardSupportingText.style.textAlign = "center";
	// const saveButton = document.createElement('button');
	// saveButton.textContent = 'Save';
	// cardSupportingText.appendChild(saveButton);
	cardWrapper.appendChild(cardSupportingText);
	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
	clearCards();
	for (let i = 0; i < data.length; i++) {
		createCard(data[i]);
	}
}

let networkResponseReceived = false;

fetch("http://localhost:5000/posts")
	.then(function (res) {
		return res.json();
	})
	.then(function (data) {
		networkResponseReceived = true;
		console.log(data);
		console.log("data recieved from network");

		updateUI(data.posts);
	});

if ("indexedDB" in window) {
	readAllData("posts").then((data) => {
		console.log("working");
		if (!networkResponseReceived) {
			console.log("from cache", data);
			updateUI(data);
		}
	});
}

const sendData = () => {
	fetch("http://localhost:5000/post", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		},
		body: JSON.stringify({
			id: new Date().toISOString(),
			title: titleInput.value,
			location: locationInput.value,
			image:
				"https://firebasestorage.googleapis.com/v0/b/progressive-web-app-48a59.appspot.com/o/sf-boat.jpg?alt=media&token=ad790b93-18c6-42e1-9610-2580e4f85e8d",
		}),
	})
		.then((res) => {
			console.log(res, "POSTED successfully");
		})
		.catch((err) => {
			console.log(err);
		});
};

form.addEventListener("submit", function (event) {
	event.preventDefault();

	if (titleInput.value.trim() === "" || locationInput.value.trim() === "") {
		alert("Please enter valid data");
		return;
	}

	closeCreatePostModal();

	if ("serviceWorker" in navigator && "SyncManager" in window) {
		navigator.serviceWorker.ready.then((sw) => {
			//Modified the id
			const post = {
				id: new Date().toISOString(),
				title: titleInput.value,
				location: locationInput.value,
				image:
					"https://firebasestorage.googleapis.com/v0/b/progressive-web-app-48a59.appspot.com/o/sf-boat.jpg?alt=media&token=ad790b93-18c6-42e1-9610-2580e4f85e8d",
			};

			writeData("sync-posts", post)
				.then(() => {
					console.log(post);
					return sw.sync.register("sync-new-posts");
				})
				.then(() => {
					const snackBar = document.getElementById("confirmation-toast");
					const data = { message: "Your post was saved for syncing!" };
					snackBar.MaterialSnackbar.showSnackbar(data);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	} else {
		sendData();
	}
});

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
