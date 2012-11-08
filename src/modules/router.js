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
    'end': 'end'
  },
  // Root principal du site internet
  root: function () {
  	//Lancement de la view accueil
  	app.views.home = new app.Views.home();
  },
  
  startGame: function() {
  	statut = app.Helpers.questionIsUnlock(1);
  	app.views.startGame = new app.Views.startGame;
  },
  
  q1: function(){
  	console.log('Lancement de la question 1');
  	this.controlUser(1);
  	app.views.q1 = new app.Views.q1;
  },
  
  q2: function(){
  	console.log('Lancement de la question 2');
  	app.views.q2 = new app.Views.q2;
  },
  
  q3: function(){
  	console.log('Lancement de la question 3');
  	app.views.q3 = new app.Views.q3;
  },
  
  q4: function(){
  	console.log('Lancement de la question 4');
  	app.views.q4 = new app.Views.q4;
  },
  
  q5: function(){
  	console.log('Lancement de la question 5');
  	app.views.q5 = new app.Views.q5;
  },
  
  q6: function(){
  	console.log('Lancement de la question 6');
  	app.views.q6 = new app.Views.q6;
  },
  
  q7: function(){
  	console.log('Lancement de la question 7');
  	app.views.q7 = new app.Views.q7;
  },
  
  q8: function(){
  	console.log('Lancement de la question 8');
  	app.views.q8 = new app.Views.q8;
  },
  
  q9: function(){
  	console.log('Lancement de la question 9');
  	app.views.q9 = new app.Views.q9;
  },
  
  end: function(){
  	console.log('A faire ~');
  },
  

});

