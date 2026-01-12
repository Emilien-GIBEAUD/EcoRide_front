import { apiUrl, getInfoUser, isConnected } from './script.js';
import { datetimeToDate}from './Tools/tools.js';

let commentList;
const timerDuration = 30;
let index = 0;
const nbImagesToDisplay = 3;
let autoplay;
let comments;
let commentsContainer;
let nbImages;

/**
 * Initialise la page avec la liste des avis et les boutons (si un utilisateur est connecté).
 */
export async function initPage() {
    const depAddressSearch = document.getElementById("depAddressSearch");
    const arrAddressSearch = document.getElementById("arrAddressSearch");
    const dateSearch = document.getElementById("dateSearch");
    const btnSearchCarpool = document.getElementById("btnSearchCarpool");
    depAddressSearch.addEventListener("focus", () => {document.location.href="/search";});
    arrAddressSearch.addEventListener("focus", () => {document.location.href="/search";});
    dateSearch.addEventListener("focus", () => {document.location.href="/search";});
    btnSearchCarpool.addEventListener("click", () => {document.location.href="/search";});
    commentList = await getAllReviewsFromAPI();
    sendCommentsToHTML();
    isConnected() ? await sendCommentButtonsToHTML() : await sendSignButtonsToHTML();

    //carousel
    comments = document.querySelectorAll(".comment_card");
    commentsContainer = document.getElementById("comments");
    nbImages = comments.length;
    const boutonPrev = document.getElementById("carousel_concert_prev");
    const boutonNext = document.getElementById("carousel_concert_next");

    // Ecouteurs d'événements sur les boutons
    boutonNext.addEventListener("click", () => {
        next();
        resetAutoplay();
    });
    boutonPrev.addEventListener("click", () => {
        prev();
        resetAutoplay();
    });
    updateCarousel(nbImagesToDisplay);
    startAutoplay();
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

// Carousel

/**
 *  Mise à jour du carousel en fonction du nombre d'images à afficher.
 * @param {int} nbImg - Le nombre d'images à afficher.
 */
function updateCarousel(nbImg) {
    commentsContainer.innerHTML = "";
    for (let i = 0; i < nbImg; i++) {
        const position = (index + i) % nbImages;
        commentsContainer.appendChild(comments[position].cloneNode(true));
    }
    // Pour mémoire et compréhension : afficher 3 images :
    // const pos1 = index % nbImages;
    // const pos2 = (index + 1) % nbImages;
    // const pos3 = (index + 2) % nbImages;
    // commentsContainer.appendChild(images[pos1].cloneNode(true));
    // commentsContainer.appendChild(images[pos2].cloneNode(true));
    // commentsContainer.appendChild(images[pos3].cloneNode(true));
}

/**
 *  Passage à l'image suivante.
 */
function next() {
    // const nbImages = comments.length;
    index = (index + 1) % nbImages;
    updateCarousel(nbImagesToDisplay);
}

/**
 *  Passage à l'image précédente.
 */
function prev() {
    // const nbImages = comments.length;
    index = (index - 1 + nbImages) % nbImages;
    updateCarousel(nbImagesToDisplay);
}

/**
 *  Démarrage de l'autoplay.
 */
function startAutoplay() {
    autoplay = setInterval(() => {
        next();
    }, timerDuration * 1000);
}

/**
 *  Réinitialisation de l'autoplay lors d'une interaction utilisateur.
 */
function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
}
