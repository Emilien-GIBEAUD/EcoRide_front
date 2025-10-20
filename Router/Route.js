export default class Route {
    constructor(url, title, pathHtml, authorize, pathJS = "", pathCSS = "") {
        this.url = url;
        this.title = title;
        this.pathHtml = pathHtml;
        this.authorize = authorize;
        this.pathJS = pathJS;
        this.pathCSS = pathCSS;
    }
}

/* => authorize
[] -> Tout le monde peut y accéder
["disconnected"] -> Réserver aux utilisateurs déconnecté // A éclaircir à terme
["ROLE_USER"] -> Réserver aux utilisateurs avec le rôle client
["ROLE_ADMIN"] -> Réserver aux utilisateurs avec le rôle admin
["ROLE_ADMIN", "ROLE_USER"] -> Réserver aux utilisateurs avec le rôle client OU admin
*/