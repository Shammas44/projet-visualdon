//                      _       _
//  _ __ ___   ___   __| |_   _| | ___
// | '_ ` _ \ / _ \ / _` | | | | |/ _ \
// | | | | | | (_) | (_| | |_| | |  __/
// |_| |_| |_|\___/ \__,_|\__,_|_|\___|

// <-- toc -->
// 1. Dates
// 2. Fetch
// 3. Helpers
// 	- 3.1. Sorting
// 	- 3.2. Random
// 	- 3.3. Others
// <-- tocstop -->

// ==========================================================================
//1# $1. Dates
// ==========================================================================

/**
 * Convertit une string au format ISO 8601 (avec heures UTC) en objet Date
 * @param {string} str La date au format ISO 8601 avec heures UTC
 * @return {Date} en "local timezone"
 */
export function strToDate(str) {
	return new Date(
		Date.UTC(
			str.substr(0, 4),
			str.substr(4, 2) - 1,
			str.substr(6, 2),
			str.substr(9, 2),
			str.substr(11, 2),
			str.substr(13, 2)
		)
	);
}

/**
 * Convertit un objet Date en string au format FR_CH simplifié
 * @param {Date}
 * @return {string} exemple de retour: "Lun 02.11"
 */
export function dateToFrCh(date) {
	let mapDay = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
	let day = date.getDate();
	let dayName = mapDay[date.getDay()];
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	return `${dayName} ${day}.${month}`;
}

/**
 * Convertit un objet Date au format heures:minutes en "local timezone"
 * @param {Date}
 * @return {string} exemple de retour: "15:32"
 */
export function dateToHours(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	if (hours < 10) hours = "0" + hours;
	if (minutes < 10) minutes = "0" + minutes;
	return `${hours}:${minutes}`;
}

// ==========================================================================
//1# $2. Fetch
// ==========================================================================

/**
 * @description Effectue plusieurs requêtes HTTP GET afin d'aller charger les URLs pointant
 * sur des données au format JSON. La fonction retourne un tableau contenant tous
 * les résultats ("désérialisés").
 *
 * @param {array} urls Les URLs à charger (dont le contenu est du JSON)
 * @return {array} un tableau contenant les résultats de chaque requête
 */
export async function loadJsonUrls(urls) {
	const results = await Promise.all(urls.map((url) => fetch(url)));
	const responses = await Promise.all(results.map((result) => result.json()));
	return responses;
}

/**
 * @description effectue une reqête fetch sur une api qui renvoie des donnnées JSON
 * @param {string} url
 * @return {object} la reponse JSON parsée
 */
export async function fetchJson(url) {
	const resp = await fetch(url);
	return resp.json();
}

/**
 * @description effectue une reqête fetch sur une api qui renvoie des donnnées XML
 * @param {string} url
 * @return {dom} la reponse, parsée sous form de DOM
 */
export async function fetchXml(url) {
	let response = await fetch(url);
	const xmlText = await response.text();
	const parser = new DOMParser();
	const xmlDom = parser.parseFromString(xmlText, "text/xml");
	return xmlDom;
}

// ==========================================================================
//1# $3. Helpers
// ==========================================================================

/**
 * @description effectue un foreach sur un tableau d'éléments définis par un sélécteur css
 * @param {string} selector un sélécteur css
 * @param {callback} callback
 */
export function domForEach(selector, callback, parent = document) {
	parent.querySelectorAll(selector).forEach(callback);
}

/**
 * @description ajoute un écouteur d'événement pour chaque éléments d'un tableau, définis par la fonction querySelectorAll
 * @param {string} selector un sélécteur css
 * @param {string} event le nom de l'événement
 * @param {callback} callback la fonction de callback de l'événement
 */
export function domOn(selector, event, callback, parent) {
	domForEach(selector, (ele) => ele.addEventListener(event, callback), parent);
}

/**
 * @description shortcut for querySelector and querySelectorall
 * @param {string} selector un sélécteur css
 * @param {boolean} [selectorAll_enable=false]
 * @return {node}
 */
export function $(selector, selectorAll_enable = false) {
	if (selectorAll_enable) {
		return document.querySelectorAll(selector);
	} else {
		return document.querySelector(selector);
	}
}

//2# $3.1. Sorting
// ==========================================================================

