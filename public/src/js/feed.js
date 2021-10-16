var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector(
	'#close-create-post-modal-btn',
);

function openCreatePostModal() {
	createPostArea.style.display = 'block';
	if (deferredPrompt) {
		deferredPrompt.prompt();

		deferredPrompt.userChoice.then((choiceResult) => {
			console.log(choiceResult.outcome);

			if (choiceResult.outcome === 'dismissed') {
				console.log('User dismissed');
			} else {
				console.log('User added to homescreen');
			}

			deferredPrompt = false;
		});
	}
}

function closeCreatePostModal() {
	createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
