import { apiUrl, getInfoUser, getToken } from '../script.js';
import { checkIfInputNonEmpty, escapeHTML }from '../Tools/tools.js';
// IL RESTE LES PREFERENCES A GERER cf. function initPage()
// IL RESTE LES PREFERENCES A GERER cf. function initPage()

let userData;

/**
 * Initialise la page avec les préférences et le véhicule principale de l'utilisateur si il a bien le rôle utilisateur "driver".
 */
export async function initPage() {
    userData = await getInfoUser();
    if (userData.usageRole.length === 0) {
        const h1 = document.querySelector('h1');
        while (h1.nextElementSibling) {
            h1.nextElementSibling.remove();
        }
        h1.insertAdjacentHTML('afterend', `
            <a href="/user" class="btn btn_link">Page utilisateur</a>
            `);
        h1.insertAdjacentHTML('afterend', `
            <p>Vous devez vous déclarer "conducteur" dans la page utilisateur</p>
            `);
        return;
    }
    // const preferencesForm = document.getElementById("preferencesForm");
    // await loadPreferences();
    const mainCar = document.getElementById("mainCar");
    mainCar.innerHTML = await loadMainCar();
}

/**
 * Insère le véhicule principal dans le HTML à l'aide de getMainCar.
 *
 * @async
 */
async function loadMainCar() {
    try {
        const mainCarData = await getMainCar();
        if (mainCarData.length === 0) {
            return `
                <p>Vous n'avez pas de véhicules saisies, veuillez ajouter un véhicule.</p>
            `;
        } else {
            return `
                <div class="car_select">
                    <div class="item item_1">
                        <p class="underlined">Marque :</p>
                        <p>${mainCarData.model.brand.brand}</p>
                    </div>
                    <div class="item item_2">
                        <p class="underlined">Modèle :</p>
                        <p>${mainCarData.model.model}</p>
                    </div>
                    <div class="item item_3">
                        <p class="underlined">Couleur :</p>
                        <p>${mainCarData.color.color}</p>
                    </div>
                    <div class="item item_4">
                        <p class="underlined">Energie :</p>
                        <p>${mainCarData.energy.energy}</p>
                    </div>
                </div>
                <div class="car_other">
                    <div class="item">
                        <p class="underlined">Nombre de places :</p>
                        <p>${mainCarData.placeNb}</p>
                    </div>
                    <div class="item">
                        <p class="underlined">Immatriculation :</p>
                        <p>${mainCarData.licencePlate}</p>
                    </div>
                    <div class="item">
                        <p class="underlined">Première immatriculation :</p>
                        <p>${mainCarData.firstRegistration.substring(0, 10)}</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        alert("Erreur lors du chargement du véhicule : ", error);
        return `
            <p>Erreur lors du chargement du véhicule</p>
        `;
    }
}

/**
 * Récupère le véhicule principal de l'utilisateur connecté via une requête HTTP GET.
 *
 * @async
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getMainCar(){
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append('accept', 'application/json');

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(apiUrl + "car/show/" + userData.email , requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || "Erreur inconnue");
                });
            }
        })
        .catch(error => {
            alert(error.message);
    });
}


