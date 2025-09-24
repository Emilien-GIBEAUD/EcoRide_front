import { apiUrl, getInfoUser, getToken } from '../script.js';
import { dateToDateShort}from '../Tools/tools.js';

let userData;
let carpoolListPending;
let carpoolListOngoing;
let carpoolListEnded;

/**
 * Initialise la page avec les préférences et le véhicule principal de l'utilisateur si il a bien le rôle utilisateur "driver".
 */
export async function initPage() {
    userData = await getInfoUser();
    carpoolListPending = document.getElementById("carpoolListPending");
    carpoolListOngoing = document.getElementById("carpoolListOngoing");
    carpoolListEnded = document.getElementById("carpoolListEnded");
    // carpoolList.innerHTML = await loadCarpoolList();
    await loadCarpoolList();
}

/**
 * Insère la liste des covoiturages dans le HTML à l'aide de getCarpoolList.
 *
 * @async
 */
async function loadCarpoolList() {
    try {
        const carpoolListData = await getCarpoolList();
        console.log(carpoolListData);
        let pending = "<p>Vous n'avez pas de covoiturage(s) à venir.</p>";
        let ongoing = "<p>Vous n'avez pas de covoiturage en cours.</p>";
        let ended = "<p>Vous n'avez pas de covoiturage(s) passés.</p>";
        
        if (carpoolListData.length !== 0) { // Si au moins un covoiturage
            carpoolListData.forEach(elem => {
                if (elem.travel.status === "à venir") {
                    if (pending === "<p>Vous n'avez pas de covoiturage(s) à venir.</p>") {
                        pending = "";
                    }
                    pending += `
                        <div class="carpool_item">
                            <div class="carpool_sub_item">
                                <p class="underlined bold">Le :</p>
                                <p>${dateToDateShort(elem.travel.depDateTime)}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item">
                                <p class="underlined bold">De :</p>
                                <p>${elem.travel.depAddress}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item">
                                <p class="underlined bold">Vers :</p>
                                <p>${elem.travel.arrAddress}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item last_item">
                                <a href="/car_edit?id=1" class="btn btn_link">...Détails...</a>
                                <a href="/car_edit?id=1" class="btn btn_link btn_danger">...Annuler...</a>
                                <button type="button" class="btn" id="btnDeleteCarpool1">...Démarrer...</button>
                            </div>
                        </div>
                    `;
                }
                if (elem.travel.status === "en cours") {
                    if (ongoing === "<p>Vous n'avez pas de covoiturage en cours.</p>") {
                        ongoing = "";
                    }
                    ongoing += `
                        <div class="carpool_item">
                            <div class="carpool_sub_item">
                                <p class="underlined bold">Le :</p>
                                <p>${dateToDateShort(elem.travel.depDateTime)}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item">
                                <p class="underlined bold">De :</p>
                                <p>${elem.travel.depAddress}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item">
                                <p class="underlined bold">Vers :</p>
                                <p>${elem.travel.arrAddress}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item last_item">
                                <a href="/car_edit?id=1" class="btn btn_link">...Détails...</a>
                                <button type="button" class="btn" id="btnDeleteCarpool1">...Arrivé à destination...</button>
                            </div>
                        </div>
                    `;
                }
                if (elem.travel.status === "terminé") {
                    if (ended === "<p>Vous n'avez pas de covoiturage(s) passés.</p>") {
                        ended = "";
                    }
                    ended += `
                        <div class="carpool_item">
                            <div class="carpool_sub_item">
                                <p class="underlined bold">Le :</p>
                                <p>${dateToDateShort(elem.travel.depDateTime)}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item">
                                <p class="underlined bold">De :</p>
                                <p>${elem.travel.depAddress}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item">
                                <p class="underlined bold">Vers :</p>
                                <p>${elem.travel.arrAddress}</p>
                                <p>|</p>
                            </div>
                            <div class="carpool_sub_item last_item">
                                <a href="/car_edit?id=1" class="btn btn_link">...Détails...</a>
                                <button type="button" class="btn" id="btnDeleteCarpool1">...Laisser un avis...</button>
                            </div>
                        </div>
                    `;
                }
            });
        }
        carpoolListPending.innerHTML = pending;
        carpoolListOngoing.innerHTML = ongoing;
        carpoolListEnded.innerHTML = ended;
    } catch (error) {
        alert("Erreur lors du chargement des covoiturages : ", error);
    }
}

/**
 * Récupère la liste des covoiturages de l'utilisateur connecté via une requête HTTP GET.
 *
 * @async
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getCarpoolList(){
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append('accept', 'application/json');

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(apiUrl + "travel/list/" + userData.email , requestOptions)
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

document.addEventListener('click', function(e) {
    if (e.target.id.startsWith('btnDeleteCarpool')) {
        const carId = e.target.id.replace('btnDeleteCarpool', '');
        deleteCar(carId);
    }
});

/**
 * Supprime un covoiturage via une requête HTTP DELETE.
 *
 * @async
 * @param {integer} id - L'id du covoiturage à supprimer.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function deleteCarpool(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce covoiturage ?')) {
        return;
    } 
    console.log("Suppression covoiturage : " + id);
    
    // const myHeaders = new Headers();
    // myHeaders.append("X-AUTH-TOKEN", getToken());

    // const requestOptions = {
    //     method: "DELETE",
    //     headers: myHeaders,
    //     redirect: "follow"
    // };

    // return fetch(apiUrl + "picture/" + pictureName, requestOptions)
    //     .then(response => {
    //         if (response.ok) {
    //             alert("Image supprimé avec succès !");
    //             document.location.href="/galerie";
    //         } else {
    //             throw new Error("Impossible de récupérer l'image !");
    //         }
    //     })
    //     .catch(error => {
    //         console.error(error);
    // });
}