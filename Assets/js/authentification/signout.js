import { eraseCookie, tokenCookieName, roleCookieName } from '../script.js';

// Gestion de la déconnexion
var signoutBtn = document.getElementById("signoutBtn");
// On utilise bien var au cas ou l'utilisateur quitte puis revient sur la page, à voir si il est possible de gérer cela autrement.


signoutBtn.addEventListener("click",signout);
// Methode pour se déconnecter
function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.replace("/");
}

