import { apiUrl, getInfoUser, getToken } from '../script.js';
import { checkIfInputNonEmpty, dateToDatetimeLocal, escapeHTML }from '../Tools/tools.js';

let carList;
let userData;

let depGeocode = {};
let arrGeocode = {};

let duration = 0;                       // Initialisation de la durée du voyage en minute
let travelDuration = 0;                 // Initialisation de la durée du voyage en minute (temps de pause inclus)

let timeoutProposeAddressId;            // ID du timeout pour proposer des adresses
let timeoutGeocodeId;                   // ID du timeout pour géocoder une adresse
let timeoutDurationCalculatedId;        // ID du timeout pour calculer la durée du voyage
const timeoutProposeAddress = 1000 ;    // Délai en millisecondes avant de proposer des adresses
const timeoutGeocode = 2000 ;           // Délai en millisecondes avant de géocoder une adresse
const timeoutDurationCalculated = 500 ; // Délai en millisecondes avant de calculer la durée du voyage

/**
 * Initialise la page avec la liste des véhicules de l'utilisateur et les écouteurs sur les inputs.
 */
export async function initPage() {
    userData = await getInfoUser();
    await loadCarpoolAdd();

    const depDateAddCarpool = document.getElementById("depDateAddCarpool");
    const depAddressAddCarpool = document.getElementById("depAddressAddCarpool");
    const depSuggestion = document.getElementById("depSuggestion");
    const arrAddressAddCarpool = document.getElementById("arrAddressAddCarpool");
    const arrSuggestion = document.getElementById("arrSuggestion");
    const arrDateAddCarpool = document.getElementById("arrDateAddCarpool");
    const priceAddCarpool = document.getElementById("priceAddCarpool");
    const nbPlaceAddCarpool = document.getElementById("nbPlaceAddCarpool");

    const btnAddCarpool = document.getElementById("btnAddCarpool");
    const addCarpoolForm = document.getElementById("addCarpoolForm");

    // Vérification du formulaire saisi
    btnAddCarpool.disabled = true;
    depDateAddCarpool.addEventListener("keyup", checkInputs);
    depAddressAddCarpool.addEventListener("keyup", checkInputs);
    arrAddressAddCarpool.addEventListener("keyup", checkInputs);
    arrDateAddCarpool.addEventListener("keyup", checkInputs);
    priceAddCarpool.addEventListener("keyup", checkInputs);
    nbPlaceAddCarpool.addEventListener("keyup", checkInputs);

    // Au changement de l'horaire de départ (en cas de saisie après les adresses) : calcule la durée [si calcul possible])
    depDateAddCarpool.addEventListener('change', () => {
        checkAndCalculateDuration();
    });
    initAddressSuggestions(depAddressAddCarpool, depSuggestion, depGeocode);
    initAddressSuggestions(arrAddressAddCarpool, arrSuggestion, arrGeocode);

    const car = document.getElementById("car");
    sendCarListToHTML();
}

/**
 * Récupère les listes à l'aide de getListFromAPI.
 *
 * @async
 */
