import { setToken, setCookie, roleCookieName, apiUrl, sanityzeHTML } from '../script.js';

// gestion de la connexion
// On utilise bien des var au cas ou l'utilisateur quitte puis revient sur la page, à voir si il est possible de gérer cela autrement.
var emailInput = document.getElementById("emailInput");
var pswInput = document.getElementById("pswInput");
var btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

// vérification des données de connexions
function checkCredentials(){
    const formData = new FormData(signinForm);
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        username: sanityzeHTML(formData.get("emailInput")),
        password: sanityzeHTML(formData.get("pswInput"))
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(apiUrl + "login", requestOptions)
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