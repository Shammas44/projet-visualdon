import * as d3 from "d3";
import css from "./css/index.css";
import papaparse from "papaparse";
import addGoal from "./modules/counter";
import detectScroll from "@egstad/detect-scroll";
const WRAPPER = document.querySelector(".carousel");
const MATCH_URL = "fused.csv";
const MATCH_WRAPPER_HEIGHT = 16 * 20;
const FLAG_URL = "https://flagcdn.com/h240/";
let lastScrollDirection = "";
let _all_matchs = {};
let _ids = { top: 0, down: 8, step: 1, now: 0 };
_ids.now = isOddNumber(_ids.down + 1)
	? Math.floor((_ids.down + 1) / 2)
	: (() => {
			throw new Error("l'index de départ doit être impaire");
	  })();

fetch(MATCH_URL)
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		const parsed_data = csvToJson(data);
		_all_matchs = parsed_data.data.slice(0, 20);
		const small_chunk = _all_matchs.slice(0, _ids.down + 1);
		build_match(small_chunk);
		WRAPPER.scrollTop = MATCH_WRAPPER_HEIGHT * _ids.now;
		setTimeout(() => {
			addGoal(_all_matchs[_ids.now].goals);
			const instance = new detectScroll(WRAPPER);
			setScrollListener();
			WRAPPER.addEventListener("scrollUp", up);
			WRAPPER.addEventListener("scrollDown", down);
		}, 50);
	})
	.catch(function (error) {
		console.log(error);
	});

function build_match(small_chunk, appendChild = true) {
	const carousel_item = document.querySelector(".carousel__item.template");

	small_chunk.forEach((match) => {
		const element = carousel_item.cloneNode(true);
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
		element.classList.remove("template");

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
		if (appendChild) {
			WRAPPER.appendChild(element);
		} else {
			WRAPPER.insertBefore(element, WRAPPER.querySelector("div:first-child"));
		}
	});
	removeScrollListener();
	WRAPPER.removeEventListener("scrollDown", down);
	WRAPPER.removeEventListener("scrollUp", up);
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

function setScrollListener() {
	WRAPPER.addEventListener("scrollY", nextMatch);
}

function nextMatch(event) {
	const scrollTop = event.detail.y;
	console.log(scrollTop);
	const matchLength = _all_matchs.length;

	const setter = (newIndex, isAppending, removeSelector) => {
		const new_match = new Array(_all_matchs[newIndex]);
		addGoal(_all_matchs[_ids.now].goals);
		build_match(new_match, isAppending);
		WRAPPER.querySelector(removeSelector).remove();
		setTimeout(() => {
			setScrollListener();
			WRAPPER.addEventListener("scrollUp", up);
			WRAPPER.addEventListener("scrollDown", down);
		}, 50);
	};

	if (scrollTop % MATCH_WRAPPER_HEIGHT == 0 && scrollTop != 960) {
		if (lastScrollDirection == "down") {
			_ids.top = _ids.top + 1 > matchLength - 1 ? 0 : _ids.top + 1;
			_ids.now = _ids.now + 1 > matchLength - 1 ? 0 : _ids.now + 1;
			_ids.down = _ids.down + 1 > matchLength - 1 ? 0 : _ids.down + 1;
			setter(_ids.down, true, "div:first-child");
		} else if (lastScrollDirection == "up") {
			_ids.top = _ids.top - 1 < 0 ? matchLength - 1 : _ids.top - 1;
			_ids.now = _ids.now - 1 < 0 ? matchLength - 1 : _ids.now - 1;
			_ids.down = _ids.down - 1 < 0 ? matchLength - 1 : _ids.down - 1;
			setter(_ids.top, false, "div:last-child");
		}
	}
}

function removeScrollListener() {
	WRAPPER.removeEventListener("scrollY", nextMatch);
}

function clear_children(parentNode, length = 1) {
	while (parentNode.children.length > length) {
		parentNode.removeChild(parentNode.lastChild);
	}
}

function isValidScroll() {
	return WRAPPER.scrollTop == 4 * MATCH_WRAPPER_HEIGHT ||
		WRAPPER.scrollTop == 2 * MATCH_WRAPPER_HEIGHT ||
		WRAPPER.scrollTop == MATCH_WRAPPER_HEIGHT ||
		WRAPPER.scrollTop == 0
		? true
		: false;
}

function down(event) {
	console.log("down");
	lastScrollDirection = "down";
}
function up(event) {
	console.log("up");
	lastScrollDirection = "up";
}

function nextMatchssss() {
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
