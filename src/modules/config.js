import { $ } from "./utility";

// export const WRAPPER = document.querySelector(".splide__list");
export const WRAPPER = {
	item: document.querySelector(".splide__list"),
	set setItem(item) {
		this.item = item;
	},
	get getItem() {
		return this.item;
	},
};
export const MATCH_URL = "fused.csv";
export const MATCH_WRAPPER_HEIGHT = 16 * 20;
export const FLAG_URL = "https://flagcdn.com/h240/";
export const BUTTON_PREV = $(".button--prev");
export const BUTTON_NEXT = $(".button--next");
