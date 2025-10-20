import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";
import { isConnected, showHideForRoles, getRole } from '../Assets/js/script.js';

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/Pages/404.html", []);

// Fonction qui renvoie la route correspondant à une URL donnée
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

    // Pages présentant des factorisations
    const url = actualRoute.url;
    // Pages utilisant le sous menu
    const urlWithSub_menu = ['/user', '/passenger', '/driver', '/review', '/car', '/car_add', '/car_edit', '/car_list', '/carpool_add', '/carpool_list'];
    if (urlWithSub_menu.includes(url)) {
        try {
            const sub_menu = await fetch('./Pages/_components/sub_menu.html').then((res) => res.text());
            const nav = document.getElementById("sub_menu");
            if (nav) {
                nav.innerHTML = sub_menu;
            } else {
                console.warn("Aucun élément #sub_menu trouvé dans la page");
            }
        } catch (e) {
            console.error("Erreur lors du chargement du menu secondaire :", e);
        }
    }

    // Pages utilisant les boutons conducteur
    const urlWithDriver_buttons = ['/driver', '/car', '/car_add', '/car_edit', '/car_list', '/carpool_add', '/carpool_list'];
    if (urlWithDriver_buttons.includes(url)) {
        try {
            const driver_buttons = await fetch('./Pages/_components/driver_buttons.html').then((res) => res.text());
            const nav = document.getElementById("driver_buttons");
            if (nav) {
                nav.innerHTML = driver_buttons;
            } else {
                console.warn("Aucun élément #driver_buttons trouvé dans la page");
            }
        } catch (e) {
            console.error("Erreur lors du chargement des boutons de la page conducteur :", e);
        }
    }

    // Pages utilisant la barre de recherche
    const urlWithSearch_bar = ['/', '/search'];
    if (urlWithSearch_bar.includes(url)) {
        try {
            const search_bar = await fetch('./Pages/_components/search_bar.html').then((res) => res.text());
            const nav = document.getElementById("search_bar");
            if (nav) {
                nav.innerHTML = search_bar;
            } else {
                console.warn("Aucun élément #search_bar trouvé dans la page");
            }
        } catch (e) {
            console.error("Erreur lors du chargement dela barre de recherche :", e);
        }
    }

    // Ajout du contenu JavaScript AVEC import
    if (actualRoute.pathJS) {
        try {
            const module = await import(actualRoute.pathJS + '?t=' + Date.now()); 
            // Ajout d'un timestamp pour éviter le cache sur la page /user entre autres
            if (typeof module.initPage === 'function') {
                module.initPage(); // Appelé automatiquement si défini
            }
        } catch (error) {
            console.error("Erreur lors du chargement du module :", actualRoute.pathJS, error);
        }
    }

    // Ajout du style CSS (remplace l'existant)
    if (actualRoute.pathCSS) {
        // Suppression de l'existant
        const oldLink = document.getElementById("page-style");
        if (oldLink) {
            oldLink.remove();
        }

        const link = document.createElement('link');
        link.id = "page-style";
        link.rel = 'stylesheet';
        link.href = actualRoute.pathCSS;
        document.head.appendChild(link);
    }

    // Changement du titre de la page
    document.title = actualRoute.title + " - " + websiteName;

    // Afficher/masquer les éléments en fonction du rôle
    showHideForRoles();
};

// // Avant passage en prod
// // Fonction pour gérer les événements de routage (clic sur les liens) ==> sans window.event qui est déprécié
// const routeEvent = (event) => {
//     event.preventDefault();
//     // Mise à jour de l'URL dans l'historique du navigateur
//     window.history.pushState({}, "", event.target.href);

//     // Chargement du contenu de la nouvelle page
//     LoadContentPage();
// };

// Fonction pour gérer les événements de routage (clic sur les liens) ==> sans window.event qui est déprécié
const routeEvent = (event) => {
    event.preventDefault();
    // Mise à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);
    // Chargement du contenu de la nouvelle page
    LoadContentPage();
};

// Attache l'événement correctement aux liens
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", routeEvent);
});

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;

// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;

// Chargement du contenu de la page au chargement initial
LoadContentPage();

