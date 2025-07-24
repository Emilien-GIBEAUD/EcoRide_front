// Configuration des outils
const nbCharPSW = 12;           // Nombre de caractères minimum du mot de passe (fonction checkPSW)


/**
 * Échappe le HTML d'un texte pour éviter les attaques XSS.
 * Convertit les caractères spéciaux (<, >, &, etc.) en entités HTML.
 *
 * @param {string} text - Le texte à échapper.
 * @returns {string} Le texte avec les caractères HTML échappés.
 */
export function escapeHTML(text){
    const tempHtml = document.createElement("div");
    tempHtml.textContent = text;
    return tempHtml.innerHTML;
}

/**
 * Vérifie si une image est valide.
 *
 * @param {HTMLInputElement} fileInput - L'élément DOM du champ de fichier.
 * @param {float} maxSize - Taille maximale du fichier en Mo.
 * @returns {boolean} Retourne true si l'image est valide, sinon false.
 */
export function verifyPicture(fileInput, maxSize) {
    const errorsImage = [];
    let uploadOk = 1;

    const file = fileInput.files[0];

    // Vérification du type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
        errorsImage.push("Seuls les fichiers JPG, JPEG, PNG et WEBP sont autorisés.");
    }

    // Vérification de la taille du fichier (en octets)
    if (file.size > maxSize*1000000 && uploadOk === 1) {
        errorsImage.push("Le fichier image doit avoir une taille inférieure à " + maxSize + " Mo.");
    }

    if (errorsImage.length > 0) {
        const message = errorsImage.join("\n");
        alert(message);
        return false;
    } else {
        return true;
    }
}

/**
 * Vérifie si un input saisi.
 *
 * @param {HTMLInputElement} input - L'élément DOM du champ input.
 * @returns {boolean} Retourne true si l'input est saisi, sinon false.
 */
export function checkIfInputNonEmpty(input) {
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

/**
 * Fonction qui vérifie qu'un mail saisi est valide.
 *
 * @param {HTMLInputElement} input - L'élément DOM du champ input mail.
 * @returns {boolean} Retourne true si le mail est valide, sinon false.
 */
export function checkEmail(input) {
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

/**
 * Fonction qui vérifie qu'un mot de passe saisi est valide.
 *
 * @param {HTMLInputElement} input - L'élément DOM du champ input mot de passe.
 * @returns {boolean} Retourne true si le mot de passe est valide, sinon false.
 */
export function checkPSW(input){
    // définition de la regex du mot de passe
    const PSWRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{${nbCharPSW},}$`);
    const userPSW = input.value;
    if(userPSW.match(PSWRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-danger");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-danger");
        return false;
    }
}

/**
 * Fonction qui vérifie que deux mots de passe saisis sont identiques.
 *
 * @param {HTMLInputElement} input1 - L'élément DOM du champ input mot de passe 1.
 * @param {HTMLInputElement} input2 - L'élément DOM du champ input mot de passe 2.
 * @returns {boolean} Retourne true si les mots de passe sont identiques, sinon false.
 */
export function checkPSWConfirm(input1,input2){
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
