import Route from "./Route.js";
import { basePath } from '../Assets/js/script.js';

//Définir ici vos routes
export const allRoutes = [
    new Route(basePath + "/", "Accueil", basePath + "/Pages/home.html", [], "", basePath + "/Assets/scss/css/home.css"),
    new Route(basePath + "/carpool", "Covoiturage", basePath + "/Pages/carpool.html", [], "", basePath + "/Assets/scss/css/carpool.css"),
    new Route(basePath + "/signin", "Connexion", basePath + "/Pages/Authentification/signin.html", ["disconnected"], basePath + "/Assets/js/Authentification/signin.js", basePath + "/Assets/scss/css/user.css"), 
    new Route(basePath + "/signup", "Inscription", basePath + "/Pages/Authentification/signup.html", ["disconnected"], basePath + "/Assets/js/Authentification/signup.js", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/signout", "Deconnexion", basePath + "/Pages/Authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], basePath + "/Assets/js/Authentification/signout.js", basePath + "/Assets/scss/css/user.css"),
    // Depuis le bouton "Compte" :
    new Route(basePath + "/user", "Page utilisateur", basePath + "/Pages/Account/user.html", ["ROLE_ADMIN", "ROLE_USER"], basePath + "/Assets/js/Account/user.js", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/passenger", "Page passager", basePath + "/Pages/Account/passenger.html", ["ROLE_ADMIN", "ROLE_USER"], "", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/driver", "Page conducteur", basePath + "/Pages/Account/driver.html", ["ROLE_ADMIN", "ROLE_USER"], basePath + "/Assets/js/Account/driver.js", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/review", "Page avis", basePath + "/Pages/Account/review.html", ["ROLE_ADMIN", "ROLE_USER"], "", basePath + "/Assets/scss/css/user.css"),
    // Depuis le bouton "Compte" puis "Conducteur":
    new Route(basePath + "/car_add", "Ajout véhicule", basePath + "/Pages/Driver/car_add.html", ["ROLE_ADMIN", "ROLE_USER"], basePath + "/Assets/js/Driver/car_add.js", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/car_list", "Liste véhicules", basePath + "/Pages/Driver/car_list.html", ["ROLE_ADMIN", "ROLE_USER"], basePath + "/Assets/js/Driver/car_list.js", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/car_edit", "Modification véhicule", basePath + "/Pages/Driver/car_edit.html", ["ROLE_ADMIN", "ROLE_USER"], basePath + "/Assets/js/Driver/car_edit.js", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/carpool_add", "Créer covoiturage", basePath + "/Pages/Driver/carpool_add.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Driver/carpool_add.js", basePath + "/Assets/scss/css/user.css"),
    new Route(basePath + "/carpool_list", "Liste covoiturage", basePath + "/Pages/Driver/carpool_list.html", ["ROLE_ADMIN", "ROLE_USER"], "", basePath + "/Assets/scss/css/user.css"),
    // new Route(basePath + "/editPSW", "Editer mot de passe", basePath + "/Pages/Authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route(basePath + "/contact", "Contact", basePath + "/Pages/contact.html", [], "", ""),
    new Route(basePath + "/legals", "Mentions légales", basePath + "/Pages/legals.html", [], "", basePath + "/Assets/scss/css/legals.css")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";