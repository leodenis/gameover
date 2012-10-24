/**
 * Namespace qui définit le point d'appel des composants MVC
 * @author Kévin La Rosa
 * @type {object}
 */
var app = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  Assets: {
  	videos:{},
  	images:{},
  	sounds:{},
  },
  // Instances
  collections: {},
  models: {},
  views: {},
  init: function () {
  	//Initialisation d'un loader
  	this.loader = new PxLoader(); 
    // Initialisation du router, c'est lui qui va instancier nos vues
    this.router = new app.Router();
    //Essaye de récupérer un model dans le localstorage
    this.users = new app.Collections.users();
    this.users.fetch();
    //si il n'existe pas je crée mon model de l'utilisateur 
    if (typeof(this.users.get("1")) == 'undefined'){
    	console.log("Création du model & collections");
	    //Initialisation du model user
	    this.user = new app.Models.user({userAgent:BrowserDetect.browser,version:BrowserDetect.version});
	  	//Intialisation de la collection users et insertion de notre utilisateur
	  	this.users = new app.Collections.users().add(this.user);
	  	this.user.save();
	}
   	//Met en route la surveillance de l'url
    Backbone.history.start();
  }
};

$(document).ready(function () {
	app.init();

});

