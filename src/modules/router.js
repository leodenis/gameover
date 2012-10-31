app.Router = Backbone.Router.extend({
  initialize: function () {
  	// Regarde si l'utilisateur est dans le jeux si oui alors rootage vers le home
	if(!app.Helpers.userIsPlaying()){
		this.root();
	}
  },
  routes: {
    '': 'root',
    'startGame' : 'startGame',
    'q1': 'q1',
    'q2': 'q2',
    'q3': 'q3',
    'q4': 'q4',
    'q5': 'q5',
    'q6': 'q6',
    'q7': 'q7',
    'q8': 'q8',
    'q9': 'q9',
  },
  // Root principal du site internet
  root: function () {
  	//Lancement de la view accueil
  	app.views.home = new app.Views.home();
  },
  
  startGame: function() {
		app.views.startGame = new app.Views.startGame	
  },
  
  q1: function(){app.views.q1 = new app.Views.q1; },
  
  q2: function(){app.views.q2 = new app.Views.q2; },
  
  q3: function(){app.views.q3 = new app.Views.q3; },
  
  q4: function(){app.views.q4 = new app.Views.q4; },
  
  q5: function(){app.views.q5 = new app.Views.q5; },
  
  q6: function(){app.views.q6 = new app.Views.q6; },
  
  q7: function(){app.views.q7 = new app.Views.q7; },
  
  q8: function(){app.views.q8 = new app.Views.q8; },
  
  q9: function(){app.views.q9 = new app.Views.q9; },
});