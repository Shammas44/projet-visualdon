import { $ } from "./utility";
import addGoal from "./counter";
import { Splide } from "@splidejs/splide";
import {
	BUTTON_NEXT,
	BUTTON_PREV,
	MATCH_WRAPPER_HEIGHT,
	WRAPPER,
	FLAG_URL,
} from "./config";

export default class Carousel {
	constructor(matchs) {
		this.carouselProperty = { size: 3 };
		this.all_matchs = matchs;
		this.carouselProperty.startIndex = this.isOddNumber(
			this.carouselProperty.size
		)
			? Math.floor(this.carouselProperty.size / 2)
			: (() => {
					throw new Error("la taille du carousel doit être impaire");
			  })();
		this.createCarousel();
		const defaultMatch = matchs.slice(0, this.carouselProperty.size);
		this.buildMatch(defaultMatch);
	}
	buildMatch(small_chunk) {
		const carousel_item = document.querySelector(".match--card").content;
		small_chunk.forEach((match, key) => {
			const match_wrapper = carousel_item.cloneNode(true);
			WRAPPER.appendChild(match_wrapper);
			const updated_match_wrapper = WRAPPER.querySelector("li:last-of-type");
			this.setMatchData(match, key, updated_match_wrapper);
		});
		addGoal(this.all_matchs[this.carouselProperty.startIndex].goals);
	}

	createCarousel() {
		this.carousel = new Splide(".splide", {
			updateOnMove: true,
			type: "loop",
			drag: false,
			start: this.carouselProperty.startIndex,
			direction: "ttb",
			arrows: true,
			height: MATCH_WRAPPER_HEIGHT,
			resetProgress: false,
			pagination: false,
			clones: 1,
			cloneStatus: false,
			keyboard: true,
		}).mount();
		this.carousel.on("moved", () => {
			console.log("hello");
			this.nextMatch();
		});
		BUTTON_NEXT.addEventListener("click", () => {
			$(".splide__arrow--next").click();
		});
		BUTTON_PREV.addEventListener("click", () => {
			$(".splide__arrow--prev").click();
		});
	}

	setMatchData(match, matchId, matchElement) {
		const setter = (element) => {
			const away_country_code = match.away_team_code.toLowerCase();
			const home_country_code = match.home_team_code.toLowerCase();
			const score = `${match.home_score}-${match.away_score}`;
			const tournament = match.tournament + ` ${match.goals}`;
			const away_style = `background-image: url(${FLAG_URL}${away_country_code}.png);`;
			const home_style = `background-image: url(${FLAG_URL}${home_country_code}.png);`;
			const victory = this.isVictory(match);
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

	nextMatch() {
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
		this.setMatchData(prevMatch, prevMatchId, prevCard);
		this.setMatchData(nextMatch, nextMatchId, nextCard);
	}

	isVictory(match) {
		if (match.away_score == match.home_score) return null;
		const is_switzerland = match.away_team == "Switzerland" ? true : false;
		const victory = match.away_score > match.home_score ? true : false;
		if ((victory && is_switzerland) || (!victory && !is_switzerland))
			return true;
		return false;
	}

	isOddNumber(oddSize) {
		return parseInt(oddSize) % 2 != 0 ? true : false;
	}
}
