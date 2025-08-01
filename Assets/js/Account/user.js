import { apiUrl, getInfoUser, getToken, maxSizeAvatar } from '../script.js';
import { checkIfInputNonEmpty, escapeHTML, verifyPicture }from '../Tools/tools.js';

const firstNameEdit = document.getElementById("firstNameEdit");
const nameEdit = document.getElementById("nameEdit");
const pseudoEdit = document.getElementById("pseudoEdit");
const avatar_nameEdit = document.getElementById("avatar_nameEdit");
const driverEdit = document.getElementById("driverEdit");
const btnEdit = document.getElementById("btnEdit");
const editForm = document.getElementById("editForm");
let userData;
/**
 * Initialise la page avec les données de l'utilisateur.
 */
export function initPage() {
    loadUserData();
}

async function loadUserData() {
    try {
        userData = await getInfoUser();
        if (userData) {
        firstNameEdit.value = userData.firstName;
        nameEdit.value = userData.lastName;
        pseudoEdit.value = userData.pseudo;
        driverEdit.checked = userData.usageRole.includes('driver');
        }
    } catch (error) {
        console.error("Erreur lors du chargement des données de l'utilisateur:", error);
    }
};

btnEdit.disabled = true;

// Vérification du formulaire saisi
firstNameEdit.addEventListener("keyup", checkInputs);
nameEdit.addEventListener("keyup", checkInputs);
pseudoEdit.addEventListener("keyup", checkInputs);
avatar_nameEdit.addEventListener("change", checkAvatarFile);
driverEdit.addEventListener("change",checkInputs)
let firstNameChanged = false;
let lastNameChanged = false;
let pseudoChanged = false;
let roleChanged = false;

// Envoie du formulaire
btnEdit.addEventListener("click", userEdition);

// Fonction qui vérifie tous les inputs
async function checkInputs(){
    const firstNameOK = checkIfInputNonEmpty(firstNameEdit);
    const nameOK = checkIfInputNonEmpty(nameEdit);
    const pseudoOK = checkIfInputNonEmpty(pseudoEdit);
    const inputNonEmpty = firstNameOK && nameOK && pseudoOK;

    firstNameChanged = firstNameEdit.value !== userData.firstName;
    lastNameChanged = nameEdit.value !== userData.lastName;
    pseudoChanged = pseudoEdit.value !== userData.pseudo;
    roleChanged = driverEdit.checked !== userData.usageRole.includes('driver');
    let inputChanged =  firstNameChanged || lastNameChanged || pseudoChanged || roleChanged;

    if(inputNonEmpty && inputChanged) {
        btnEdit.disabled = false;
    } else {
        btnEdit.disabled = true;
    }
}

// Fonction qui vérifie le fichier avatar
function checkAvatarFile(){
    if (avatar_nameEdit.files.length === 0) { // OK si aucun fichier n'est sélectionné
        avatar_nameEdit.classList.remove("is-valid", "is-danger");
        return;
    }
    const isValid = verifyPicture(avatar_nameEdit, maxSizeAvatar);
    if (isValid) {
        avatar_nameEdit.classList.add("is-valid");
        avatar_nameEdit.classList.remove("is-danger");
        btnEdit.disabled = false;
    } else {
        avatar_nameEdit.classList.remove("is-valid");
        avatar_nameEdit.classList.add("is-danger");
        btnEdit.disabled = true;
    }
}

// Fonction qui modifie l'utilisateur
function userEdition(){
    const formData = new FormData(editForm);

    // Header généré par le navigateur pour un 'Content-Type': 'multipart/form-data
    const myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    myHeaders.append('accept', 'application/json');

    // Echape le HTML des inputs modifiés et supprime du formulaire les champs non modifiés
    if (firstNameChanged) {
        const firstNameForm = escapeHTML(formData.get("firstName"));
        formData.set("firstName",firstNameForm);
    } else {
        formData.delete("firstName");
    }

    if (lastNameChanged) {
        const NameForm = escapeHTML(formData.get("lastName"));
        formData.set("lastName",NameForm);
    } else {
        formData.delete("lastName");
    }

    if (pseudoChanged) {
        const pseudoForm = escapeHTML(formData.get("pseudo"));
        formData.set("pseudo",pseudoForm);
    } else {
        formData.delete("pseudo");
    }

    formData.delete("driver");
    if (roleChanged) {
        const updatedUsageRole = driverEdit.checked ? ["driver"] : [];
        formData.set("usageRole", JSON.stringify(updatedUsageRole));
    } else {
        formData.delete("usageRole");
    }

    if (avatar_nameEdit.files.length === 0) {
        formData.delete("avatarFile");
    }

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
    };

    fetch(apiUrl + "user/edit", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erreur lors de la modification du profil !");
            }
        })
        .then(result => {
            alert("Votre profil a été modifié.");
            document.location.href="/user";
        })
        .catch(error => {
            alert(error.message);
        }
    );
}