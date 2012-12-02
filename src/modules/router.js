app.Router = Backbone.Router.extend({
  initialize: function () {
  },
  
  routes: {
     '': 'root',
    'home':'home',
    'etape1' : 'etape1',
    'etape2': 'etape2',
    'etape3': 'etape3',
    'etape4': 'etape4',
    'etape5': 'etape5',
    'etape6': 'etape6',
    'etape7': 'etape7',
    'etape8': 'etape8',
    'etape9': 'etape9',
    ":whatever": "inconue"
  },
  // Root principal du site internet
  root: function () {
  	if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPad/i))){
  		app.views.mobile = new app.Views.mobileExperience();
  	}else{
  		//Lancement de la view accueil
  		app.views.home = new app.Views.home();
  	}
  },
  
  home : function(){
  	if(_.isObject(app.views.home) ){
  		console.log('elle existe deja dans le dom');
  		delete app.views.home;
  		app.views.home = new app.Views.home();
  	}else{
  		app.views.home = new app.Views.home();
  	}
  },
  
  etape1: function() {
  	if(app.Helpers.userIsPlaying()){
  		app.views.etape1 = new app.Views.etape1();
  	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
  },
  
  etape2: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 1');
	  	statut = app.Helpers.questionIsUnlock(1);
	  	if(statut)
	  		app.views.etape2 = new app.Views.etape2;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
	}
  },
  
  etape3: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 2');
	  	statut = app.Helpers.questionIsUnlock(2);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut){
	  		app.views.etape3 = new app.Views.etape3;
	  	}else{
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	  	}
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
  },
  
  etape4: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 3');
	  	statut = app.Helpers.questionIsUnlock(3);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.etape4 = new app.Views.etape4;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  etape5: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 4');
	  	statut = app.Helpers.questionIsUnlock(4);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.etape5 = new app.Views.etape5;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  etape6: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 5');
	  	statut = app.Helpers.questionIsUnlock(5);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.etape6 = new app.Views.etape6;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  etape7: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 6');
	  	statut = app.Helpers.questionIsUnlock(6);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.etape7 = new app.Views.etape7;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}
  },
  
  etape8: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('Lancement de la question 7');
	  	statut = app.Helpers.questionIsUnlock(7);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.etape8 = new app.Views.etape8;
	  	else
	  		// Renvoi l'utilisateur vers son dernier deblocage
	  		this.routeQuestion(app.Helpers.getLastQuestUnlock());
	}else{
  		console.log('le jeu n\' est pas lancé');
  		this.navigate('', true);
  	}	  		
  },
  
  etape9: function(){
  	if(app.Helpers.userIsPlaying()){
	  	console.log('question de fin');
	  	statut = app.Helpers.questionIsUnlock(8);
	  	// NB : il faut changer statut par true pour sauter le control de validation
	  	if(statut)
	  		app.views.etape9 = new app.Views.etape9;
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
		 this.navigate('etape1', true);
		 break;
	 case 1:
		 this.navigate('etape2', true);
		 break;
	 case 2:
		this.navigate('etape3', true);
		 break;
	 case 3: 
		 this.navigate('etape4', true);
		 break;
	 case 4: 
		this.navigate('etape5', true);
		 break;
	 case 5: 
		 this.navigate('etape6', true);
		 break;
	 case 6: 
		 this.navigate('etape7', true);
		 break
	 case 7: 
		 this.navigate('etape8', true);
		 break;
	 case 8: 
		 this.navigate('etape9', true);
		 break;
	 case 9: 
		 this.navigate('etape10', true);
		 break;
	}
  }
  

});

