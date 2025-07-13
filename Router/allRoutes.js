import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/Pages/home.html", []),
    new Route("/account", "Mon compte", "/Pages/authentification/account.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/editPSW", "Editer mot de passe", "/Pages/authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/signin", "Connexion", "/Pages/authentification/signin.html", ["disconnected"], "/Assets/js/authentification/signin.js"),
    new Route("/signout", "Deconnexion", "/Pages/authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/authentification/signout.js"),
    new Route("/signup", "Inscription", "/Pages/authentification/signup.html", ["disconnected"], "/Assets/js/authentification/signup.js")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";