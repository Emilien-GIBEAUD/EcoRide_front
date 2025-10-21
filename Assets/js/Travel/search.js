import { apiUrl, avatarsUrl } from '../script.js';
import { checkIfInputNonEmpty, datetime2ToDate, datetime2ToTime, escapeHTML }from '../Tools/tools.js';

// Voir pour refactoriser avec geocodeAddress et proposeAddress dans ../Tools/geoplateforme.js à terme.
// Presque sûr que l'échec lors de la première tentative venait de l'oubli de l'écouteur sur le 'change' de l'input en fin de la fonction initAddressSuggestions() dans ce fichier.


let carpoolListData;

let depGeocode = {};
let arrGeocode = {};

let proposeTimerId;            // ID du timeout pour proposer des adresses
let geocodeTimerId;            // ID du timeout pour géocoder une adresse
const proposeTimer = 1000 ;    // Délai en millisecondes avant de proposer des adresses
const geocodeTimer = 1500 ;    // Délai en millisecondes avant de géocoder une adresse

let eco, price, note, nbFilteredResults;


/**
 * Initialise la page avec les écouteurs sur les inputs.
 */
export async function initPage() {
    const dateSearch = document.getElementById("dateSearch");
    const depAddressSearch = document.getElementById("depAddressSearch");
    const depSuggestion = document.getElementById("depSuggestion");
    const arrAddressSearch = document.getElementById("arrAddressSearch");
    const arrSuggestion = document.getElementById("arrSuggestion");

    const searchCarpoolForm = document.getElementById("searchCarpoolForm");
    const btnSearchCarpool = document.getElementById("btnSearchCarpool");

    const filterEco = document.getElementById("filterEco");
    const filterMaxPrice = document.getElementById("filterMaxPrice");
    const filterMinNote = document.getElementById("filterMinNote");
    const btnFilter = document.getElementById("btnFilter");

    // Vérification du formulaire saisi
    btnSearchCarpool.disabled = true;
    dateSearch.addEventListener("change", checkInputs);
    depAddressSearch.addEventListener("keyup", checkInputs);
    arrAddressSearch.addEventListener("keyup", checkInputs);

    initAddressSuggestions(depAddressSearch, depSuggestion, depGeocode);
    initAddressSuggestions(arrAddressSearch, arrSuggestion, arrGeocode);

    // Ecouteur sur le bouton de recherche
    btnSearchCarpool.addEventListener("click", async () => {
        if (!depGeocode.x || !arrGeocode.x) {
            alert("Problème sur les adresses géocodées.");
            return;
        }
        carpoolListData = await searchCarpool();
        loadCarpoolResults();
    });

    // Ecouteur sur le bouton de filtre
    btnFilter.addEventListener("click", filter);

    loadCarpoolResults();
}

/**
 * Vérifie tous les inputs.
 */
function checkInputs(){
    const dateOK = checkIfInputNonEmpty(dateSearch);
    const depAddressOK = checkIfInputNonEmpty(depAddressSearch);
    const arrAddressOK = checkIfInputNonEmpty(arrAddressSearch);
    const inputNonEmpty = dateOK && depAddressOK && arrAddressOK;

    if(inputNonEmpty) {
        btnSearchCarpool.disabled = false;
    } else {
        btnSearchCarpool.disabled = true;
    }
}

/**
 * Initialise les événements pour gérer l'affichage des suggestions et le géocodage des adresses.
 * @param {HTMLInputElement} input L'élément input qui déclenchera les événements.
 * @param {HTMLElement} suggestionContainer Le conteneur où afficher les adresses proposées.
 * @param {object} geocodeObject L'objet stockant les coordonnées géocodées (x, y).
 */
function initAddressSuggestions(input, suggestionContainer, geocodeObject) {
    // Lors de la saisie dans l'input (propose des suggestions, géocode l'adresse et calcule la durée [si calcul possible])
    input.addEventListener("keyup", () => {
        proposeAddress(input, suggestionContainer, proposeTimer);
        geocodeAddress(input, geocodeObject, geocodeTimer);
    });
    // A la reprise du focus si des suggestions existent déjà
    input.addEventListener('focus', () => {
        if (suggestionContainer.innerHTML.trim() !== '') {
            suggestionContainer.style.display = 'block';
        }
    });
    // A la perte du focus pour cacher les suggestions
    input.addEventListener('blur', () => {
        setTimeout(() => {
            suggestionContainer.style.display = 'none';
        }, 200);    // Délai pour permettre le clic sur une suggestion
    });
    // A la modification de l'input, lors du clic sur une suggestion par exemple (géocode l'adresse et calcule la durée [si calcul possible])
    input.addEventListener("change", () => {
        geocodeAddress(input, geocodeObject, geocodeTimer);
    });
}

