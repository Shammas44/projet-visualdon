import { $ } from "./utility";
import addGoal from "./counter";
import { Splide } from "@splidejs/splide";
import { MATCH_WRAPPER_HEIGHT, WRAPPER, FLAG_URL } from "./config";

export default class Carousel {
	/**
	 * The constructor function takes two parameters:
	 *
	 * - matchs: an array of matchs
	 * - options: an object of options
	 *
	 * It creates a carousel property object with the following properties:
	 *
	 * - size: the number of matchs to display in the carousel
	 * - startIndex: the index of the first match to display in the carousel
	 *
	 * It creates a default match array with the first size matchs of the matchs array
	 * @param matchs - an array of matchs
	 * @param options - an object that contains the following properties:
	 */
	constructor(matchs, options) {
		this.carouselProperty = { size: 3 };
		this.all_matchs = matchs;
		this.carouselProperty.startIndex = this.isOddNumber(
			this.carouselProperty.size
		)
			? Math.floor(this.carouselProperty.size / 2)
			: (() => {
					throw new Error("la taille du carousel doit être impaire");
			  })();
		const defaultMatch = matchs.slice(0, this.carouselProperty.size);
		this.buildMatch(defaultMatch);
		this.createCarousel(options);
	}

	/**
	 * This function takes in a small chunk of matches and loops through them, creating a new match card
	 * for each match
	 * @param small_chunk - An array of matches that will be displayed in the carousel.
	 */
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

	/**
	 * Create a new Splide instance and mount it to the DOM
	 * @param {} - carousel options; documentation => https://splidejs.com/guides/options/
	 */
	createCarousel({
		arrows = true,
		cloneStatus = false,
		clones = 1,
		direction = "ttb",
		drag = false,
		height = MATCH_WRAPPER_HEIGHT,
		keyboard = false,
		pagination = false,
		resetProgress = false,
		splide = ".splide",
		start = this.carouselProperty.startIndex,
		type = "loop",
		updateOnMove = true,
		wheel = false,
		classes = {
			arrows: "splide__arrows",
			arrow: "splide__arrow",
			prev: "splide__arrow--prev",
			next: "splide__arrow--next",
			pagination: "splide__pagination",
			page: "splide__pagination__page",
		},
		customNextButtonElement = null,
		customPrevButtonElement = null,
	} = {}) {
		this.carousel = new Splide(splide, {
			arrows: arrows,
			cloneStatus: cloneStatus,
			clones: clones,
			direction: direction,
			drag: drag,
			height: height,
			keyboard: keyboard,
			pagination: pagination,
			resetProgress: resetProgress,
			start: start,
			type: type,
			updateOnMove: updateOnMove,
			wheel: wheel,
			classes: classes,
		}).mount();
		this.carousel.on("moved", () => {
			this.nextMatch();
		});
		if (customNextButtonElement != null)
			customNextButtonElement.addEventListener("click", () => {
				$(`.${classes.next}`).click();
			});
		if (customPrevButtonElement != null)
			customPrevButtonElement.addEventListener("click", () => {
				$(`.${classes.prev}`).click();
			});
	}

	/**
	 * This function sets the match data for each match card
	 * @param match - The match object.
	 * @param matchId - The id of the match.
	 * @param matchElement - The element that will be updated.
	 */
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

	/**
	 * The function is called when the user clicks on the next or previous buttons.
	 * It takes the current match and the next or previous match and adds the goals to the current match.
	 * It also sets the data-id attribute of the next or previous match to the correct value
	 */
	nextMatch() {
		const matchLength = this.all_matchs.length;
		const selector = ".splide__slide";
		const active = `${selector}.is-active`;
		const prev = `${selector}.is-prev`;
		const next = `${selector}.is-next`;

		const slideId = parseInt($(active).dataset.id);
		const nextSlideId = parseInt($(next).dataset.id);
		const prevSlideId = parseInt($(prev).dataset.id);

		const nextMatchId = slideId + 1 > matchLength - 1 ? 0 : slideId + 1;
		const prevMatchId = slideId - 1 < 0 ? matchLength - 1 : slideId - 1;
		const prevMatch = this.all_matchs[prevMatchId];
		const nextMatch = this.all_matchs[nextMatchId];
		const prevCard = $(`${selector}[data-id="${prevSlideId}"]`, true);
		const nextCard = $(`${selector}[data-id="${nextSlideId}"]`, true);

		addGoal(this.all_matchs[slideId].goals);
		this.setMatchData(prevMatch, prevMatchId, prevCard);
		this.setMatchData(nextMatch, nextMatchId, nextCard);
	}

	/**
	 * If the away team is Switzerland, then the away team wins. Otherwise, the home team wins
	 * @param match - the match object
	 * @returns A boolean value.
	 */
	isVictory(match) {
		if (match.away_score == match.home_score) return null;
		const is_switzerland = match.away_team == "Switzerland" ? true : false;
		const victory = match.away_score > match.home_score ? true : false;
		if ((victory && is_switzerland) || (!victory && !is_switzerland))
			return true;
		return false;
	}

	/**
	 * Given a number, return true if the number is odd, false if the number is even
	 * @param number - The number to check.
	 * @returns The value of the expression parseInt(number) % 2 != 0 ? true : false;
	 */
	isOddNumber(number) {
		return parseInt(number) % 2 != 0 ? true : false;
	}
}
