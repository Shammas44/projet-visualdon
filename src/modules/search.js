import { nth } from "lodash";
import addGoal from "./counter";
import { buildTimeline } from "./timeline";
import { $ } from "./utility";
import { _id } from "..";
const ANNEEDEBUT = 1905;
const ANNEEFIN = 2021;
const entree = document.querySelector("#search-input");
const info = document.querySelector(".info");

export function searchYear(year) {
	const valeur = document.querySelector("text");

	if (year >= ANNEEDEBUT && year <= ANNEEFIN) {
		valeur.innerText = "Recherche réussie";
	} else {
		valeur.innerText =
			"Aucun résultat - La recherche peut être faite que entre les années 1905 et 2021";
	}
}

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
	console.log(subarray, currentId);
	return subarray;
}

export function setSearchEvent(carousel, parsed_data, all_matchs) {
	entree.addEventListener("input", (event) => {
		const searchedYear = parseInt(event.target.value);
		const matchsCount = parsed_data.length - 1;
		if (isValidYear(searchedYear)) {
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
			console.log({ activeIndex });
			const prevIndex = activeIndex - 1 < 0 ? matchsCount : activeIndex - 1;
			const nextIndex = activeIndex + 1 > matchsCount ? 0 : activeIndex + 1;

			const prevMatch = all_matchs[prevIndex];
			const activeMatch = all_matchs[activeIndex];
			const nextMatch = all_matchs[nextIndex];

			const prevMatchHtml = $(".splide__slide.is-prev");
			const activeMatchHtml = $(".splide__slide.is-active");
			const nextMatchHtml = $(".splide__slide.is-next");

			carousel.setMatchData(prevMatch, prevMatchHtml);
			carousel.setMatchData(activeMatch, activeMatchHtml);
			carousel.setMatchData(nextMatch, nextMatchHtml);
			addGoal(all_matchs[activeIndex].goals);
			buildTimeline(
				getTimeLineMatchs(all_matchs, 20, activeIndex),
				activeIndex
			);
			_id.id = activeIndex;
			info.innerHTML = "";
		} else {
			info.innerHTML =
				"<p>L'année doit être comprise entre <b>1905 et 2021</b></p>";
		}
	});
}
