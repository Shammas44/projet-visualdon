import { nth } from "lodash";
import addGoal from "./counter";
import { buildTimeline } from "./timeline";
import { _id } from "..";
import Carousel from "./carousel";
import { BUTTON_NEXT, BUTTON_PREV, WRAPPER } from "./config";
const ANNEEDEBUT = 1905;
const ANNEEFIN = 2021;
const entree = document.querySelector("#search-input");
const info = document.querySelector(".info");

export function isValidYear(year) {
	return year >= ANNEEDEBUT && year <= ANNEEFIN ? true : false;
}

export function getTimeLineMatchs(array, evenNumberOfMatch, currentId) {
	const subarray = [];
	const numberOfMatch = evenNumberOfMatch / 2;
	let ind = currentId;
	for (let i = numberOfMatch; i > 0; i--) {
		ind = currentId - i;
		subarray.push(nth(array, ind));
	}
	subarray.push(array[currentId]);
	ind = currentId;
	for (let i = 1; i <= numberOfMatch; i++) {
		ind =
			ind + 1 > array.length - 1
				? Math.abs(array.length - 1 - ind + 1)
				: ind + 1;
		subarray.push(array[ind]);
	}
	console.log({ subarray }, { currentId });
	return subarray;
}

export function doesMatchesExist(searchedYear, parsed_data) {
	let i = 0;
	let message = "";
	const keepSearching = (index, target) => {
		const year = parseInt(parsed_data[index].date.split("-")[0]);
		const notInArray = year > target ? true : false;
		message = notInArray
			? "<p>Il n'y a pas de matchs pour cette année</p>"
			: "";
		const boolean = year == target || year > target ? false : true;
		return boolean;
	};

	while (keepSearching(i, searchedYear)) {
		i++;
	}
	return { message, i };
}

export function setSearchEvent(all_matchs) {
	entree.addEventListener("input", (event) => {
		const searchedYear = parseInt(event.target.value);
		const matchsCount = all_matchs.length - 1;
		if (isValidYear(searchedYear)) {
			const { message, i } = doesMatchesExist(searchedYear, all_matchs);
			const activeIndex = i;
			const prevIndex = activeIndex - 1 < 0 ? matchsCount : activeIndex - 1;
			const nextIndex = activeIndex + 1 > matchsCount ? 0 : activeIndex + 1;
			// document.querySelectorAll("li[data-id]").forEach((li) => {
			// 	li.remove();
			// });
			const wrapper = document.querySelector(".wrapper--carousel");
			const template = document
				.querySelector(".carousel-template")
				.content.cloneNode(true);
			wrapper.innerHTML = "";
			wrapper.appendChild(template);
			WRAPPER.item = document.querySelector(".splide__list");
			const startingIndexes = [prevIndex, activeIndex, nextIndex];
			const carousel = new Carousel(all_matchs, addGoal, startingIndexes, {
				customNextButtonElement: BUTTON_NEXT,
				customPrevButtonElement: BUTTON_PREV,
			});
			buildTimeline(
				getTimeLineMatchs(all_matchs, 20, activeIndex),
				activeIndex
			);
			addGoal(all_matchs[activeIndex].goals);
			_id.id = activeIndex;
			info.innerHTML = message;
		} else {
			info.innerHTML = `<p>L'année doit être comprise entre <b>${ANNEEDEBUT} et ${ANNEEFIN}</b></p`;
		}
	});
}
