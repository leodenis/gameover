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
		//app.Assets.images.background = app.loader.addImage('assets/img/headerbg.jpg'), app.Assets.images.treesImg = app.loader.addImage('assets/img/trees.png'), app.Assets.images.ufoImg = app.loader.addImage('assets/img/ufo.png');
		
		//Chargement du bon fichier video ATTTENTION IL FAUT FINIR EN AJOUTER LES AUTRES FORMAT PAR NAVIGATEURS
		if (Modernizr.video) {
		  if(Modernizr.video.webm) {
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.webm', 'movie', 10);
		  } else if (Modernizr.video.ogg) {
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.ogg', 'movie', 10);
		  } else if (Modernizr.video.h264){
		    app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.mp4', 'movie', 10);
		  }
		} else {
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
		'click #etape1': 'launchGame',
	},
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		// On cache les div courante
		$('body > div:visible').hide();
		// On affiche la div accueil
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
		app.router.navigate('etape1', true);
	}
	
}); 

/**
 * View du début du jeux
 * @author Kévin La Rosa
 * @requires  backbones.js
 * @A faire : Styliser la view, notice de l'action, revoir le blocage sur la streetView
 */
app.Views.etape1 = Backbone.View.extend({
	el : '#question',
	events: {
		'click #nextQuestion': 'nextQuestion',
	},
	// Fonction appelée automatiquement lors de l'instanciation de la vue
	initialize : function() {
		// Controle que nous n'ayons pas l'accueil de chargé
	  	if($('#Accueil:visible').length){
	  		$('#Accueil:visible').hide().empty();
	  	}
	  	//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
	  	//Affiche la zone de rendu
	  	this.$el.show();
	  	// Lance l'animation d'introduction (Voir par la création d'un template html)
	  	AnimationParam = {
	  		texte : 'Nous sommes 24 jours avant la fin du monde, les mayas avaient raison !<br />Tout le monde est affolé !<br />Tu décides de partir te réfugier dans un endroit ou tu seras en sécurité<br />Quel sera ton choix ?',
	  		template: null,
	  		render: this.renderIntro,
	  		delay: 1000,
	  		that : this
	  	}
	  	app.Helpers.animation(AnimationParam);
	},
	
	//Attention prend en paramètre that qui est le this courant appelé depuis un objet étranger

	renderIntro : function (that){
		//Recupère le html générer avec le template
		template = _.template($('#templateStreetView').html(),{"titreQuestion":"Recherchez le médium le plus proche afin qu’il vous prédise le futur... "});
		that.$el.html(template);
		
		// Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				center : new google.maps.LatLng(48.867116,2.399231),
				zoom : 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP, // type de map
				styles: [   { "featureType": "landscape", "stylers": [ { "color": "#808080" } ] }, // les terres en gris
                            { "featureType": "poi", "stylers": [ { "visibility": "off" } ] }, // Cache les points d'interet ( Hopital,Ecole ect...)
                            { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] }, // Nom : ville, arondissement : non visible
                            { "featureType": "road", "stylers": [ { "color": "#c0c0c0" } ] }, // Route en gris clair
                            { "featureType": "road", "elementType": "labels", "stylers": [ {  "visibility": "off" } ] }, // label des routes non visible
                            { "featureType": "transit", "stylers": [ { "visibility": "off" } ] } // Transport non affiche
                        ],
				streetViewControl: true,
				navigationControl: false,
    			mapTypeControl: false,
    			scaleControl: false,
    			draggable: false,
    			zoomControl: false,
  				scrollwheel: false,
  				disableDoubleClickZoom: true,
			},
			streetOptions : {
				
				adresseControl : true,
				adresseControlOptions: {
                     style: {backgroundColor: 'grey', color: 'yellow'} // modification css
                },
                position : new google.maps.LatLng(48.866818,2.399524),
                pov : {
                	heading: 550, //Angle de rotation horizontal, en degrés, de la caméra
                    pitch: 10, //Angle vertical, vers le haut ou le bas, par rapport à l'angle de vertical (CAMERA)
                    zoom: 0
                },
                    //controler de direction
                    panControl: true,
                    // controler de direction par clavier
                    keyboardShortcuts: true,
                    //bloque le changement d'adresse
                    addressControl:false,
                    scrollwheel:false,
                    //bloque le click and go
                    clickToGo:true,
                    //bloque le clique du sol
                    linksControl:true
			},
			markersStreet : [
					{
						title : 'voyance',
						position : new google.maps.LatLng(48.867058,2.399065),
						title: 'Voyance',
						events: [
							{
								eventMarker : 'click',
								functionMarker : that.popupInfo
								
							}
						],
					},
			],
			markersMap : [
			],
		
			streetGuide : {
				depart : new google.maps.LatLng(48.866818,2.399524),
				arriver : new google.maps.LatLng(48.867404,2.398934),
		}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
	
	//Evenement qui réagit au click sur le marker en face de la voyante
	popupInfo : function(){

		new Messi('Nos « ancêtres », les Mayas, qui en savaient plus que nous sur la puissance des astres nous ont dévoilés leurs secrets.', {
			title: 'Commencer l\'aventure',
			buttons: [{
					id: 0, 
					label: 'Oui', 
					val: 'O'
			},
			{
					id: 1, 
					label: 'Non', 
					val: 'N'
			}],
			callback: function(val) { 
				if(val == 'O'){
					app.Helpers.unlockQuestion('1');
					app.router.navigate('etape2', true);
				}
			},
			
		});
	},
	
	nextQuestion : function(){
		$(this.el).remove();
		app.Helpers.unlockQuestion('1');
		app.router.navigate('etape2', true);

	}
}); 


