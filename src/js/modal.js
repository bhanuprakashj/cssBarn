// body elem
const bodyElem = document.querySelector('body');

// click event listener to body for modal functionality
bodyElem.addEventListener('click', (e) => {
	const clickedModalElem = e.target.closest('.modal');
	const clickedModalContainerElem = e.target.closest('.modal-container');
	const cancelModalElem = e.target.closest('.modal-cancel');
	const closeModalElem = e.target.closest('.modal-close');
	const modalTriggerElem = e.target.closest('.modal-trigger');

	// if modal trigger clicked opens modal based on data attribute id
	if (modalTriggerElem) {
		const modalElem = document.querySelector(`#${modalTriggerElem.dataset.id}`);
		modalElem.classList.add('modal-open');
	}

	// closes modal if clicked outside modal/cancel button/ close icon in modal
	if (!clickedModalElem || cancelModalElem || closeModalElem) {
		clickedModalContainerElem.classList.remove('modal-open');
	}
});
