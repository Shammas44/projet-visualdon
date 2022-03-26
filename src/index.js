import * as d3 from "d3";
import css from "./css/index.css";
import papaparse from "papaparse";
import addGoal from "./modules/counter";
import detectScroll from "@egstad/detect-scroll";
import { Splide } from "@splidejs/splide";
const WRAPPER = document.querySelector(".splide__list");
const MATCH_URL = "fused.csv";
const MATCH_WRAPPER_HEIGHT = 16 * 20;
const FLAG_URL = "https://flagcdn.com/h240/";
let _all_matchs = {};
let _indexes = { start: 0, end: 8, step: 1, current: 0 };
let lastScrollTop = 0;
let lastScrollDirection = "";
fetch(MATCH_URL)
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		const parsed_data = csvToJson(data);
		_all_matchs = parsed_data.data.slice(0, 20);
		console.log(_all_matchs);
		const small_chunk = _all_matchs.slice(0, _indexes.end);
		build_match(small_chunk);
		new Splide(".splide", {
			wheel: true,
			updateOnMove: true,
			type: "loop",
			direction: "ttb",
			arrows: false,
			height: MATCH_WRAPPER_HEIGHT,
			resetProgress: false,
			pagination: false,
		}).mount();
		// const currentId = Math.ceil(_indexes.end / 2) - 1;
		// WRAPPER.scrollTop = MATCH_WRAPPER_HEIGHT * currentId;
		// setTimeout(() => {
		// 	addGoal(_all_matchs[currentId].goals);
		// 	_indexes.current = currentId;
		// 	const instance = new detectScroll(WRAPPER);
		// 	setScrollListener();
		// 	WRAPPER.addEventListener("scrollUp", up);
		// 	WRAPPER.addEventListener("scrollDown", down);
	})
	.catch(function (error) {
		console.log(error);
	});

function build_match(small_chunk, appendChild = true) {
	const carousel_item = document.querySelector(".match--card").content;
	small_chunk.forEach((match) => {
		const match_wrapper = carousel_item.cloneNode(true);
		const updated_match_wrapper = setMatchData(match, match_wrapper, true);
		WRAPPER.appendChild(updated_match_wrapper);
	});
}

function setMatchData(match, matchElement, isReturning = false) {
	console.log(matchElement);
	const away_country_code = match.away_team_code.toLowerCase();
	const home_country_code = match.home_team_code.toLowerCase();
	const score = `${match.home_score}-${match.away_score}`;
	const away_style = `background-image: url(${FLAG_URL}${away_country_code}.png);`;
	const home_style = `background-image: url(${FLAG_URL}${home_country_code}.png);`;
	const victory = is_victory(match);
	const match_card = matchElement.querySelector(".carousel__item-body");

	matchElement.querySelector(".flag--home").setAttribute("style", home_style);
	matchElement.querySelector(".flag--away").setAttribute("style", away_style);
	matchElement.querySelector(".event-name").textContent =
		match.tournament + ` ${match.goals}`;
	matchElement.querySelector(".score").textContent = score;

	if (victory) match_card.classList.add("victory");
	if (victory == false) match_card.classList.add("defeat");
	if (isReturning) return matchElement;
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
	console.log(WRAPPER.scrollTop);
	const scrollTop = event.detail.y;
	const scrollDiff = Math.abs(lastScrollTop - scrollTop);
	if (scrollTop % MATCH_WRAPPER_HEIGHT == 0) {
		// console.log(scrollDiff);
		if (lastScrollDirection == "down") {
			_indexes.start += 1;
			_indexes.end += _indexes.end > _all_matchs.length ? 1 : 0;
			_indexes.current += _indexes.current < _all_matchs.length ? 1 : 0;
			if (_indexes.end <= _all_matchs.length) {
				const small_chunk = new Array(_all_matchs[_indexes.end]);
				lastScrollTop = scrollTop;
				build_match(small_chunk);
				WRAPPER.querySelector("div:first-child").remove();
				setTimeout(() => {
					setScrollListener();
					WRAPPER.addEventListener("scrollDown", down);
					WRAPPER.addEventListener("scrollUp", up);
				}, 50);
			}
			addGoal(_all_matchs[_indexes.current].goals);
		} else if (lastScrollDirection == "up") {
			_indexes.start -= _indexes.start > 0 ? 1 : 0;
			_indexes.end -= _indexes.start > 0 ? 1 : 0;
			_indexes.current -= _indexes.current > 0 ? 1 : 0;
			if (_indexes.start >= 1) {
				const small_chunk = new Array(_all_matchs[_indexes.start]);
				lastScrollTop = scrollTop;
				build_match(small_chunk, false);
				WRAPPER.querySelector("div:last-child").remove();
				setTimeout(() => {
					setScrollListener();
					WRAPPER.addEventListener("scrollUp", up);
					WRAPPER.addEventListener("scrollDown", down);
				}, 50);
			}
			addGoal(_all_matchs[_indexes.current].goals);
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

function is_victory(match) {
	if (match.away_score == match.home_score) return null;
	const is_switzerland = match.away_team == "Switzerland" ? true : false;
	const victory = match.away_score > match.home_score ? true : false;
	if ((victory && is_switzerland) || (!victory && !is_switzerland)) return true;
	return false;
}

function down(event) {
	console.log("down " + lastScrollTop);
	lastScrollDirection = "down";
	lastScrollTop = WRAPPER.scrollTop;
}
function up(event) {
	console.log("up " + lastScrollTop);
	lastScrollDirection = "up";
	lastScrollTop = WRAPPER.scrollTop;
}
