const ANNEEDEBUT = 1905;
const ANNEEFIN = 2021;

const entree = document.querySelector("#search-input");

export function searchYear(year) {
	const valeur = document.querySelector("text");

	if (year >= ANNEEDEBUT && year <= ANNEEFIN) {
		valeur.innerText = "Recherche réussie";
	} else {
		valeur.innerText =
			"Aucun résultat - La recherche peut être faite que entre les années 1882 et 2021";
	}
}

export function isValidYear(year) {
	return year >= ANNEEDEBUT && year <= ANNEEFIN ? true : false;
}
