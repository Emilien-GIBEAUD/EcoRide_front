import { apiUrl, avatarsUrl } from '../script.js';
import { datetime2ToDate, datetime2ToTime }from '../Tools/tools.js';

/**
 * Initialise la page avec ces paramètres.
 * @param {number} params Les paramètres de l'url.
 */
export async function initPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log("Page du trajet :", id);

    loadCarpoolDetails(id);
}

/**
 * Récupère le covoiturage et charge le HTML en conséquence.
 * @async
 * @param {number} paramId L'id du covoiturage à récupérer.
 */
async function loadCarpoolDetails(paramId){
    const carpoolData = await getCarpool(paramId);
    console.log(carpoolData);
    const carpoolHtml = document.getElementById("carpool");

    let availablePlaceTXT;
    if (carpoolData.available_place === 1) {
        availablePlaceTXT = `1 / ${carpoolData.travel_place} place disponible`;
    } else {
        availablePlaceTXT = `${carpoolData.available_place} / ${carpoolData.travel_place} places disponibles`;
    }

    let ecoTravel;
    if (carpoolData.eco === 1) {
        ecoTravel = `
            <div class="carpool_car_item electric_car">
                <p>Voyage écologique</p>
                <img class="pres_icon mb" src="./Assets/icon/electric-car.svg" alt="icône de voiture électrique">
            </div>
        `;
    } else {
        ecoTravel = '';
    }

    let note;
    if (carpoolData.note === null) {
        note = "pas de note";
    } else {
        note = carpoolData.note + " /10";
    }

    carpoolHtml.innerHTML = `
        <div class="carpool_user">
            <h2 class="underlined">Le covoitureur :</h2>
            <div class="carpool_user_info">
                <img src="${avatarsUrl + carpoolData.avatar_file}" alt="Avatar de l'utilisateur" />
                <p>${carpoolData.pseudo}</p>
                <p><b>note : </b>${note}</p>
                <p>Fumeurs(à venir) ...</p><!-- Fumeurs non acceptés --><!-- Fumeurs acceptés -->
                <p>Animaux(à venir) ...</p><!-- Animaux non acceptés --><!-- Animaux acceptés -->
                <div class="whole_width">
                    <p class="underlined pb_2">Ses autres préférences :</p>
                    <p>Autres préférences(à venir) ...</p>
                    <!-- <p>Détour maximum de 10 km pour récupérer ou déposer le passager. Me prévenir si vous avez de gros bagages pour que j'ajuste le nombre de place au besoin (sans suppléments de tarif).</p> -->
                </div>
                <a href="#" class="btn btn_link">Voir les avis du covoitureur</a>
            </div>
        </div>
        <div class="carpool_info">
            <h2 class="underlined">Date et horaire de départ :</h2>
            <p>Le ${datetime2ToDate(carpoolData.dep_date_time)} à ${datetime2ToTime(carpoolData.dep_date_time)}</p>
        </div>
        <div class="carpool_info">
            <h2 class="underlined">Adresse de départ :</h2>
            <p>${carpoolData.dep_address}</p>
        </div>
        <div class="carpool_info">
            <h2 class="underlined">Adresse d'arrivée :</h2>
            <p>${carpoolData.arr_address}</p>
        </div>
        <div class="carpool_info">
            <h2 class="underlined">Date et horaire d'arrivée :</h2>
            <p>Le ${datetime2ToDate(carpoolData.arr_date_time)} à ${datetime2ToTime(carpoolData.arr_date_time)}</p>
        </div>
        <div class="carpool_info">
            <h2 class="underlined">Véhicule :</h2>
            <div class="carpool_car_item">
                <p>${carpoolData.brand}</p>
                <p>${carpoolData.model}</p>
                <p>${carpoolData.energy}</p>
            </div>
            ${ecoTravel}
            <div class="carpool_car_item">
                <div>
                    <p class="underlined pb_2">Nombre de places :</p>
                    <p>${availablePlaceTXT}</p>
                </div>
                <div>
                    <p class="underlined pb_2">Prix :</p>
                    <p>${carpoolData.price} crédits</p>
                </div>
            </div>
        </div>
        <div class="carpool_actions">
            <button type="button" class="btn" id="btnParticipate">Participer</button>
            <button type="button" class="btn btn_danger" id="btnParticipate">Annuler</button>
            <button type="button" class="btn" id="btnParticipate">Démarrer</button>
            <button type="button" class="btn" id="btnParticipate">Arrivé à destination</button>
            <a href="#" class="btn btn_link">Laisser un avis</a>
        </div>
    `;
}

/**
 * Récupère le covoiturage via une requête HTTP GET.
 *
 * @async
 * @param {number} paramId L'id du covoiturage à récupérer.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getCarpool(paramId){
    return fetch(apiUrl + "travel/" + paramId)
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
