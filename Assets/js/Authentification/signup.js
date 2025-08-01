import { apiUrl, maxSizeAvatar } from '../script.js';
import { checkEmail, checkIfInputNonEmpty, checkPSW, checkPSWConfirm, escapeHTML, verifyPicture }from '../Tools/tools.js';

const firstNameSignup = document.getElementById("firstNameSignup");
const nameSignup = document.getElementById("nameSignup");
const pseudoSignup = document.getElementById("pseudoSignup");
const avatar_nameSignup = document.getElementById("avatar_nameSignup");
const emailSignup = document.getElementById("emailSignup");
const pswSignup = document.getElementById("pswSignup");
const pswConfirmSignup = document.getElementById("pswConfirmSignup");
const btnSubscribe = document.getElementById("btnSubscribe");
const subscribeForm = document.getElementById("subscribeForm");

btnSubscribe.disabled = true;

// Vérification du formulaire saisi
firstNameSignup.addEventListener("keyup", checkInputs);
nameSignup.addEventListener("keyup", checkInputs);
pseudoSignup.addEventListener("keyup", checkInputs);
emailSignup.addEventListener("keyup", checkInputs);
pswSignup.addEventListener("keyup", checkInputs);
pswConfirmSignup.addEventListener("keyup", checkInputs);

avatar_nameSignup.addEventListener("change", checkAvatarFile);

// Envoie du formulaire
btnSubscribe.addEventListener("click", userSubscription);

// Fonction qui vérifie tous les inputs
function checkInputs(){
    const firstNameOK = checkIfInputNonEmpty(firstNameSignup);
    const nameOK = checkIfInputNonEmpty(nameSignup);
    const pseudoOK = checkIfInputNonEmpty(pseudoSignup);
    const emailOK = checkEmail(emailSignup);
    const pswOK = checkPSW(pswSignup);
    const pswConfirmOK = checkPSWConfirm(pswSignup,pswConfirmSignup);

    if(nameOK && firstNameOK && pseudoOK && emailOK && pswOK && pswConfirmOK){
        btnSubscribe.disabled = false;
    } else {
        btnSubscribe.disabled = true;
    }
}

// Fonction qui vérifie le fichier avatar
function checkAvatarFile(){
    if (avatar_nameSignup.files.length === 0) { // OK si aucun fichier n'est sélectionné
        avatar_nameSignup.classList.remove("is-valid", "is-danger");
        return;
    }
    const isValid = verifyPicture(avatar_nameSignup, maxSizeAvatar);
    if (isValid) {
        avatar_nameSignup.classList.add("is-valid");
        avatar_nameSignup.classList.remove("is-danger");
        btnSubscribe.disabled = false;
    } else {
        avatar_nameSignup.classList.remove("is-valid");
        avatar_nameSignup.classList.add("is-danger");
        btnSubscribe.disabled = true;
    }
}

// Fonction qui inscrit un utilisateur
function userSubscription(){
    const formData = new FormData(subscribeForm);
    formData.delete('passwordConfirm'); // Suppression du champ de confirmation du mot de passe (pas envoyé en BDD)

    // Header généré par le navigateur pour un 'Content-Type': 'multipart/form-data

    // Echape le HTML des inputs
    const firstNameForm = escapeHTML(formData.get("firstName"));
    formData.set("firstName",firstNameForm);
    const NameForm = escapeHTML(formData.get("lastName"));
    formData.set("lastName",NameForm);
    const pseudoForm = escapeHTML(formData.get("pseudo"));
    formData.set("pseudo",pseudoForm);
    const emailForm = escapeHTML(formData.get("email"));
    formData.set("email",emailForm);
    const pswForm = escapeHTML(formData.get("password"));
    formData.set("password",pswForm);


    const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
    };

    fetch(apiUrl + "user/registration", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de l'inscription !");
            }
        })
        .then(result => {
            alert("Bravo " + formData.get("pseudo") + ", vous êtes maintenant inscrit.");
            document.location.href="/signin";
        })
        .catch(error => {
            alert(error.message);
            console.error(error);
        }
    );
}