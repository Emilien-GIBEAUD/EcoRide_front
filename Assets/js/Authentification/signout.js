import { eraseCookie, tokenCookieName, roleCookieName } from '../script.js';

// Gestion de la déconnexion
let signoutBtn = document.getElementById("signoutBtn");


signoutBtn.addEventListener("click",signout);
// Methode pour se déconnecter
function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.replace("/");
}

