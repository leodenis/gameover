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
  	files:[]
  },
  // Instances
  collections: {},
  models: {},
  views: {},
  map:{
  	carte:{},
  },
  street:{
  	exploration: {}
  },
  

  
  
  init: function () {
  	//Chargement de la vue loader
  	app.views.loader = new app.Views.loader;
    //Essaye de récupérer un model dans le localstorage
    this.users = new app.Collections.users;
    this.users.fetch();
    //si il n'existe pas je crée mon model de l'utilisateur 
    if (typeof(this.users.get("1")) == 'undefined'){
    	console.log("Création du model & collections");
	    //Initialisation du model user
	    this.user = new app.Models.user({cuid:Math.uuid(),userAgent:BrowserDetect.browser,version:BrowserDetect.version});
	  	//Intialisation de la collection users et insertion de notre utilisateur
	  	this.users = new app.Collections.users().add(this.user);
	  	this.user.save();
	}
  }
};

$(document).ready(function () {
	app.init();

});

