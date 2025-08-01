import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/Pages/home.html", [], "", "/Assets/scss/css/home.css"),
    new Route("/carpool", "Covoiturage", "/Pages/carpool.html", [], "", "/Assets/scss/css/carpool.css"),
    new Route("/signin", "Connexion", "/Pages/Authentification/signin.html", ["disconnected"], "/Assets/js/Authentification/signin.js", "/Assets/scss/css/user.css"), 
    new Route("/signup", "Inscription", "/Pages/Authentification/signup.html", ["disconnected"], "/Assets/js/Authentification/signup.js", "/Assets/scss/css/user.css"),
    new Route("/signout", "Deconnexion", "/Pages/Authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Authentification/signout.js", "/Assets/scss/css/user.css"),
    // new Route("/account", "Mon compte", "/Pages/Authentification/account.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    // Depuis le bouton "compte" :
    new Route("/user", "Page utilisateur", "/Pages/Account/user.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Account/user.js", "/Assets/scss/css/user.css"),
    new Route("/passenger", "Page passager", "/Pages/Account/passenger.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/driver", "Page conducteur", "/Pages/Account/driver.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/review", "Page avis", "/Pages/Account/review.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    // Depuis le bouton "Compte" puis "Conducteur":
    new Route("/car_add", "Ajout véhicule", "/Pages/Driver/car_add.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/car_list", "Liste véhicule", "/Pages/Driver/car_list.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/carpool_add", "Créer covoiturage", "/Pages/Driver/carpool_add.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/carpool_list", "Liste covoiturage", "/Pages/Driver/carpool_list.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    // new Route("/editPSW", "Editer mot de passe", "/Pages/Authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/contact", "Contact", "/Pages/contact.html", [], "", ""),
    new Route("/legals", "Contact", "/Pages/legals.html", [], "", "")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";