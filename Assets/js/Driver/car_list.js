import { apiUrl, getInfoUser, getToken } from '../script.js';
// IL RESTE LA MODIFICATION ET LA SUPPRESSION A GERER

let userData;

/**
 * Initialise la page avec les préférences et le véhicule principal de l'utilisateur si il a bien le rôle utilisateur "driver".
 */
export async function initPage() {
    userData = await getInfoUser();
    const carList = document.getElementById("carList");
    carList.innerHTML = await loadCarList();
}

/**
 * Insère la liste des véhicules dans le HTML à l'aide de getCarList.
 *
 * @async
 */
async function loadCarList() {
    try {
        const carListData = await getCarList();
        if (carListData.length === 0) {
            return `
                <p>Vous n'avez pas de véhicules saisies, veuillez ajouter un véhicule.</p>
            `;
        } else {
            let carListHTML = "";
            let main;
            carListData.forEach(elem => {
                if (elem.main) {
                    main = "<p class='bold info_main_car'>Ce véhicule est votre véhicule principal</p>";
                } else {
                    main = "<p>En construction...</p> <button type='button' class='btn info_main_car' id='btnDeclareMainCar${elem.id}'>Déclarer comme véhicule principal</button>";
                }
                carListHTML += `
                    <div class="car_item">
                        ${main}
                        <div class="car_select">
                            <div class="item item_1">
                                <p class="underlined">Marque :</p>
                                <p>${elem.model.brand.brand}</p>
                            </div>
                            <div class="item item_2">
                                <p class="underlined">Modèle :</p>
                                <p>${elem.model.model}</p>
                            </div>
                            <div class="item item_3">
                                <p class="underlined">Couleur :</p>
                                <p>${elem.color.color}</p>
                            </div>
                            <div class="item item_4">
                                <p class="underlined">Energie :</p>
                                <p>${elem.energy.energy}</p>
                            </div>
                        </div>
                        <div class="car_other">
                            <div class="item">
                                <p class="underlined">Nombre de places :</p>
                                <p>${elem.placeNb}</p>
                            </div>
                            <div class="item">
                                <p class="underlined">Immatriculation :</p>
                                <p>${elem.licencePlate}</p>
                            </div>
                            <div class="item">
                                <p class="underlined">Première immatriculation :</p>
                                <p>${elem.firstRegistration.substring(0, 10)}</p>
                            </div>
                        </div>
                        <div class="car_action">
                            <p>En construction...</p>
                            <a href="/car_edit?id=${elem.id}" class="btn btn_link">Modifier</a>
                            <button type="button" class="btn btn_danger" id="btnDeleteCar${elem.id}">Supprimer</button>
                            <p>...</p>
                        </div>
                    </div>
                `;
            });
            return carListHTML;
        }
    } catch (error) {
        alert("Erreur lors du chargement du véhicule : ", error);
        return `
            <p>Erreur lors du chargement du véhicule</p>
        `;
    }
}

/**
 * Récupère la liste des véhicules de l'utilisateur connecté via une requête HTTP GET.
 *
 * @async
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getCarList(){
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append('accept', 'application/json');

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch(apiUrl + "car/showAll/" + userData.email , requestOptions)
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
    if (e.target.id.startsWith('btnDeleteCar')) {
        const carId = e.target.id.replace('btnDeleteCar', '');
        deleteCar(carId);
    }
});

/**
 * Supprime un véhicule via une requête HTTP DELETE.
 *
 * @async
 * @param {integer} id - L'id du véhicule à supprimer.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function deleteCar(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
        return;
    } 
    console.log("Suppression véhicule : " + id);
    
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