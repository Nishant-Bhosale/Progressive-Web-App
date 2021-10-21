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

function createCard() {
	var cardWrapper = document.createElement('div');
	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
	var cardTitle = document.createElement('div');
	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);
	var cardTitleTextElement = document.createElement('h2');
	cardTitleTextElement.style.color = 'white';
	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = 'San Francisco Trip';
	cardTitle.appendChild(cardTitleTextElement);
	var cardSupportingText = document.createElement('div');
	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = 'In San Francisco';
	cardSupportingText.style.textAlign = 'center';
	// const saveButton = document.createElement('button');
	// saveButton.textContent = 'Save';
	// cardSupportingText.appendChild(saveButton);
	cardWrapper.appendChild(cardSupportingText);
	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
}

const url = 'https://httpbin.org/get';
let networkResponseReceived = false;

fetch(url)
	.then(function (res) {
		return res.json();
	})
	.then(function (data) {
		networkResponseReceived = true;
		console.log('data recieved from network');
		clearCards();
		createCard();
	});

if ('caches' in window) {
	caches
		.match(url)
		.then((response) => {
			if (response) {
				return response.json();
			}
		})
		.then((data) => {
			if (!networkResponseReceived) {
				console.log('data recieved from cache');
				clearCards();
				createCard();
			}
		});
}
