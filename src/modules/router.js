app.Router = Backbone.Router.extend({
  initialize: function () {
  	//Chargement de la vue loader
  	app.views.loader = new app.Views.loader();
  },
  routes: {
    '': 'root',
  },
  // Root principal du site internet
  root: function () {
  	//Lancement de la view accueil
  	app.views.home = new app.Views.home();
  }
});