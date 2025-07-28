import { setToken, setCookie, roleCookieName, apiUrl } from '../script.js';
import { escapeHTML }from '../Tools/tools.js';

// gestion de la connexion
const emailInput = document.getElementById("emailSignin");
const pswInput = document.getElementById("pswSignin");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

// vérification des données de connexions
function checkCredentials(){
    const formData = new FormData(signinForm);
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        username: escapeHTML(formData.get("emailSignin")),
        password: escapeHTML(formData.get("pswSignin"))
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(apiUrl + "user/login", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                emailInput.classList.add("is-invalid");
                pswInput.classList.add("is-invalid");
            }
            
        })
        .then(result => {
            // Récupération du token
            const token = result.apiToken;

            // Mise du token en cookie
            setToken(token);

            // Attribution du role
            setCookie(roleCookieName,result.roles[0],7);

            document.location.href="/";
        })
        .catch(error => {
            console.error(error);
        });

}