import { apiUrl, sanityzeHTML } from '../script.js';

const nameSignup = document.getElementById("nameSignup");
const firstnameSignup = document.getElementById("firstnameSignup");
const emailSignup = document.getElementById("emailSignup");
const pswSignup = document.getElementById("pswSignup");
const pswConfirmSignup = document.getElementById("pswConfirmSignup");
const btnSuscribe = document.getElementById("btnSuscribe");
const suscribeForm = document.getElementById("suscribeForm");

btnSuscribe.disabled = true;

// Vérification du formulaire saisi
nameSignup.addEventListener("keyup", checkInputs);
firstnameSignup.addEventListener("keyup", checkInputs);
emailSignup.addEventListener("keyup", checkInputs);
pswSignup.addEventListener("keyup", checkInputs);
pswConfirmSignup.addEventListener("keyup", checkInputs);

// Envoie du formulaire
btnSuscribe.addEventListener("click", userSuscription);

// Fonction qui vérifie tous les inputs
function checkInputs(){
    const nameOK = checkOneInput(nameSignup);
    const firstnameOK = checkOneInput(firstnameSignup);
    const emailOK = checkEmail(emailSignup);
    const pswOK = checkPSW(pswSignup);
    const pswConfirmOK = checkPSWConfirm(pswSignup,pswConfirmSignup);

    if(nameOK && firstnameOK && emailOK && pswOK && pswConfirmOK){
        btnSuscribe.disabled = false;
    } else {
        btnSuscribe.disabled = true;
    }
}

// Fonction qui vérifie si un input est vide
function checkOneInput(input) {
    if(input.value !== ""){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction qui vérifie que le mail est valide
function checkEmail(input) {
    // définition de la regex du mail :
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userEmail = input.value;
    if(userEmail.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction qui vérifie les mots de passe
function checkPSW(input){
    // définition de la regex du mot de passe
    const PSWRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const userPSW = input.value;
    if(userPSW.match(PSWRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction qui vérifie que les mots de passe saisis sont identiques
function checkPSWConfirm(input1,input2){
    if(input1.value === input2.value){
        input2.classList.add("is-valid");
        input2.classList.remove("is-invalid");
        return true;
    } else {
        input2.classList.remove("is-valid");
        input2.classList.add("is-invalid");
        return false;
    }
}

// Fonction qui inscrit un utilisateur
function userSuscription(){
    const formData = new FormData(suscribeForm);
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        firstName: sanityzeHTML(formData.get("firstnameSignup")),
        lastName: sanityzeHTML(formData.get("nameSignup")),
        email: sanityzeHTML(formData.get("emailSignup")),
        password: sanityzeHTML(formData.get("pswSignup"))
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(apiUrl + "registration", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de l'inscription !");
            }
        })
        .then(result => {
            alert("Bravo " + formData.get("firstnameSignup") + ", vous êtes maintenant inscrit.");
            document.location.href="/signin";
        })
        .catch(error => {
            alert(error.message);
            console.error(error);
        });
}