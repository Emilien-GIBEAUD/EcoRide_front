import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/Pages/home.html", [], "", "/Assets/scss/css/home.css"),
    new Route("/carpool", "Covoiturage", "/Pages/carpool.html", [], "", "/Assets/scss/css/carpool.css"),
    new Route("/signin", "Connexion", "/Pages/Authentification/signin.html", ["disconnected"], "/Assets/js/Authentification/signin.js", "/Assets/scss/css/user.css"), 
    new Route("/signup", "Inscription", "/Pages/Authentification/signup.html", ["disconnected"], "/Assets/js/Authentification/signup.js", "/Assets/scss/css/user.css"),
    new Route("/signout", "Deconnexion", "/Pages/Authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Authentification/signout.js", "/Assets/scss/css/user.css"),
    // new Route("/account", "Mon compte", "/Pages/Authentification/account.html", ["disconnected"], "", "/Assets/scss/css/user.css"),// ["ROLE_ADMIN", "ROLE_USER"]
    new Route("/user", "Mon compte", "/Pages/Account/user.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/passenger", "Mes voyages passager", "/Pages/Account/passenger.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/driver", "Mes voyages conducteur", "/Pages/Account/driver.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/review", "Mes avis", "/Pages/Account/review.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    // new Route("/editPSW", "Editer mot de passe", "/Pages/Authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
    new Route("/contact", "Contact", "/Pages/contact.html", [], "", ""),
    new Route("/legals", "Contact", "/Pages/legals.html", [], "", "")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";