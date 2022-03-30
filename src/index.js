import * as d3 from "d3";
import css from "./css/index.css";
import Carousel from "./modules/carousel";
import { MATCH_URL } from "./modules/config";
import papaparse from "papaparse";

let _all_matchs = {};
fetch(MATCH_URL)
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		const parsed_data = csvToJson(data).data;
		_all_matchs = parsed_data.slice(0, 20);
		const carousel = new Carousel(parsed_data);
		console.log(carousel.carousel);
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
