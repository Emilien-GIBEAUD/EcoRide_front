import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/Pages/home.html", [], "", "/Assets/scss/css/home.css"),
    new Route("/carpool", "Covoiturage", "/Pages/carpool.html", [], "", "/Assets/scss/css/carpool.css"),
    new Route("/signin", "Connexion", "/Pages/Authentification/signin.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// /Assets/js/Authentification/signin.js
    new Route("/signup", "Inscription", "/Pages/Authentification/signup.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// /Assets/js/Authentification/signup.js
    // new Route("/signout", "Deconnexion", "/Pages/Authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Authentification/signout.js"),
    // new Route("/account", "Mon compte", "/Pages/Authentification/account.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    // Depuis le bouton "compte" :
    new Route("/user", "Page utilisateur", "/Pages/Account/user.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    new Route("/passenger", "Page passager", "/Pages/Account/passenger.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    new Route("/driver", "Page conducteur", "/Pages/Account/driver.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    new Route("/review", "Page avis", "/Pages/Account/review.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    // Depuis le bouton "Compte" puis "Conducteur":
    new Route("/car_add", "Ajout véhicule", "/Pages/Driver/car_add.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    new Route("/car_list", "Ajout véhicule", "/Pages/Driver/car_list.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    new Route("/carpool_add", "Créer covoiturage", "/Pages/Driver/carpool_add.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    new Route("/carpool_list", "Créer covoiturage", "/Pages/Driver/carpool_list.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    // new Route("/editPSW", "Editer mot de passe", "/Pages/Authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/contact", "Contact", "/Pages/contact.html", [], "", ""),
    new Route("/legals", "Contact", "/Pages/legals.html", [], "", "")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";