export default class Route {
    constructor(url, title, pathHtml, authorize, pathJS = "") {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.authorize = authorize;
        this.pathJS = pathJS;
    }
}

/* => authorize
[] -> Tout le monde peut y accéder
["disconnected"] -> Réserver aux utilisateurs déconnecté 
["ROLE_USER"] -> Réserver aux utilisateurs avec le rôle client (-- En accord avec l'API --)
["admin"] -> Réserver aux utilisateurs avec le rôle admin (-- A voir si ROLE_ADMIN dans l'API --)
["admin", "ROLE_USER"] -> Réserver aux utilisateurs avec le rôle client OU admin (-- A voir si ROLE_ADMIN dans l'API --)
*/