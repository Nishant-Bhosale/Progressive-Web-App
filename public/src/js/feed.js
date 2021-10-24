var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var sharedMomentsArea = document.querySelector('#shared-moments');

var closeCreatePostModalButton = document.querySelector(
	'#close-create-post-modal-btn',
);

function openCreatePostModal() {
	createPostArea.style.display = 'block';
	if (deferredPrompt) {
		deferredPrompt.prompt();

		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'dismissed') {
				console.log('User dismissed');
			} else {
				console.log('User added to homescreen');
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
	createPostArea.style.display = 'none';
}
shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard(data) {
	var cardWrapper = document.createElement('div');
	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
	var cardTitle = document.createElement('div');
	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url(' + data.image + ')';
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);
	var cardTitleTextElement = document.createElement('h2');
	cardTitleTextElement.style.color = 'white';
	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = data.title;
	cardTitle.appendChild(cardTitleTextElement);
	var cardSupportingText = document.createElement('div');
	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = data.location;
	cardSupportingText.style.textAlign = 'center';
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

const url =
	'https://progressive-web-app-48a59-default-rtdb.firebaseio.com/posts.json';

let networkResponseReceived = false;

fetch(url)
	.then(function (res) {
		return res.json();
	})
	.then(function (data) {
		networkResponseReceived = true;
		console.log('data recieved from network');

		let updatedData = [];

		for (let key in data) {
			updatedData.push(data[key]);
		}

		updateUI(updatedData);
	});

if ('indexedDB' in window) {
	readAllData('posts').then((data) => {
		console.log('working');
		if (!networkResponseReceived) {
			console.log('from cache', data);
			updateUI(data);
		}
	});
}