/**
 * @description Trie un tableau selon la valeur contenu dans une cellule spécific
 * @param {*} array
 * @param {*} index un entier ou une chaîne de character
 * @return {*} le tableau trié
 */
export function sortByValue(array, index) {
	array.sort((data1, data2) => {
		if (data1[index] < data2[index]) {
			return -1;
		}
		if (data1[index] > data2[index]) {
			return 1;
		}
		return 0;
	});
	return array;
}

//2# $3.2. Min //2# Min & max max
// ==========================================================================

/**
 * @description retourne le plus grand nombre d'un tableau
 * @return {*}
 */
export const maxValue = (values) =>
	values.reduce((previousValue, currentValue) => {
		return Math.max(previousValue, currentValue);
	});

/**
 * @description retourne le plus petit nombre d'un tableau
 * @return {*}
 */
export const minValue = (values) =>
	values.reduce((previousValue, currentValue) => {
		return Math.min(previousValue, currentValue);
	});

//2# $3.2. Random
// ==========================================================================

/**
 * @description retourne un nombre aléatoire entre 0(inclus) et 1(inclus)
 * @return {*}
 */
export function getRandom() {
	return Math.random();
}

/**
 * @description retourne un nombre aléatoire entre min(pas inclus) et max(pas inclus)
 * @param {*} min
 * @param {*} max
 * @return {*}
 */
export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/**
 * @description retourne un nombre aléatoire entre min(inclus) et max(inclus)
 * @param {*} min
 * @param {*} max
 * @return {*}
 */
export function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

//2# $3.3. Others
// ==========================================================================

/**
 * @description définis le contenu, attributs et class d'un élément
 * @param {*} [{ select: select, att: att, cssClass: cssClass, prop: prop}]
 * @param {*} [node=document] noeud html
 * cssClass: cssClass[class1, class2, ...]
 * att: att[x][0] = attName, att[x][1] = attValue
 * prop: prop[x][0] = propName, prop[x][1] = propValue
 */
export function changeContent(
	{ select, att, cssClass, prop },
	node = document
) {
	const item = node.querySelector(select);
	if (typeof txt !== "undefined") {
		item.textContent = txt;
	}
	if (typeof att !== "undefined") {
		att.forEachj((element) => {
			const [attName, attValue] = [element[0], element[1]];
			item.setAttribute(attName, attValue);
		});
	}
	if (typeof cssClass !== "undefined") {
		cssClass.forEach((className) => {
			item.classList.toggle(className);
		});
	}
	if (typeof prop !== "undefined") {
		prop.forEach((propPeer) => {
			const [propName, propValue] = [propPeer[0], propPeer[1]];
			item[[propName]] = propValue;
		});
	}
}

/**
 * @description exécute un fonction toutes les x secondes
 * @param {*} dtTotal temps total écoulé depuis le début
 * @param {*} lastDtTotal temps total écoulé depuis le dernier appels à cette fonction
 * @param {*} args = [{ time: time, callback: callback}]
 * time: le nombre de secondes après lesquel éxécuter la fonction de callback
 * callback: la fonction à exécuté
 */
export function timer(dtTotal, lastDtTotal, args = []) {
	dtTotal = Math.floor(dtTotal / 1000);
	lastDtTotal = Math.floor(lastDtTotal / 1000);
	args.forEach((arg) => {
		const [time, callback] = [arg.time, arg.callback];
		if (dtTotal > lastDtTotal && dtTotal > 0 && dtTotal % time == 0) {
			callback();
		}
	});
}

/**
 * @description indique si un nombre est un nombre premier
 * @param {*} a un nombre
 * @return {boolean}
 */
export function isPrimeNumber(a) {
	let value = true;
	for (let index = 2; index < a; index++) {
		if (a % index == 0) {
			value = false;
		}
	}
	return value;
}

/**
 * @description compare deux objet sur base d'une propriété commune
 * @param {object} object1
 * @param {object} object2
 * @param {string} propName le nom de la propriété
 * @return {int}
 *  0: les propriété sont identiques
 * -1: propritété de object1 < object2
 *  1: propritété de object1 > object2
 */
export function compareProp(object1, object2, propName) {
	if (object1["propName"] > object2["propName"]) {
		return 1;
	} else if (object1["propName"] < object2["propName"]) {
		return -1;
	} else if (object1["propName"] == object2["propName"]) {
		return 0;
	}
}
