import { apiUrl, getInfoUser, getToken } from '../script.js';
import { checkIfInputNonEmpty, escapeHTML }from '../Tools/tools.js';

let carList;
let userData;

/**
 * Initialise la page avec la liste des véhicules de l'utilisateur.
 */
export async function initPage() {
    userData = await getInfoUser();
    await loadCarpoolAdd();

    const depDateAddCarpool = document.getElementById("depDateAddCarpool");
    const depAddressAddCarpool = document.getElementById("depAddressAddCarpool");
    const arrAddressAddCarpool = document.getElementById("arrAddressAddCarpool");
    const arrDateAddCarpool = document.getElementById("arrDateAddCarpool");
    const priceAddCarpool = document.getElementById("priceAddCarpool");
    const nbPlaceAddCarpool = document.getElementById("nbPlaceAddCarpool");

    const btnAddCarpool = document.getElementById("btnAddCarpool");
    // const addCarpoolForm = document.getElementById("addCarpoolForm");

    btnAddCarpool.disabled = true;
    // Vérification du formulaire saisi
    depDateAddCarpool.addEventListener("keyup", checkInputs);
    depAddressAddCarpool.addEventListener("keyup", checkInputs);
    arrAddressAddCarpool.addEventListener("keyup", checkInputs);
    arrDateAddCarpool.addEventListener("keyup", checkInputs);
    priceAddCarpool.addEventListener("keyup", checkInputs);
    nbPlaceAddCarpool.addEventListener("keyup", checkInputs);

    // const car = document.getElementById("car");
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
                    </div>
                    <div class="form_input">
                        <label for="arrAddressAddCarpool">Adresse d'arrivée :</label>
                        <input type="text" id="arrAddressAddCarpool" placeholder="Votre adresse d'arrivée" name="arrAddress">
                    </div>
                    <div class="form_input">
                        <label for="arrDateAddCarpool">Date et horaire d'arrivée :</label>
                        <input type="datetime-local" id="arrDateAddCarpool" name="arrDateTime">
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
                        <button type="button" class="btn" id="btnAddCarpool">Ajouter (En construction...)</button>
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
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
    }

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    // Echape le HTML des inputs et crée l'objet JSON
    const raw = JSON.stringify({
        depDateTime: escapeHTML(formData.get("depDateTime")),
        depAddress: escapeHTML(formData.get("depAddress")),
        arrDateTime: escapeHTML(formData.get("arrDateTime")),
        arrAddress: escapeHTML(formData.get("arrAddress")),
        car: parseInt(escapeHTML(formData.get("car"))),
        price: parseInt(escapeHTML(formData.get("price"))),
        travelPlace: parseInt(escapeHTML(formData.get("travelPlace"))),
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };
    console.log(requestOptions);


    // fetch(apiUrl + "car/add", requestOptions)
    //     .then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             throw new Error("Erreur lors de l'enregistrement du véhicule !");
    //         }
    //     })
    //     .then(result => {
    //         alert("Votre véhicule a été enregistré.");
    //         document.location.href="/driver";
    //     })
    //     .catch(error => {
    //         alert(error.message);
    //     }
    // );
}
