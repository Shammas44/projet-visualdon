import * as d3 from "d3";
import css from "./css/index.css";
import papaparse from "papaparse";
const wrapper = document.querySelector(".carousel");
const carousel_item = document.querySelector(".carousel__item");
const carousel_item_clone = carousel_item.cloneNode(true);
carousel_item_clone.classList.remove("template");
const MATCH_URL = "foot.csv";
const MATCH_WRAPPER_HEIGHT = 16 * 20;
const COUNTRY_URL = "country.csv";
const FLAG_URL = "https://flagcdn.com/h240/";
let all_matchs = {};
let all_countries = {};
let current_match_index = { start: 1, end: 20, step: 1 };
let lastScrollTop = 0;
Promise.all([fetch(MATCH_URL), fetch(COUNTRY_URL)])
	.then(function (responses) {
		return Promise.all(
			responses.map(function (response) {
				return response.text();
			})
		);
	})
	.then(function (data) {
		const parsed_data = csvToJson(data);
		const small_chunk = parsed_data.matchs.data.slice(1, 20);
		const countries = parsed_data.countries;
		all_matchs = parsed_data.matchs.data;
		all_countries = countries;
		build_match(small_chunk, countries);
	})
	.catch(function (error) {
		console.log(error);
	});

function build_match(small_chunk, countries) {
	small_chunk.forEach((match) => {
		const match_wrapper = carousel_item_clone.cloneNode(true);
		match_wrapper.querySelector(".title").textContent = match.date;
		const country_code =
			countries[match.away_team].Name !== "Switzerland"
				? countries[match.away_team].Code.toLowerCase()
				: countries[match.home_team].Code.toLowerCase();
		const country_name =
			countries[match.away_team].Name !== "Switzerland"
				? countries[match.away_team].Name.toLowerCase()
				: countries[match.home_team].Name.toLowerCase();
		const away_country_code = countries[match.away_team].Code.toLowerCase();
		const home_country_code = countries[match.home_team].Code.toLowerCase();
		const score = `${match.home_score}-${match.away_score}`;
		match_wrapper.querySelector(".event_name").textContent = match.tournament;
		match_wrapper
			.querySelector(".flag--home")
			.setAttribute(
				"style",
				`background-image: url(${FLAG_URL}${home_country_code}.png);`
			);
		match_wrapper
			.querySelector(".flag--away")
			.setAttribute(
				"style",
				`background-image: url(${FLAG_URL}${away_country_code}.png);`
			);
		match_wrapper.querySelector(".score").textContent = score;
		const victory = is_victory(match);
		const match_card = match_wrapper.querySelector(".carousel__item-body");
		if (victory) match_card.classList.add("victory");
		if (victory == false) match_card.classList.add("defeat");
		wrapper.appendChild(match_wrapper);
	});
}

function csvToJson(data) {
	const [matchs, countries] = [data[0], data[1]];
	const parsed_matchs = papaparse.parse(matchs, {
		columns: true,
		delimiter: ",",
		header: true,
		dynamicTyping: true,
	});
	let parsed_countries = papaparse.parse(countries, {
		columns: true,
		delimiter: ",",
		header: true,
		dynamicTyping: true,
	});
	let new_countries = {};
	parsed_countries.data.forEach((element) => {
		new_countries[element.Name] = element;
	});
	return { countries: new_countries, matchs: parsed_matchs };
}
wrapper.addEventListener("scroll", (event) => {
	console.log(wrapper.scrollTop);
	const direction = wrapper.scrollTop > lastScrollTop ? true : false;
	lastScrollTop = wrapper.scrollTop;
	if (wrapper.scrollTop % MATCH_WRAPPER_HEIGHT == 0 && wrapper.scollTop != 0) {
		console.log(wrapper.scrollTop);
		console.log(all_matchs);
		if (direction) {
			current_match_index.end += current_match_index.step;
			current_match_index.start += current_match_index.step;
			const small_chunk = all_matchs.slice(
				current_match_index.start,
				current_match_index.end
			);
			build_match(small_chunk, all_countries);
		} else {
			current_match_index.end -= current_match_index.step;
			current_match_index.start -= current_match_index.step;
			build_match(small_chunk, all_countries);
		}
	}
});

// function remove_last_match() {
// clear_children(wrapper )

// }
// function remove_first_match() {
// clear_children(wrapper )

// }

function clear_children(parentNode, length = 1) {
	while (parentNode.children.length > length) {
		parentNode.removeChild(parentNode.lastChild);
	}
}

function is_victory(match) {
	if (match.away_score == match.home_score) return null;
	const is_switzerland = match.away_team == "Switzerland" ? true : false;
	const victory = match.away_score > match.home_score ? true : false;
	if ((victory && is_switzerland) || (!victory && !is_switzerland)) return true;
	return false;
}

// function update_match() {}
