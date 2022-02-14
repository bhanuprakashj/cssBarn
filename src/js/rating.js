window.addEventListener('DOMContentLoaded', () => {
	// querySelects all rating container elements in dom
	const ratingElemList = document.querySelectorAll('.rating-container');
	// gets star items dom to fill accordingly in rating containers
	const fullFilledStar = document.querySelector('.rating-full-item').outerHTML;
	const fullEmptyStar = document.querySelector('.rating-empty-item').outerHTML;
	const halfFilledStar = document.querySelector('.rating-half-item').outerHTML;

	// loops thorough rating container elements and adds desired rating items
	ratingElemList.forEach((ratingElem) => {
		const { rating, maxRating } = ratingElem.dataset;
		const fullStars = Math.floor(rating);
		if (maxRating >= fullStars) {
			let fillerStars = maxRating - fullStars;
			// bool to add half star if decimal point is greater than 5
			const isHalfStarNeeded = parseInt(rating.toString().split('.')[1], 10) >= 5;

			// adds full stars to rating container
			ratingElem.insertAdjacentHTML('beforeend', fullFilledStar.repeat(fullStars));

			if (isHalfStarNeeded) {
				ratingElem.insertAdjacentHTML('beforeend', halfFilledStar);
				// since half star is added fillerStars can be reduced by 1
				fillerStars -= 1;
			}

			if (fillerStars) {
				ratingElem.insertAdjacentHTML('beforeend', fullEmptyStar.repeat(fillerStars));
			}
		}
	});
});
