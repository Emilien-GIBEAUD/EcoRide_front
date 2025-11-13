import { apiUrl, getToken } from '../script.js';
import { checkIfInputNonEmpty, escapeHTML }from '../Tools/tools.js';

let brandList;
let colorList;
let energyList;
let modelList;
let modelOK = false;

/**
 * Initialise la page avec les listes Marque, Couleur et Energie.
 */
export async function initPage() {
    await loadLists();
    const brand = document.getElementById("brand");
    const color = document.getElementById("color");
    const energy = document.getElementById("energy");
    const model = document.getElementById("model");
    sendListToHTML(brand, brandList,"brand");
    sendListToHTML(color, colorList,"color");
    sendListToHTML(energy, energyList,"energy");
    brand.addEventListener("change", () => loadSubList(model,modelList,"model",brand.value));
}

/**
 * Récupère les listes à l'aide de getListFromAPI.
 *
 * @async
 */
async function loadLists() {
    try {
        brandList = await getListFromAPI("brand");
        colorList = await getListFromAPI("color");
        energyList = await getListFromAPI("energy");
    } catch (error) {
        console.error("Erreur lors du chargement des listes : ", error);
    }
}

/**
 * Récupère une sous liste à l'aide de getSubListFromAPI et rempli un élément HTML avec cette sous liste à l'aide de sendListToHTML.
 *
 * @async
 * @param {string} htmlElement - L'élément HTML concernée.
 * @param {string} subList - Nom de la sous liste concernée (array).
 * @param {string} objectName - Nom de l'objet concerné (l'attribut de la DB).
 * @param {string} listValue - La valeur dans la liste dont provient la sous liste.
 */
async function loadSubList(htmlElement, subList, objectName, listValue) {
    try {
        modelOK = true;
        subList = await getSubListFromAPI(objectName, listValue);
        sendListToHTML(htmlElement, subList,objectName);
        checkInputs(); // Active btnAddCar si la marque est choisie en dernier
    } catch (error) {
        console.error("Erreur lors du chargement de la liste de modèles : ", error);
    }
}

const nbPlaceAddCar = document.getElementById("nbPlaceAddCar");
const licenceAddCar = document.getElementById("licenceAddCar");
const firstRegistrationAddCar = document.getElementById("firstRegistrationAddCar");
const btnAddCar = document.getElementById("btnAddCar");
const addCarForm = document.getElementById("addCarForm");

btnAddCar.disabled = true;
// Vérification du formulaire saisi
nbPlaceAddCar.addEventListener("keyup", checkInputs);
licenceAddCar.addEventListener("keyup", checkInputs);
firstRegistrationAddCar.addEventListener("keyup", checkInputs);

/**
 * Vérifie tous les inputs.
 */
async function checkInputs(){
    const nbPlaceOK = checkIfInputNonEmpty(nbPlaceAddCar);
    const licenceOK = checkIfInputNonEmpty(licenceAddCar);
    const firstRegistrationOK = checkIfInputNonEmpty(firstRegistrationAddCar);
    const inputNonEmpty = nbPlaceOK && licenceOK && firstRegistrationOK && modelOK;
    // modelOK au premier changement de marque (cf. loadSubList)

    // Envoie du formulaire
    btnAddCar.addEventListener("click", addCar);

    if(inputNonEmpty) {
        btnAddCar.disabled = false;
    } else {
        btnAddCar.disabled = true;
    }
}

/**
 * Ajoute un véhicule dans la BDD via une requête HTTP POST.
 */
function addCar(){
    const formData = new FormData(addCarForm);

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    // Echape le HTML des inputs et crée l'objet JSON
    const raw = JSON.stringify({
        brand: escapeHTML(formData.get("brand")),
        model: escapeHTML(formData.get("model")),
        color: escapeHTML(formData.get("color")),
        energy: escapeHTML(formData.get("energy")),
        placeNb: parseInt(escapeHTML(formData.get("placeNb"))),
        licencePlate: escapeHTML(formData.get("licencePlate")),
        firstRegistration: escapeHTML(formData.get("firstRegistration")),
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(apiUrl + "car/add", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de l'enregistrement du véhicule !");
            }
        })
        .then(result => {
            alert("Votre véhicule a été enregistré.");
            document.location.href="/driver";
        })
        .catch(error => {
            alert(error.message);
        }
    );
}

/**
 * Récupère une liste via une requête HTTP GET.
 *
 * @async
 * @param {string} list - Nom de la liste concernée.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getListFromAPI(list){
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(apiUrl + list, requestOptions)
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
 * Récupère une sous liste via une requête HTTP GET.
 *
 * @async
 * @param {string} subList - Nom de la sous liste concernée.
 * @param {string} choice - Choix déterminant la sous liste concernée.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getSubListFromAPI(subList, choice){
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(apiUrl + subList + "/" + choice, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Impossible de récupérer la sous liste !");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

/**
 * Rempli un élément HTML avec une liste.
 *
 * @param {string} htmlElement - L'élément HTML concernée.
 * @param {string} list - Nom de la liste concernée (array).
 * @param {string} objectName - Nom de l'objet concerné (l'attribut de la DB).
 */
function sendListToHTML(htmlElement, list, objectName){
    htmlElement.innerHTML = "";
    list.forEach(elem => {
        htmlElement.innerHTML += '<option value="' + elem[objectName] + '">' + elem[objectName] + '</option>' ;
    })
}