import { apiUrl, getInfoUser, getToken } from '../script.js';
import { checkIfInputNonEmpty, escapeHTML }from '../Tools/tools.js';

let userData;

/**
 * Initialise la page avec les informations de l'utilisateur et les écouteurs sur les inputs.
 */
export async function initPage() {
    userData = await getInfoUser();
    const noteCommentApp = document.getElementById("noteCommentApp");
    const reviewCommentApp = document.getElementById("reviewCommentApp");

    const btnCommentApp = document.getElementById("btnCommentApp");
    const commentAppForm = document.getElementById("commentAppForm");

    // Vérification du formulaire saisi
    btnCommentApp.disabled = true;
    noteCommentApp.addEventListener("keyup", checkInputs);
    reviewCommentApp.addEventListener("keyup", checkInputs);
}

/**
 * Vérifie tous les inputs.
 */
async function checkInputs(){
    const noteOK = checkIfInputNonEmpty(noteCommentApp);
    const reviewOK = checkIfInputNonEmpty(reviewCommentApp);
    const inputNonEmpty = noteOK && reviewOK;

    // Envoie du formulaire
    btnCommentApp.addEventListener("click", commentApp);

    if(inputNonEmpty) {
        btnCommentApp.disabled = false;
    } else {
        btnCommentApp.disabled = true;
    }
}

/**
 * Ajoute un commentaire sur l'application via une requête HTTP POST.
 */
function commentApp(){
    const formData = new FormData(commentAppForm);

    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append("Content-Type", "application/json");

    // Echape le HTML des inputs et crée l'objet JSON
    const raw = JSON.stringify({
        note: parseInt(escapeHTML(formData.get("note"))),
        comment: escapeHTML(formData.get("comment")),
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(apiUrl + "review/add", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de l'enregistrement de votre avis !");
            }
        })
        .then(result => {
            alert("Votre avis a été enregistré.");
            document.location.href="/";
        })
        .catch(error => {
            alert(error.message);
        }
    );
}
