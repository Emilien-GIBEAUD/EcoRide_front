import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";
import { isConnected, showHideForRoles, getRole } from '../Assets/js/script.js';

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/Pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
    let currentRoute = null;
    // Parcours de toutes les routes pour trouver la correspondance
    allRoutes.forEach((element) => {
        if (element.url == url) {
            currentRoute = element;
        }
    });
    // Si aucune correspondance n'est trouvée, on retourne la route 404
    if (currentRoute != null) {
        return currentRoute;
    } else {
        return route404;
    }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
    const path = window.location.pathname;
    // Récupération de l'URL actuelle
    const actualRoute = getRouteByUrl(path);

    //Vérification des droits d'accès à la page
    const allRolesArray = actualRoute.authorize;
    if(allRolesArray.length > 0){
        if(allRolesArray.includes("disconnected")){
            if(isConnected()){
                window.location.replace("/");
            }
        }else{
            const roleUser = getRole();
            if(!allRolesArray.includes(roleUser)){
                window.location.replace("/");
            }
        }
    }

    // Récupération du contenu HTML de la route
    const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = html;

    // Ajout du contenu JavaScript AVEC import
    if (actualRoute.pathJS) {
        try {
            const module = await import(actualRoute.pathJS);
            if (typeof module.initPage === 'function') {
                module.initPage(); // Appelé automatiquement si défini
            }
        } catch (error) {
            console.error("Erreur lors du chargement du module :", actualRoute.pathJS, error);
        }
    }

    // Changement du titre de la page
    document.title = actualRoute.title + " - " + websiteName;

    // Afficher/masquer les éléments en fonction du rôle
    showHideForRoles();
};

// Fonction pour gérer les événements de routage (clic sur les liens) ==> sans window.event qui est déprécié
const routeEvent = (event) => {
    event.preventDefault();
    // Mise à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);
    // Chargement du contenu de la nouvelle page
    LoadContentPage();
};
// Attacher l'événement correctement aux liens
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", routeEvent);
});

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();

