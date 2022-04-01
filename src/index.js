import * as d3 from "d3";
import css from "./css/index.css";
import Carousel from "./modules/carousel";
import { MATCH_URL, BUTTON_NEXT, BUTTON_PREV } from "./modules/config";
import papaparse from "papaparse";
import searchYear from "./modules/search";

const entree = document.querySelector('#search-input')

let _all_matchs = {};
fetch(MATCH_URL)
	.then(function (response) {
		return response.text();
	})
	.then(function (data) {
		const parsed_data = csvToJson(data).data;
		_all_matchs = parsed_data;
		const carousel = new Carousel(parsed_data, {
			customNextButtonElement: BUTTON_NEXT,
			customPrevButtonElement: BUTTON_PREV,
		});
		

		entree.addEventListener('input', e =>{
			const valeur = searchYear(e.target.value);
			let i = 0;

			while(parsed_data[i].date.split('-')[0] !== e.target.value){
				i++

			}
			const currentIndex = i;
			const indexPrecedent = currentIndex - 1 < 0 ? _all_matchs.length - 1 : currentIndex - 1
			const indexSuivant = currentIndex + 1 > _all_matchs.length - 1 ? 0 : currentIndex + 1

			// Index des match
			const matchPrecedent = _all_matchs[indexPrecedent]
			const currentMatch = _all_matchs[currentIndex]
			const matchSuivant = _all_matchs[indexSuivant]

			console.dir(currentMatch)
			console.dir('match precedent' + matchPrecedent)
			console.dir('match suivant' + matchSuivant)

			console.log(indexPrecedent)
			console.log(indexSuivant)

			console.log(_all_matchs[512])


			// Variable Html
			const matchPrecedentHtml = document.querySelector('.splide__slide.is-prev')
			const currentMatchHtml = document.querySelector('.splide__slide.is-active')
			const matchSuivantHtml = document.querySelector('.splide__slide.is-next')

			// Appel fonction setMatchData
			carousel.setMatchData(matchPrecedent, indexPrecedent, matchPrecedentHtml)
			carousel.setMatchData(currentMatch, currentIndex, currentMatchHtml);
			carousel.setMatchData(matchSuivant, indexSuivant, matchSuivantHtml)

			
			
		})
		//console.log(carousel.carousel);
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


