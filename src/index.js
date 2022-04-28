import * as d3 from "d3";
import css from "./css/index.css";
import Carousel from "./modules/carousel";
import { MATCH_URL, BUTTON_NEXT, BUTTON_PREV } from "./modules/config";
import papaparse from "papaparse";
import { searchYear, isValidYear } from "./modules/search";
import { $ } from "./modules/utility";
import addGoal from "./modules/counter";
import { buildTimeline } from "./modules/timeline";

const entree = document.querySelector("#search-input");
function getTimeLineMatchs(array, evenNumberOfMatch, currentId) {
	const subarray = [];
	const numberOfMatch = evenNumberOfMatch / 2;
	let ind;
	for (let i = 1; i <= numberOfMatch; i++) {
		ind = currentId + i;
		if (currentId + i > 0) ind = (currentId + i) % array.length;
		if (currentId + i == 0) ind = 0;
		subarray.push(array[ind]);
	}
	// not working yet
	// try sorting each array individually and them concat them
	for (let i = numberOfMatch; i > 0; i--) {
		ind = currentId - i;
		if (currentId - i < 0) ind = array.length - Math.abs(0 - currentId - i);
		if (currentId - i == !0) ind = 0;
		subarray.push(array[ind]);
	}
	subarray.push(array[currentId]);
	return subarray.sort((a, b) => {
		if (a.id < b.id) return -1;
		if (a.id > b.id) return 1;
		return 0;
	});
}

let _all_matchs = {};
let _matchsCount;
fetch(MATCH_URL)
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		const parsed_data = csvToJson(data).data;
		_all_matchs = parsed_data;
		_matchsCount = parsed_data.length - 1;
		const carousel = new Carousel(parsed_data, addGoal, {
			customNextButtonElement: BUTTON_NEXT,
			customPrevButtonElement: BUTTON_PREV,
		});

		let currentId = document.querySelector(".splide__slide.is-active").dataset
			.id;
		console.log(getTimeLineMatchs(_all_matchs, 20, 0));
		buildTimeline(_all_matchs.slice(0, 20), currentId);

		// (async function buildTimelineEverySec() {
		// 	while (true) {
		// 		await new Promise((resolve) => setTimeout(resolve, 1000));
		// 		const matchs = getTimeLineMatchs(_all_matchs, 20, currentId);
		// 		buildTimeline(matchs, currentId);
		// 		currentId++;
		// 	}
		// })();

		entree.addEventListener("input", (event) => {
			const searchedYear = parseInt(event.target.value);
			if (isValidYear(searchedYear)) {
				// searchYear(searchedYear);
				let i = 0;

				const keepSearching = (index, target) => {
					const year = parseInt(parsed_data[index].date.split("-")[0]);
					const boolean = year == target || year > target ? false : true;
					return boolean;
				};

				while (keepSearching(i, searchedYear)) {
					i++;
				}

				const activeIndex = i;
				const prevIndex = activeIndex - 1 < 0 ? _matchsCount : activeIndex - 1;
				const nextIndex = activeIndex + 1 > _matchsCount ? 0 : activeIndex + 1;

				const prevMatch = _all_matchs[prevIndex];
				const activeMatch = _all_matchs[activeIndex];
				const nextMatch = _all_matchs[nextIndex];

				const prevMatchHtml = $(".splide__slide.is-prev");
				const activeMatchHtml = $(".splide__slide.is-active");
				const nextMatchHtml = $(".splide__slide.is-next");

				carousel.setMatchData(prevMatch, prevIndex, prevMatchHtml);
				carousel.setMatchData(activeMatch, activeIndex, activeMatchHtml);
				carousel.setMatchData(nextMatch, nextIndex, nextMatchHtml);
				addGoal(_all_matchs[activeIndex].goals);
			}
		});
	})
	.catch(function (error) {
		console.log(error);
	});

function csvToJson(data) {
	const parsed_matchs = papaparse.parse(data, {
		columns: true,
		delimiter: ",",
		header: true,
		dynamicTyping: true,
	});
	return parsed_matchs;
}
