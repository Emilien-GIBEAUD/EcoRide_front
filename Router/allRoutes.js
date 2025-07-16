import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/Pages/home.html", [], "", "/Assets/scss/css/home.css"),
    new Route("/carpool", "Covoiturage", "/Pages/carpool.html", [], "", "/Assets/scss/css/carpool.css"),
    new Route("/signin", "Connexion", "/Pages/authentification/signin.html", ["disconnected"], "/Assets/js/authentification/signin.js", "/Assets/scss/css/signin.css"),
    new Route("/signup", "Inscription", "/Pages/authentification/signup.html", ["disconnected"], "/Assets/js/authentification/signup.js"),
    new Route("/account", "Mon compte", "/Pages/authentification/account.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/editPSW", "Editer mot de passe", "/Pages/authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/signout", "Deconnexion", "/Pages/authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/authentification/signout.js"),
    new Route("/contact", "Contact", "/Pages/contact.html", [], "", "")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";