/**
 * Cherche un covoiturage dans la BDD via une requête HTTP GET.
 * @async
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function searchCarpool(){
    const formData = new FormData(searchCarpoolForm);
    const date = escapeHTML(formData.get("date"));
    const depGeoX = parseFloat(depGeocode.x);
    const depGeoY = parseFloat(depGeocode.y);
    const arrGeoX = parseFloat(arrGeocode.x);
    const arrGeoY = parseFloat(arrGeocode.y);
    
    const getParams = `?date=${encodeURIComponent(date)}&depGeoX=${encodeURIComponent(depGeoX)}&depGeoY=${encodeURIComponent(depGeoY)}&arrGeoX=${encodeURIComponent(arrGeoX)}&arrGeoY=${encodeURIComponent(arrGeoY)}`

    return fetch(apiUrl + "travel/search" + getParams)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de la recherche du covoiturage !");
            }
        })
        .catch(error => {
            alert(error.message);
        }
    );
}

/**
 * Récupère les résultas de la recherche de covoiturage et charge le HTML en conséquence.
 */
function loadCarpoolResults(){
    const carpoolResultHtml = document.getElementById("results");
    if (carpoolListData === undefined) {
        carpoolResultHtml.innerHTML = `
            <p>Saisissez vos adresses de départ et d'arrivée ainsi que que votre date de départ dans la barre de recherche.</p>
        `;
    } else if (carpoolListData.length === 0) {
        carpoolResultHtml.innerHTML = `
            <p>Aucun covoiturage trouvé.</p>
            <p>Modifier les filtres ou votre recherche.</p>
        `;
    } else {
        if (carpoolListData.length === 1) {
            carpoolResultHtml.innerHTML = `
                <p>1 covoiturage trouvé</p>
                <div id="result_items">
                    <!-- Injecté -->
                </div>
            `;
        } else {
            carpoolResultHtml.innerHTML = `
                <div id="filterInfoHTML">
                    <!-- Injecté par la fonction filter() -->
                </div>
                <div id="result_items">
                    <!-- Injecté -->
                </div>
            `;
        }
        const carpoolResultItemsHtml = document.getElementById("result_items");
        let resultItems = "";
        let availablePlaceTXT;
        let ecoTravel;
        let note;
        let data_note;
        carpoolListData.forEach(elem => {
            if (elem.available_place === 1) {
                availablePlaceTXT = "1 place";
            } else {
                availablePlaceTXT = `${elem.available_place} places`;
            }

            if (elem.eco === 1) {
                ecoTravel = '<img src="./Assets/icon/electric-car.svg" alt="Voyage écologique" />';
            } else {
                ecoTravel = '';
            }

            if (elem.note === null) {
                note = "pas de note";
                data_note = 10;
            } else {
                note = elem.note + " /10";
                data_note = elem.note;
            }
            resultItems += `
                <div class="result_item" data-eco="${elem.eco}" data-price="${elem.price}" data-note="${data_note}">
                    <div class="pict_act_inf results_profile1">
                        <img src="${avatarsUrl + elem.avatar_file}" alt="Avatar de l'utilisateur" />
                    </div>
                    <div class="pict_act_inf results_profile2">
                        <p>${elem.pseudo}</p>
                    </div>
                    <div class="pict_act_inf results_profile3">
                        <p><b>note : </b>${note}</p>
                    </div>
                    <div class="pict_act_inf results_info1">
                        ${ecoTravel}
                    </div>
                    <p class="results_info2">${datetime2ToDate(elem.dep_date_time)}</p>
                    <p class="results_info3">${elem.dep_address} ${datetime2ToTime(elem.dep_date_time)}</p>
                    <p class="results_info4">${elem.arr_address}  ${datetime2ToTime(elem.arr_date_time)}</p>
                    <p class="results_info5">${availablePlaceTXT} | ${elem.price} crédits</p>
                    <div class="pict_act_inf results_action">
                        <a href="/travel?id=${elem.id}" class="btn btn_link">Détails</a>
                    </div>
                </div>
            `;
        });
        carpoolResultItemsHtml.innerHTML = resultItems;
        filter();
    }
}

// Voir pour refactoriser à terme (cf. commentaire en haut du fichier).
/**
 * Propose des adresses en cours de saisie à l'aide de l'API Geoplateforme.
 * @param {HTMLInputElement} input L'élément input qui a déclenché l'événement.
 * @param {HTMLElement} suggestionContainer Le conteneur où afficher les adresses proposées.
 * @param {number} timer Le délai en millisecondes avant de lancer la requête API.
 */
