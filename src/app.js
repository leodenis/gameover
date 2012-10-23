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
    //Initialisation du model user
    this.user = new app.Models.User({userAgent:BrowserDetect.browser,version:BrowserDetect.version});
   	//Met en route la surveillance de l'url
    Backbone.history.start();
  }
};

$(document).ready(function () {
	app.init();

});

