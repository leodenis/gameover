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
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.mp4', 'movie', 10);
		  } else if (Modernizr.video.ogg) {
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.mp4', 'movie', 10);
		  } else if (Modernizr.video.h264){
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.mp4', 'movie', 10);
		  }
		}else{
			//proposer du flash !!
		}
		
		//Référence vers mon template de chargement
		app.loader.templateLoader = this.templateLoader;
		// On prépare notre noeud HTML a partir de son template
		loaderHTML = underscore.template(this.templateLoader,{avancement:""});
		// On l'affiche
		$('#loader').html(loaderHTML);
		
		//Ecoute et répond jusqu'au moment ou toutes les ressources sont chargés
		app.loader.addCompletionListener(function() {
			//supprime le loader
			$('#loader').remove();
		});
		
		//Ecoute et répond a chaque avancement du chargement
		app.loader.addProgressListener(function(e) {
			templateLoader  = $('#templateLoader').html()
			progression = e.completedCount+'/'+e.totalCount;
			loaderHTML = underscore.template(app.loader.templateLoader,{avancement:progression});
			console.log('Chargement des assets en cours  : '+ progression);
			
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
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		// Déclaration des templates
		this.templateAccueil = $('#templateAccueil').html();
		
		// Déclaration de référance (Demander a pumir si il existe mieux ~~)
		var renderAccueil = this.renderAccueil;
		
		//On lance la vidéo si l'utilisateur n'a jamais vu celle-ci (localstorage a faire)
		if(true){
			this.loaderVideo(renderAccueil);
			//this.renderAccueil();
			
		}
		
		
	},

	loaderVideo : function(renderAccueil) {
		//$('#videoIntro').html(app.Assets.videos.intro);
		//app.Assets.videos.intro.play();
		renderAccueil();
		app.Assets.videos.intro.addEventListener('ended',function(){
		 	//jQuery('#videoIntro > video ').hide('clip'); 
		 	//$('#videoIntro').remove();
		 	renderAccueil();
		})
		
	},
	
	renderAccueil: function(){
		a = underscore.template(this.templateAccueil,{});
		console.log(this.templateAccueil);
		$('#Accueil').html('accueilHTML');
		console.log(accueilHTML);
		

	}
	
}); 