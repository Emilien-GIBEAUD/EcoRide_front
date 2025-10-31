import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    // Depuis le menu principal :
    new Route("/", "Accueil", "/Pages/home.html", [], "/Assets/js/home.js", "/Assets/scss/css/home.css"),
    new Route("/search", "Recherche", "/Pages/Travel/search.html", [], "/Assets/js/Travel/search.js", "/Assets/scss/css/travel.css"),
    new Route("/signin", "Connexion", "/Pages/Authentification/signin.html", ["disconnected"], "/Assets/js/Authentification/signin.js", "/Assets/scss/css/sign.css"), 
    new Route("/signup", "Inscription", "/Pages/Authentification/signup.html", ["disconnected"], "/Assets/js/Authentification/signup.js", "/Assets/scss/css/sign.css"),
    new Route("/signout", "Deconnexion", "/Pages/Authentification/signout.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Authentification/signout.js", "/Assets/scss/css/sign.css"),
    // Depuis le bouton "Compte" :
    new Route("/user", "Page utilisateur", "/Pages/Account/user.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Account/user.js", "/Assets/scss/css/user.css"),
    new Route("/passenger", "Page passager", "/Pages/Account/passenger.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    new Route("/driver", "Page conducteur", "/Pages/Account/driver.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Account/driver.js", "/Assets/scss/css/driver.css"),
    new Route("/review", "Page avis", "/Pages/Account/review.html", ["ROLE_ADMIN", "ROLE_USER"], "", "/Assets/scss/css/user.css"),
    // Depuis le bouton "Compte" puis "Conducteur":
    new Route("/car_add", "Ajouter véhicule", "/Pages/Driver/car_add.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Driver/car_add.js", "/Assets/scss/css/driver.css"),
    new Route("/car_list", "Liste véhicules", "/Pages/Driver/car_list.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Driver/car_list.js", "/Assets/scss/css/driver.css"),
    new Route("/car_edit", "Modification véhicule", "/Pages/Driver/car_edit.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Driver/car_edit.js", "/Assets/scss/css/driver.css"),
    new Route("/carpool_add", "Créer covoiturage", "/Pages/Driver/carpool_add.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Driver/carpool_add.js", "/Assets/scss/css/driver.css"),
    new Route("/carpool_list", "Liste covoiturage", "/Pages/Driver/carpool_list.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Driver/carpool_list.js", "/Assets/scss/css/driver.css"),
    // Depuis le bouton "Compte" puis "Avis":
    new Route("/review_app", "Ajouter avis", "/Pages/Review/review_app.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Review/review.js", "/Assets/scss/css/user.css"),
    // Depuis les résultats de recherche :
    new Route("/travel", "Détails voyage", "/Pages/Travel/travel.html", ["ROLE_ADMIN", "ROLE_USER"], "/Assets/js/Travel/travel.js", "/Assets/scss/css/travel.css"),
    // Depuis le footer :
    new Route("/contact", "Contact", "/Pages/contact.html", [], "", ""),
    new Route("/legals", "Mentions légales", "/Pages/legals.html", [], "", "/Assets/scss/css/legals.css")
    // new Route("/editPSW", "Editer mot de passe", "/Pages/Authentification/editPSW.html", ["ROLE_ADMIN", "ROLE_USER"]),
];

// Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";