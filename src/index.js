import * as d3 from "d3";
import css from "./css/index.css";
import Carousel from "./modules/carousel";
import { MATCH_URL, BUTTON_NEXT, BUTTON_PREV } from "./modules/config";
import papaparse from "papaparse";
import { getTimeLineMatchs, setSearchEvent } from "./modules/search";
import addGoal from "./modules/counter";
import { buildTimeline } from "./modules/timeline";
export const _id = {
	id: 0,
	set setId(id) {
		this.id = id;
	},
	get getId() {
		return this.id;
	},
};

let _all_matchs = {};
const entree = document.querySelector("#search-input");
fetch(MATCH_URL)
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		const parsed_data = csvToJson(data).data;
		_all_matchs = parsed_data;
		const carousel = new Carousel(parsed_data, addGoal, {
			customNextButtonElement: BUTTON_NEXT,
			customPrevButtonElement: BUTTON_PREV,
		});

		BUTTON_NEXT.addEventListener("click", () => {
			_id.id = _id.id + 1 > _all_matchs.length - 1 ? 0 : _id.id + 1;
			buildTimeline(getTimeLineMatchs(_all_matchs, 20, _id.id), _id.id);
			entree.value = _all_matchs[_id.id].date.split("-")[0];
			console.log("button next " + _id.id);
		});
		BUTTON_PREV.addEventListener("click", () => {
			_id.id = _id.id - 1 < 0 ? _all_matchs.length - 1 : _id.id - 1;
			buildTimeline(getTimeLineMatchs(_all_matchs, 20, _id.id), _id.id);
			entree.value = _all_matchs[_id.id].date.split("-")[0];
			console.log("button prev  " + _id.id);
		});

		buildTimeline(getTimeLineMatchs(_all_matchs, 20, _id.id), _id.id);
		setSearchEvent(carousel, parsed_data, _all_matchs);
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