async function loadCarpoolAdd() {
    try {
        carList = await getCarListFromAPI();
        const carpoolAdd = document.getElementById("carpoolAdd");
        if (carList.length === 0) {
            carpoolAdd.innerHTML = `
                <p>Vous n'avez pas de véhicules saisies, vous devez ajouter un véhicule avant de pouvoir saisir un covoiturage.</p><br>
                <a href="./car_add" class="btn btn_link">Ajouter un véhicule</a>
            `;
        } else {
            carpoolAdd.innerHTML = `
                <form id="addCarpoolForm">
                    <div class="form_input">
                        <label for="depDateAddCarpool">Date et horaire de départ :</label>
                        <input type="datetime-local" id="depDateAddCarpool" name="depDateTime">
                    </div>
                    <div class="form_input">
                        <label for="depAddressAddCarpool">Adresse de départ :</label>
                        <input type="text" id="depAddressAddCarpool" placeholder="Votre adresse de départ" name="depAddress">
                        <div id="depSuggestion" class="suggestion_box"></div>
                    </div>
                    <div class="form_input">
                        <label for="arrAddressAddCarpool">Adresse d'arrivée :</label>
                        <input type="text" id="arrAddressAddCarpool" placeholder="Votre adresse d'arrivée" name="arrAddress">
                        <div id="arrSuggestion" class="suggestion_box"></div>
                    </div>
                    <div class="form_input">
                        <label for="arrDateAddCarpool">Date et horaire d'arrivée *:</label>
                        <input type="datetime-local" id="arrDateAddCarpool" name="arrDateTime">
                        <p class="info">* Vous pouvez modifier l'horaire d'arrivée si vous estimez la durée de voyage différente (durée estimée en tenant compte de l'itinéraire le plus rapide et d'une pose de 15 minutes toutes les 2 heures).</p>
                    </div>
                    <div class="carpool_select_car">
                        <label for="car">Vos véhicules :</label>
                        <select name="car" id="car">
                                <!-- Injecté -->
                        </select>
                    </div>
                    <div class="form_input">
                        <label for="priceAddCarpool">Prix *:</label>
                        <input type="number" id="priceAddCarpool" name="price" min="2" max="100" >
                        <p class="info">* Pour garantir son bon fonctionnement, la plateforme conservera 2 crédits.</p>
                    </div>
                    <div class="form_input">
                        <label for="nbPlaceAddCarpool">Nombre de places :</label>
                        <input type="number" id="nbPlaceAddCarpool" name="travelPlace" min="1" max="9" >
                    </div>
                    <div>
                        <button type="button" class="btn" id="btnAddCarpool">Poster votre covoiturage</button>
                    </div>
                </form>
            `;
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la liste des véhicules : ", error);
    }
}

/**
 * Récupère la liste des véhicules de l'utilisateur via une requête HTTP GET.
 *
 * @async
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getCarListFromAPI(){
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(apiUrl + "car/showAll/" + userData.email, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Impossible de récupérer la liste !");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

/**
 * Rempli l'élément HTML avec la liste des véhicules de l'utilisateur.
 */
function sendCarListToHTML(){
    car.innerHTML = "";
    carList.forEach(elem => {
        car.innerHTML += '<option value="' + elem.id + '">' + elem.model.model + ' - ' + elem.licencePlate + '</option>' ;
    })
}

/**
 * Vérifie tous les inputs.
 */
async function checkInputs(){
    const depDateOK = checkIfInputNonEmpty(depDateAddCarpool);
    const depAddressOK = checkIfInputNonEmpty(depAddressAddCarpool);
    const arrAddressOK = checkIfInputNonEmpty(arrAddressAddCarpool);
    const arrDateOK = checkIfInputNonEmpty(arrDateAddCarpool);
    const priceOK = checkIfInputNonEmpty(priceAddCarpool);
    const nbPlaceOK = checkIfInputNonEmpty(nbPlaceAddCarpool);
    const inputNonEmpty = depDateOK && depAddressOK && arrAddressOK && arrDateOK && priceOK && nbPlaceOK;

    // Envoie du formulaire
    btnAddCarpool.addEventListener("click", addCarpool);

    if(inputNonEmpty) {
        btnAddCarpool.disabled = false;
    } else {
        btnAddCarpool.disabled = true;
    }
}

/**
 * Ajoute un voyage dans la BDD via une requête HTTP POST.
 */
function addCarpool(){
    const formData = new FormData(addCarpoolForm);

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    // Echape le HTML des inputs et crée l'objet JSON
    const raw = JSON.stringify({
        travelPlace: parseInt(escapeHTML(formData.get("travelPlace"))),
        price: parseInt(escapeHTML(formData.get("price"))),
        depDateTime: escapeHTML(formData.get("depDateTime")),
        depAddress: escapeHTML(formData.get("depAddress")),
        depGeoX: parseFloat(depGeocode.x),
        depGeoY: parseFloat(depGeocode.y),
        arrDateTime: escapeHTML(formData.get("arrDateTime")),
        arrAddress: escapeHTML(formData.get("arrAddress")),
        arrGeoX: parseFloat(arrGeocode.x),
        arrGeoY: parseFloat(arrGeocode.y),
        car: parseInt(escapeHTML(formData.get("car"))),
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(apiUrl + "travel/add", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de l'enregistrement du covoiturage !");
            }
        })
        .then(result => {
            alert("Votre covoiturage a été enregistré.");
            document.location.href="/carpool_list";
        })
        .catch(error => {
            alert(error.message);
        }
    );
}

/**
 * Initialise les événements pour gérer l'affichage des suggestions, le géocodage des adresses, le calcul de la durée de voyage et l'affichage de la date d'arrivée en conséquence.
 * @param {HTMLInputElement} input L'élément input qui déclenchera les événements.
 * @param {HTMLElement} suggestionContainer Le conteneur où afficher les adresses proposées.
 * @param {object} geocodeObject L'objet stockant les coordonnées géocodées (x, y).
 */
function initAddressSuggestions(input, suggestionContainer, geocodeObject) {
    // Lors de la saisie dans l'input (propose des suggestions, géocode l'adresse et calcule la durée [si calcul possible])
    input.addEventListener("keyup", () => {
        proposeAddress(input, suggestionContainer, timeoutProposeAddress);
        geocodeAddress(input, geocodeObject, timeoutGeocode, checkAndCalculateDuration);
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
    // A la modification de l'input (géocode l'adresse et calcule la durée [si calcul possible])
    input.addEventListener("change", () => {
        geocodeAddress(input, geocodeObject, timeoutGeocode, checkAndCalculateDuration);
    });

}

/**
 * Propose des adresses en cours de saisie à l'aide de l'API Geoplateforme.
 * @param {HTMLInputElement} input L'élément input qui a déclenché l'événement.
 * @param {HTMLElement} suggestionContainer Le conteneur où afficher les adresses proposées.
 * @param {number} timer Le délai en millisecondes avant de lancer la requête API.
 */
function proposeAddress(input, suggestionContainer, timer){
    clearTimeout(timeoutProposeAddressId);

    timeoutProposeAddressId = setTimeout(() => {
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

/**
 * Geocode une adresse en cours de saisie à l'aide de l'API Geoplateforme.
 * @param {HTMLInputElement} input L'élément input qui a déclenché l'événement.
 * @param {object} geocodeObject L'objet stockant les coordonnées géocodées (x, y).
 * @param {number} timer Le délai en millisecondes avant lancer la requête vers l'API.
 * @param {function} callback La fonction à appeler une fois le géocodage terminé.
 */
function geocodeAddress(input, geocodeObject, timer, callback){
    clearTimeout(timeoutGeocodeId);

    timeoutGeocodeId = setTimeout(() => {
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
 * Vérifie si les deux adresses ont été géocodées et lance la fonction durationCalculated pour calculer la durée.
 */
function checkAndCalculateDuration() {
    // Si la date de départ est saisie et les deux adresses géocodées
    if (depGeocode.hasOwnProperty('x') && arrGeocode.hasOwnProperty('x') 
    && depDateAddCarpool.value !== '') {
        durationCalculated(depGeocode, arrGeocode, timeoutDurationCalculated);
    }
    // Si la date de départ ou une des deux adresses géocodées sont supprimées après le géocodage des adresses
    if (Object.keys(depGeocode).length === 0 || Object.keys(arrGeocode).length === 0
    || depDateAddCarpool.value === '') {
        duration = 0;
        travelDuration = 0;
        arrDateAddCarpool.value = '';
    }
}

/**
 *  Calcul la durée en minute entre l'adresse de départ et d'arrivée à l'aide de l'API Geoplateforme. La durée est mise dans travelDuration et l'horaire d'arrivée est mise à jour en conséquence.
 * @param {object} depGeocodeObject L'objet stockant les coordonnées de départ géocodées (x, y).
 * @param {object} arrGeocodeObject L'objet stockant les coordonnées d'arrivée géocodées (x, y).
 * @param {number} timer Le délai en millisecondes avant de lancer la requête API.
 */
function durationCalculated(depGeocodeObject, arrGeocodeObject, timer){
    clearTimeout(timeoutDurationCalculatedId);

    timeoutDurationCalculatedId = setTimeout(() => {
        const body = {
            resource: "bdtopo-osrm",
            // il faut une string pour start et end, exemple : "2.337306,48.849319"
            start: [depGeocodeObject.x, depGeocodeObject.y].join(','),
            end: [arrGeocodeObject.x, arrGeocodeObject.y].join(','),
            profile: "car",
            optimization: "fastest",
            distanceUnit: "kilometer",
            timeUnit: "minute",
        };

        const raw = JSON.stringify(body);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: raw,
        };

        fetch("https://data.geopf.fr/navigation/itineraire", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                duration = Math.round(data.duration);
                travelDuration = Math.floor(duration/120) * 15 + duration;
                const depDate = new Date(depDateAddCarpool.value);
                const arrDate = new Date(depDate.getTime() + travelDuration * 60000);
                arrDateAddCarpool.value = dateToDatetimeLocal(arrDate);
            })
            .catch(error => {
                console.error('Erreur lors de la requête API:', error);
            });
    }, timer);
}
