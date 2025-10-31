import { apiUrl, getInfoUser, isConnected } from './script.js';
import { datetimeToDate}from './Tools/tools.js';

let commentList;

/**
 * Initialise la page avec la liste des avis et les boutons (si un utilisateur est connecté).
 */
export async function initPage() {
    commentList = await getAllReviewsFromAPI();
    sendCommentsToHTML();
    isConnected() ? await sendCommentButtonsToHTML() : await sendSignButtonsToHTML();
}


/**
 * Récupère la liste d'avis via une requête HTTP GET.
 * @async
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getAllReviewsFromAPI(){
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    return fetch(apiUrl + "review/list", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Impossible de récupérer la liste d'avis !");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

/**
 * Rempli le HTML avec la liste de avis.
 */
function sendCommentsToHTML(){
    const comments = document.getElementById("comments");
    comments.innerHTML = "";
    commentList.forEach(elem => {
        comments.innerHTML += `
            <div class="comment_card">
                <div>
                    <p class="bold">${elem.pseudo}</p>
                    <p>posté le ${datetimeToDate(elem.createdAt)}</p>
                    <p>note ${elem.note}/5</p>
                </div>
                <p>${elem.comment}</p>
            </div>
        `;
    })
}

/**
 * Rempli le HTML avec les bouttons concernant les "avis".
 */
async function sendCommentButtonsToHTML(){
    const userData = await getInfoUser();
    const userReview = await getReviewFromAPI(userData.id);
    let hasCommented;
    userReview.length === 0 ? hasCommented = false : hasCommented = true;

    const action = document.getElementById("action");
    if (hasCommented) {
        action.innerHTML = `
            <a href="./review" class="btn btn_link">...Modifier votre avis...</a>
            <a href="./review" class="btn btn_link btn_danger">...Supprimer votre avis...</a>
        `;
    } else {
        action.innerHTML = `
            <a href="./review_app" class="btn btn_link">Laisser un avis</a>
        `;
    }
}

/**
 * Récupère l'avis de l'utilisateur connecté (ou pas si pas d'avis laissé) via une requête HTTP GET.
 * @async
 * @param {int} id - Id de l'utilisateur connecté.
 * @returns {Promise<Response>} Une promesse résolue avec la réponse de la requête fetch.
 */
async function getReviewFromAPI(id){
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    return fetch(apiUrl + "review/" + id , requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Impossible de récupérer la liste d'avis !");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

/**
 * Rempli le HTML avec les bouttons concernant la "connexion".
 */
async function sendSignButtonsToHTML(){
    const action = document.getElementById("action");
    action.innerHTML = `
        <a href="./signin" class="btn btn_link">Connectez vous</a>
        <a href="./signup" class="btn btn_link">Créez votre compte</a>
    `;
}
