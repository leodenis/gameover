/**
 * View du loader
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Views.loader = Backbone.View.extend({
	el : '#loader',
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		this.templateLoader  = $('#templateLoader').html()
		//Déclaration du noeud html de destination
		this.noeud

		//Lancement du rendu de chargement
		this.LoaderRender();

	},
	// Chargements des ressources Videos & sons & images
	LoaderRender : function() {
		//Définition des ressources (Définir les images)
		app.Assets.images.background = app.loader.addImage('assets/img/headerbg.jpg'), app.Assets.images.treesImg = app.loader.addImage('assets/img/trees.png'), app.Assets.images.ufoImg = app.loader.addImage('assets/img/ufo.png');
		
		//Chargement du bon fichier video ATTTENTION IL FAUT FINIR EN AJOUTER LES AUTRES FORMAT PAR NAVIGATEURS
		if (Modernizr.video) {
		  if (Modernizr.video.webm) {
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.webm', 'movie', 10);
		  } else if (Modernizr.video.ogg) {
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.ogg', 'movie', 10);
		  } else if (Modernizr.video.h264){
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.mp4', 'movie', 10);
		  }
		}else{
			//proposer du flash !!
		}
		
		//Référence vers mon template de chargement
		app.loader.templateLoader = this.templateLoader;
		// On prépare notre noeud HTML a partir de son template
		loaderHTML = _.template(this.templateLoader,{avancement:""});
		// On l'affiche
		$('#loader').html(loaderHTML);
		
		//Ecoute et répond jusqu'au moment ou toutes les ressources sont chargés
		app.loader.addCompletionListener(function() {
			//supprime le loader
			console.log('loader chargé');
			$('#loader').remove();
			// Initialisation du router, c'est lui qui va instancier nos vues
    		app.router = new app.Router();
    		//Met en route la surveillance de l'url
    		Backbone.history.start();
		});
		
		//Ecoute et répond a chaque avancement du chargement
		app.loader.addProgressListener(function(e) {
			progression = e.completedCount+'/'+e.totalCount;
			console.log('Chargement des assets en cours  : '+ progression);
			templateLoader  = $('#templateLoader').html()		
			loaderHTML = _.template(app.loader.templateLoader,{avancement:progression});
			
			
		});
		
		//Lance le loader
		app.loader.start();
	},
});


/**
 * View de l'accueil
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Views.home = Backbone.View.extend({
	el : '#Accueil',
	
	events: {
		'click #startGame': 'launchGame',
	},
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		// On cache les div courante
		$('div:visible').hide();
		// On affiche les div courante
		$('#Accueil').show();		
		// Déclaration des templates
		this.templateAccueil = $('#templateAccueil').html();
		
		// Déclaration de référance 
		var renderAccueil = this.renderAccueil;
		
		//On lance la vidéo si l'utilisateur n'a jamais vu celle-ci
		
		if(app.users.get('1').attributes.videoWatch == false){	
			app.users.get('1').attributes.videoWatch = true;
			app.users.get('1').save();
			this.loaderVideo();
		}else{
			renderAccueil();
		}
		
		
	},
	

	loaderVideo : function() {
		$('#videoIntro').html(app.Assets.videos.intro);
		app.Assets.videos.intro.play();
		var that = this;
		app.Assets.videos.intro.addEventListener('ended',function(){
		 	$('#videoIntro').hide('clip'); 
		 	that.renderAccueil();
		})
		
	},
	
	renderAccueil: function(){
		accueilHTML = _.template($('#templateAccueil').html(),{});
		$('#Accueil').html(accueilHTML);
		console.log('Accueil chargé');
		

	},
	// evenement lors du click du lancement de l'application
	launchGame: function(){
		// change le statut de l'utilisateur en mode game
		app.users.get("1").set({gameStart:true});
		//enregistre son statut dans le localstorage
		app.users.get("1").save();
		//root vers l'intro du jeux
		app.router.navigate('startGame', true);
	}
	
}); 

/**
 * View du début du jeux
 * @author Kévin La Rosa
 * @requires  backbones.js
 */
app.Views.startGame = Backbone.View.extend({
	el : '#question',
	events: {
		'click #nextQuestion': 'nextQuestion',
	},
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		// Controle que nous n'ayons pas l'accueil de charger
	  	if($('#Accueil:visible').length){
	  		$('#Accueil:visible').hide().empty();
	  	}
	  	//Affiche la zone de rendu
	  	this.$el.show();
	  	// Lance l'animation d'introduction (Voir par la création d'un template html)
	  	AnimationParam = {
	  		html : this.$el,
	  		texte : 'ici sera le texte introductif vivement le css3 ça va etre vachement Kikou !! 6S ???',
	  		template: null,
	  		render: this.introductionStart,
	  		delay: 6000
	  	}
	  	app.Helpers.animation(AnimationParam);
	},
	
	//Injecte le rendu dans le dom ATTENTION sachant que son appel est depuis un objet différent la zone de rendu doit etre passer en argument !!!
	introductionStart : function (zoneRendu){
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateIntroStreet').html(),{});
		zoneRendu.html(template);
	},
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q1', true);
	}

}); 


/**
 * View question qui sert de classe mère aux questions enfants.
 * @author Kévin La Rosa & Tom Forlini
 * @requires  backbones.js
 */
app.Views.question = Backbone.View.extend({
	el : '#question',
	events: {
		'click #nextQuestion': 'nextQuestion',
	},
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		// Controle que nous n'ayons pas l'accueil de charger
	  	if($('#Accueil:visible').length){
	  		$('#Accueil:visible').hide().empty();
	  	}
	  	//Affiche la zone de rendu
	  	this.$el.show();
	  	// Lance l'animation d'introduction (Voir par la création d'un template html)
	  	AnimationParam = {
	  		html : this.$el,
	  		texte : 'ici sera le texte introductif vivement le css3 ça va etre vachement Kikou !! 6S ???',
	  		template: null,
	  		render: this.introductionStart,
	  		delay: 6000
	  	}
	  	app.Helpers.animation(AnimationParam);
	},
	
	//Injecte le rendu dans le dom ATTENTION sachant que son appel est depuis un objet différent la zone de rendu doit etre passer en argument !!!
	introductionStart : function (zoneRendu){
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateQ1').html(),{});
		zoneRendu.html(template);
	},
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q1', true);
	}

});



/* DÉFINITION DES VIEWS ENFANTS
Gestion des unlocks a faire
 * */ 

app.Views.q1 = app.Views.question.extend({
	
});

app.Views.q2 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q3', true);
	}
	
});

app.Views.q3 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q4', true);
	}
	
});

app.Views.q4 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q5', true);
	}
	
});

app.Views.q5 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q6', true);
	}
	
});

app.Views.q6 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q7', true);
	}
	
});

app.Views.q7 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q8', true);
	}
	
});

app.Views.q8 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 1
		app.router.navigate('q9', true);
	}
	
});

