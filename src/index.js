import * as d3 from "d3";
import css from "./css/index.css";
import { $ } from "./modules/utility";
import papaparse from "papaparse";
import addGoal from "./modules/counter";
import { Splide } from "@splidejs/splide";
import { indexes } from "d3";
import { easeBack } from "d3";

const WRAPPER = document.querySelector(".splide__list");
const MATCH_URL = "fused.csv";
const MATCH_WRAPPER_HEIGHT = 16 * 20;
const FLAG_URL = "https://flagcdn.com/h240/";
const BUTTON_PREV = $(".button--prev");
const BUTTON_NEXT = $(".button--next");
let _all_matchs = {};
let _carousel = { size: 3 };
_carousel.startIndex = isOddNumber(_carousel.size)
	? Math.floor(_carousel.size / 2)
	: (() => {
			throw new Error("la taille du carousel doit être impaire");
	  })();

fetch(MATCH_URL)
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		const parsed_data = csvToJson(data);
		_all_matchs = parsed_data.data.slice(0, 20);
		const small_chunk = _all_matchs.slice(0, _carousel.size);
		buildMatch(small_chunk);
		const carousel = new Splide(".splide", {
			updateOnMove: true,
			type: "loop",
			drag: false,
			start: _carousel.startIndex,
			direction: "ttb",
			arrows: true,
			height: MATCH_WRAPPER_HEIGHT,
			resetProgress: false,
			pagination: false,
			clones: 1,
			cloneStatus: false,
			keyboard: true,
		}).mount();
		carousel.on("moved", nextMatch);
		BUTTON_NEXT.addEventListener("click", () => {
			$(".splide__arrow--next").click();
		});
		BUTTON_PREV.addEventListener("click", () => {
			$(".splide__arrow--prev").click();
		});
	})
	.catch(function (error) {
		console.log(error);
	});

function buildMatch(small_chunk) {
	const carousel_item = document.querySelector(".match--card").content;
	small_chunk.forEach((match, key) => {
		const match_wrapper = carousel_item.cloneNode(true);
		WRAPPER.appendChild(match_wrapper);
		const updated_match_wrapper = WRAPPER.querySelector("li:last-of-type");
		setMatchData(match, key, updated_match_wrapper);
	});
	addGoal(_all_matchs[_carousel.startIndex].goals);
}

function setMatchData(match, matchId, matchElement) {
	const setter = (element) => {
		const away_country_code = match.away_team_code.toLowerCase();
		const home_country_code = match.home_team_code.toLowerCase();
		const score = `${match.home_score}-${match.away_score}`;
		const tournament = match.tournament + ` ${match.goals}`;
		const away_style = `background-image: url(${FLAG_URL}${away_country_code}.png);`;
		const home_style = `background-image: url(${FLAG_URL}${home_country_code}.png);`;
		const victory = isVictory(match);
		const match_card = element.querySelector(".carousel__item-body");

		element.querySelector(".flag--home").setAttribute("style", home_style);
		element.querySelector(".flag--away").setAttribute("style", away_style);
		element.querySelector(".event-name").textContent = tournament;
		element.querySelector(".score").textContent = score;
		element.setAttribute("data-Id", matchId);

		if (victory) {
			match_card.classList.remove("defeat");
			match_card.classList.add("victory");
		} else if (victory == false) {
			match_card.classList.add("defeat");
			match_card.classList.remove("victory");
		} else if (victory == null) {
			match_card.classList.remove("defeat");
			match_card.classList.remove("victory");
		}
	};
	if (NodeList.prototype.isPrototypeOf(matchElement)) {
		matchElement.forEach((element) => {
			setter(element);
		});
	} else {
		setter(matchElement);
	}
}

function csvToJson(data) {
	const parsed_matchs = papaparse.parse(data, {
		columns: true,
		delimiter: ",",
		header: true,
		dynamicTyping: true,
	});
	return parsed_matchs;
}

function nextMatch() {
	const matchLength = _all_matchs.length;
	const selector = ".splide__slide";
	const active = `${selector}.is-active`;
	const prev = `${selector}.is-prev`;
	const next = `${selector}.is-next`;

	const slideId = parseInt($(active).dataset.id);
	const nextSlideId = parseInt($(next).dataset.id);
	const prevSlideId = parseInt($(prev).dataset.id);

	const nextMatchId = slideId + 1 > matchLength - 1 ? 0 : slideId + 1;
	const prevMatchId = slideId - 1 < 0 ? matchLength - 1 : slideId - 1;
	const prevMatch = _all_matchs[prevMatchId];
	const nextMatch = _all_matchs[nextMatchId];
	const prevCard = $(`${selector}[data-id="${prevSlideId}"]`, true);
	const nextCard = $(`${selector}[data-id="${nextSlideId}"]`, true);

	addGoal(_all_matchs[slideId].goals);
	setMatchData(prevMatch, prevMatchId, prevCard);
	setMatchData(nextMatch, nextMatchId, nextCard);
}

function isVictory(match) {
	if (match.away_score == match.home_score) return null;
	const is_switzerland = match.away_team == "Switzerland" ? true : false;
	const victory = match.away_score > match.home_score ? true : false;
	if ((victory && is_switzerland) || (!victory && !is_switzerland)) return true;
	return false;
}

function isOddNumber(oddSize) {
	return parseInt(oddSize) % 2 != 0 ? true : false;
}