function proposeAddress(input, suggestionContainer, timer){
    clearTimeout(proposeTimerId);

    proposeTimerId = setTimeout(() => {
        if (input.value.length > 2) { 
            const urlApi = `https://data.geopf.fr/geocodage/completion/?text=${encodeURIComponent(input.value)}&maximumResponses=5`;

            fetch(urlApi)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    suggestionContainer.innerHTML = '';
                    suggestionContainer.innerHTML = 'Suggestions :';
                    if (data.results && data.results.length > 0) {
                        data.results.forEach(result => {
                            const suggestion = document.createElement('div');
                            suggestion.classList.add('suggestion_item');
                            suggestion.textContent = result.fulltext;
                            suggestion.addEventListener('click', () => {
                                input.value = result.fulltext;
                                suggestionContainer.innerHTML = '';
                                suggestionContainer.style.display = 'none';
                            });
                            suggestionContainer.appendChild(suggestion);
                        });
                        suggestionContainer.style.display = 'block';
                    } else {
                        suggestionContainer.innerHTML = '<div>Aucun résultat trouvé.</div>';
                        suggestionContainer.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la requête API:', error);
                    suggestionContainer.innerHTML = '<div>Une erreur est survenue.</div>';
                    suggestionContainer.style.display = 'block';
                });
        } else {
            suggestionContainer.innerHTML = '';
            suggestionContainer.style.display = 'none';
        }
    }, timer);
}

// Voir pour refactoriser à terme (cf. commentaire en haut du fichier).
/**
 * Geocode une adresse en cours de saisie à l'aide de l'API Geoplateforme.
 * @param {HTMLInputElement} input L'élément input qui a déclenché l'événement.
 * @param {object} geocodeObject L'objet stockant les coordonnées géocodées (x, y).
 * @param {number} timer Le délai en millisecondes avant lancer la requête vers l'API.
 * @param {function} callback La fonction à appeler une fois le géocodage terminé.
 */
function geocodeAddress(input, geocodeObject, timer, callback){
    clearTimeout(geocodeTimerId);

    geocodeTimerId = setTimeout(() => {
        if (input.value.length > 2) { 
            const urlApi = `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(input.value)}&autocomplete=0&index=address&limit=1&returntruegeometry=false`;
            fetch(urlApi)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.features.length > 0) {
                        geocodeObject.x = data.features[0].geometry.coordinates[0];
                        geocodeObject.y = data.features[0].geometry.coordinates[1];
                    } else {
                        geocodeObject = {};
                    }
                    if (typeof callback === 'function') {
                        callback();
                    }
                })
                .catch(error => {
                    geocodeObject = {};
                    console.error('Erreur lors de la requête API:', error);
                });
        } else {
            geocodeObject = {};
        }
    }, timer);
}

/**
 * Filtre les résultats à l'aide des données saisies.
 */
function filter(){
    if (carpoolListData.length <= 1) {
        return;
    }

    const filterInfoHTML = document.getElementById("filterInfoHTML");
    filterInfoHTML.innerHTML = "";

    eco = filterEco.checked ? 1 : 0;    // 1 => affiche que les eco, 0 => affiche tout
    if (filterMaxPrice.value === "") {
        price = Infinity;
    } else {
        price = Number.parseInt(escapeHTML(filterMaxPrice.value));
    }
    if (filterMinNote.value === "") {
        note = 0;
    } else {
        note = Number.parseFloat(escapeHTML(filterMinNote.value));
    }

    nbFilteredResults = 0;
    document.querySelectorAll('.result_item').forEach(item => {
        const dataEco = Number.parseInt(item.dataset.eco);
        const dataPrice = Number.parseInt(item.dataset.price);
        const dataNote = Number.parseFloat(item.dataset.note);

        if (dataEco >= eco && dataPrice <= price && dataNote >= note) {
            nbFilteredResults++;
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });

    if (carpoolListData.length > nbFilteredResults && carpoolListData.length > 1) {
        if (nbFilteredResults === 1) {
            filterInfoHTML.innerHTML = `
                    <p> ${nbFilteredResults} covoiturage trouvé</p>
                    <p class="italic">(${carpoolListData.length} hors filtres)</p>
                    <button type="button" class="btn" id="btnInitFilter">Réinitialiser les filtres</button>
            `;
        }else {
            filterInfoHTML.innerHTML = `
                    <p> ${nbFilteredResults} covoiturages trouvés</p>
                    <p class="italic">(${carpoolListData.length} hors filtres)</p>
                    <button type="button" class="btn" id="btnInitFilter">Réinitialiser les filtres</button>
            `;
        }
        const btnInitFilter = document.getElementById("btnInitFilter");
        btnInitFilter.addEventListener("click", () => {
            filterEco.checked = false;
            filterMaxPrice.value = "";
            filterMinNote.value = "";
            filter();
        });
    } else {
        filterInfoHTML.innerHTML = `
                <p> ${nbFilteredResults} covoiturages trouvés</p>
        `;
    }
}