/**
 * View question qui sert de classe mère aux questions enfants.
 * @author Kévin La Rosa & Tom Forlini
 * @requires  backbones.js
 */
app.Views.question = Backbone.View.extend({
	
	//Zone de rendering
	el : '#question',
	
	events: {
		'click #nextQuestion': 'nextQuestion',
	},
	
	
	// Fonction qui est appelé automatiquement lors de l'instanciation des vues questions
	initialize : function() {
		this.$el.html(' ');
		console.log(this.el);
		// Controle que nous n'ayons pas l'accueil en non hide
	  	if($('#Accueil:visible').length){
	  		$('#Accueil:visible').hide().empty();
	  	}
	  	
	  	//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
		
	  	//Affiche la zone de rendu si on vient de l'accueil
	  	this.$el.show();
	  	//Affiche la question
	  	this.render();
	},
	
	
	render : function (){
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#template').html(),{'titreQuestion':'à faire'});
		zoneRendu.html(template);
		return this;
	}

});





/**
 * QUESTION 1 : 
 * @author Kévin La Rosa 
 * @requires  backbones.js
 */
app.Views.etape2 = app.Views.question.extend({

	render : function (){
		//Recupère le html générer avec le template
		accueilHTML = _.template($('#templateStreetView').html(),{'titreQuestion':'question 1'});
		this.$el.html(accueilHTML);
		//Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				center : new google.maps.LatLng(48.851287,2.276246),
				zoom : 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP, // type de map
				styles: [   { "featureType": "landscape", "stylers": [ { "color": "#808080" } ] }, // les terres en gris
                            { "featureType": "poi", "stylers": [ { "visibility": "off" } ] }, // Cache les points d'interet ( Hopital,Ecole ect...)
                            { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] }, // Nom : ville, arondissement : non visible
                            { "featureType": "road", "stylers": [ { "color": "#c0c0c0" } ] }, // Route en gris clair
                            { "featureType": "road", "elementType": "labels", "stylers": [ {  "visibility": "off" } ] }, // label des routes non visible
                            { "featureType": "transit", "stylers": [ { "visibility": "off" } ] } // Transport non affiche
                        ],
				streetViewControl: true,
				navigationControl: false,
    			mapTypeControl: false,
    			scaleControl: false,
    			draggable: false,
    			zoomControl: false,
  				scrollwheel: false,
  				disableDoubleClickZoom: true,
			},
			streetOptions : {
				
				adresseControl : true,
				adresseControlOptions: {
                     style: {backgroundColor: 'grey', color: 'yellow'} // modification css
                },
                position : new google.maps.LatLng(48.851287,2.276246),
                pov : {
                	heading: 550, //Angle de rotation horizontal, en degrés, de la caméra
                    pitch: 10, //Angle vertical, vers le haut ou le bas, par rapport à l'angle de vertical (CAMERA)
                    zoom: 0
                },
                    //controler de direction
                    panControl: true,
                    // controler de direction par clavier
                    keyboardShortcuts: true,
                    //bloque le changement d'adresse
                    addressControl:false,
                    scrollwheel:false,
                    //bloque le click and go
                    clickToGo:true,
                    //bloque le clique du sol
                    linksControl:true
			},
			markersStreet : [
				{
						title : 'voyance',
						position : new google.maps.LatLng(48.851187,2.276370),
						title: 'Voyance',
						events: [
							{
								eventMarker : 'click',
								functionMarker : this
								
							}
						],
				},
			
			],
			markersMap : [
			
			],
		
		streetGuide : {

		}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
		//return this;
	},
	
	nextQuestion : function(){
		app.Helpers.unlockQuestion('2');
		app.router.navigate('etape3', true);
	}
	
	
});


app.Views.etape3 = app.Views.question.extend({
	
	render : function (){
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateWebGl').html(),{'titreQuestion':'question 1'});
		console.log(template);
		this.$el.html(template);
	},
	
	nextQuestion : function(){

		//root vers la question 3
		app.Helpers.unlockQuestion('3');
		app.router.navigate('q3', true);
	}
	
});

app.Views.q3 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 4
		app.router.navigate('etape5', true);
	}
	
});

app.Views.etape5 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 5
		app.router.navigate('etape6', true);
	}
	
});

app.Views.etape6 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 6
		app.router.navigate('etape7', true);
	}
	
});

app.Views.etape7 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 7
		app.router.navigate('etape8', true);
	}
	
});

app.Views.etape8 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 8
		app.router.navigate('etape9', true);
	}
	
});

app.Views.etape9 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la question 9
		app.router.navigate('etape10', true);
	}
	
});

app.Views.etape10 = app.Views.question.extend({
	
	nextQuestion : function(){
		//root vers la page de fin
		app.router.navigate('etape11', true);
	}
	
});

