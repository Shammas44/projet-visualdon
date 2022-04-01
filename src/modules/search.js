const ANNEEDEBUT = 1882;
const ANNEEFIN = 2021;



const entree = document.querySelector('#search-input')

function searchYear(year){
    const valeur = document.querySelector('text')

    if(year >= ANNEEDEBUT && year <= ANNEEFIN){
        valeur.innerText = 'Recherche réussie' 
    } else{
        valeur.innerText = 'Aucun résultat - La recherche peut être faite que entre les années 1882 et 2021'
    }
}

function trieDonnee(carousel){

    
}

export default searchYear