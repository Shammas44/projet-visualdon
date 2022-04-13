import * as d3 from "d3";
import css from "./css/index.css";
import Carousel from "./modules/carousel";
import { MATCH_URL, BUTTON_NEXT, BUTTON_PREV } from "./modules/config";
import papaparse from "papaparse";
import { searchYear, isValidYear } from "./modules/search";
import { $ } from "./modules/utility";
import addGoal from "./modules/counter";
import { foo } from "./modules/timeline";

const entree = document.querySelector("#search-input");

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

		foo(_all_matchs);

		const currentID = document.querySelector('.splide__slide.is-active').dataset.id

		
		function getTimeLineMatchs(id, evenNumberofMatch){
			const tabMatch = []

			const nextIndex = currentID + 1

			for(let i=0; i <= evenNumberofMatch/2 ; i++){

			if(nextIndex >_all_matchs.length -1){
				currentID = Math.abs((_all_matchs.length - 1) - nextIndex - 1)
			}
			tabMatch.push[nextIndex]
			}

			for(let i=0; i <= evenNumberofMatch/2 ; i++){
				
				// A FAIREEEEE// Retourner les 10 match précèdent
				if(nextIndex < 0){
					currentID = Math.abs((_all_matchs.length - 1) - nextIndex - 1)
				}
				tabMatch.push[nextIndex]
			}

		}

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

