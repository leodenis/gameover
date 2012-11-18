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
  Helpers: {},
  Assets: {
  	videos:{},
  	images:{},
  	sounds:{},
  },
  // Instances
  collections: {},
  models: {},
  views: {},
  map:{},
  street:{},

  
  
  init: function () {
  	//Initialisation d'un loader
  	this.loader = new PxLoader(); 
  	console.log(this.loader);
  	//Chargement de la vue loader
  	app.views.loader = new app.Views.loader();
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
  }
};

$(document).ready(function () {
	app.init();

});

