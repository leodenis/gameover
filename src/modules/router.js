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
    'end': 'end',
    ":whatever": "inconue"
  },
  // Root principal du site internet
  root: function () {
  	//Lancement de la view accueil
  	app.views.home = new app.Views.home();
  },
  
  startGame: function() {
  	if(app.Helpers.userIsPlaying()){
  		app.views.startGame = new app.Views.startGame();
  	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
  },
  
  q1: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 1');
	  	statut = app.Helpers.questionIsUnlock(1);
	  	//console.log(statut);
	  	//routage d'accés
	  	if(statut)
	  		app.views.q1 = new app.Views.q1;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
	}
  },
  
  q2: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 2');
	  	statut = app.Helpers.questionIsUnlock(2);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q1 = new app.Views.q1;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
  },
  
  q3: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 3');
	  	statut = app.Helpers.questionIsUnlock(3);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q3 = new app.Views.q3;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  q4: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 4');
	  	statut = app.Helpers.questionIsUnlock(4);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q4 = new app.Views.q4;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  q5: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 5');
	  	statut = app.Helpers.questionIsUnlock(5);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q5 = new app.Views.q5;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  q6: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 6');
	  	statut = app.Helpers.questionIsUnlock(6);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q6 = new app.Views.q6;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
  },
  
  q7: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 7');
	  	statut = app.Helpers.questionIsUnlock(7);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q7 = new app.Views.q7;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  q8: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 8');
	  	statut = app.Helpers.questionIsUnlock(8);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q8 = new app.Views.q8;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  q9: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 9');
	  	statut = app.Helpers.questionIsUnlock(9);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.q9 = new app.Views.q9;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  end: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la page de fin');
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	statut = app.Helpers.questionIsUnlock(10);
	  	if(statut)
	  		app.views.q9 = new app.Views.q9;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
	  		
  },
  
  //En cas de route non déclarer 
  inconue: function(){
  	if(app.Helpers.userIsPlaying()){
  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
  	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
  		
  },
  
  
  //Ne sachant pas comment récupérer l'id de ma variable j'ai crée une fonction de routage suivant l'id je route vers la bonne question manuellement
  routeQuestion: function(route){
  	switch (route) {
	 case 0:
		 this.navigate('startGame', true);
		 break;
	 case 1:
		 this.navigate('q1', true);
		 break;
	 case 2:
		this.navigate('q2', true);
		 break;
	 case 3: 
		 this.navigate('q3', true);
		 break;
	 case 4: 
		this.navigate('q4', true);
		 break;
	 case 5: 
		 this.navigate('q5', true);
		 break;
	 case 6: 
		 this.navigate('q6', true);
		 break
	 case 7: 
		 this.navigate('q7', true);
		 break;
	 case 8: 
		 this.navigate('q8', true);
		 break;
	 case 9: 
		 this.navigate('q9', true);
		 break;
	 case 10: 
		 this.navigate('end', true);
		 break;
	}
  }
  

});

