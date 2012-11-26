/**
 * View du loader
 * @author Kévin La Rosa & Mathieu Dutto
 * @requires  backbones.js
 */
app.Views.loader = Backbone.View.extend({
	el : '#loader',
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		this.templateLoader  = $('#templateLoader').html()
		//Déclaration du noeud html de destination
		this.noeud
		
		//Déclaration des events du footer
		//Gestion de la mise en pause ou non du son ambiant
		//Optiomisation -> changement de l'image sur le bouton en fonction de l'element
		$('#optionSon').bind('click',function(){
				if(app.Assets.sounds.ambiant.paused == true){
					app.Assets.sounds.ambiant.play();
				}else{
					app.Assets.sounds.ambiant.pause();
				}
		});
		
		$('#resetGame').bind('click',function(){
				app.Helpers.reinitialize();
		});
		

		//Lancement du rendu de chargement si ce n'est pas un iphone ou ipad
		if((navigator.userAgent.match(/iPhone/i))||(navigator.userAgent.match(/iPad/i))){
			// Initialisation du router, c'est lui qui va instancier nos vues
    		app.router = new app.Router();
    		//Met en route la surveillance de l'url
    		Backbone.history.start();
		}else
		this.LoaderRender();

	},

	// Chargements des ressources Videos & sons & images
	LoaderRender : function() {
		//Définition des ressources (Définir les images)
		app.Assets.images.porsche = app.loader.addImage('assets/img/porsche.jpg');
		app.Assets.images.renault = app.loader.addImage('assets/img/renault.jpg');
		app.Assets.images.bunker = app.loader.addImage('assets/img/bunker.jpg');
		app.Assets.images.ritz = app.loader.addImage('assets/img/ritz.jpg');
		app.Assets.images.rue = app.loader.addImage('assets/img/rue.jpg');
		app.Assets.images.apocalysme = app.loader.addImage('assets/img/apocalypse.jpg');
			
		//Chargement du bon fichier video 
		if (Modernizr.video) {
		  if(Modernizr.video.webm == 'probably' || Modernizr.video.webm == 'maybe') {
		  	app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.webm', 'movie', 10);
		  }else {
		  	if (Modernizr.video.ogg == 'probably'|| Modernizr.video.ogg == 'maybe') {
		  		console.log('je me lance');
		    	app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.ogg', 'movie', 10);
		   	}else{ 
				if (Modernizr.video.h264 =='probably'|| Modernizr.video.h264 == 'maybe'){
		   			app.Assets.videos.intro = app.loader.addVideo('assets/video/intro.mp4', 'movie', 10);
		   		}
		   	}
		  }
		   	
		} else {
			//proposer du flash !!
		}
		
		
		//Chargement du bon fichier audio
		if (Modernizr.audio) {
		  if(Modernizr.audio.mp3 == 'probably' || Modernizr.audio.mp3 == 'maybe') {
		       	app.Assets.sounds.boum = app.loader.addaudio('assets/audio/mp3/boum.mp3','boum',10);
   			 	app.Assets.sounds.ambiant = app.loader.addaudio('assets/audio/mp3/ambiant.mp3','fond',10);
   			 	app.Assets.sounds.tranquille = app.loader.addaudio('assets/audio/mp3/tranquille.mp3','tranquille',10);
		  } else if (Modernizr.audio.ogg == 'probably'|| Modernizr.audio.ogg == 'maybe') {
		       	app.Assets.sounds.boum = app.loader.addaudio('assets/audio/ogg/boum.ogg','boum',10);
   			 	app.Assets.sounds.ambiant = app.loader.addaudio('assets/audio/ogg/ambiant.ogg','fond',10);
   			 	app.Assets.sounds.tranquille = app.loader.addaudio('assets/audio/ogg/tranquille.ogg','tranquille',10);
		  } else if (Modernizr.audio.wav){
		    	console.log('a encoder');
		  }
		} else{
			console.log('flash');
		}
		
	
		//Référence vers mon template de chargement
		app.loader.templateLoader = this.templateLoader;
		// On prépare notre noeud HTML a partir de son template
		loaderHTML = _.template(this.templateLoader,{avancement:""});
		// On l'affiche
		$('#loader').html(loaderHTML);
		
		//Ecoute et répond jusqu'au moment ou toutes les ressources sont chargés
		app.loader.addCompletionListener(function() {
			//Configuration du Son ambiant
			app.Assets.sounds.ambiant.loop = true;
			app.Assets.sounds.ambiant.volume = 0.1;
			app.Assets.sounds.boum.volume = 0.1;
			app.Assets.sounds.tranquille.volume = 0.1;
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

//gerer lacement son + mute
//app.Assets.sounds.ambiant.pause();
//app.Assets.sounds.ambiant.play();
//app.Assets.sounds.ambiant.volume = 0,1
/**
 * View de l'accueil
 * @author Kévin La Rosa & Mathieu Dutto
 * @requires  backbones.js
 */
app.Views.home = Backbone.View.extend({
	el : '#accueil',
	
	events: {
		'click #etape1': 'launchGame',
	},
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		if($('#question:visible').length){	  		
	  		$('#question:visible').hide().empty();
	  	}
	  	if($('#div:visible').length){	  		
	  		$('#div:visible').hide().empty();
	  	}
		//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());	
		// On cache les div courante
		$('body > div:visible').hide();
		// On affiche la div accueil
		$('#accueil').show();		
		// Déclaration des templates
		this.templateAccueil = $('#templateAccueil').html();
	
		// Déclaration de référance 
		var renderAccueil = this.renderAccueil;
		//On lance la vidéo si l'utilisateur n'a jamais vu celle-ci
		if(app.users.get('1').attributes.videoWatch == false){	
			//app.Assets.sounds.ambiant.stop();
			this.loaderVideo();
		}else{
			this.renderAccueil()
			if(app.Assets.sounds.ambiant.pause == true){
				app.Assets.sounds.ambiant.play();
			}
			
		}
		
		
	},
	

	loaderVideo : function() {
		//Crée son aparation avec animation css
		$('#videoIntro').show().html(app.Assets.videos.intro);
		console.log(app.Assets.videos.intro);
		app.Assets.videos.intro.play();
		app.Assets.videos.intro.volume = 0.3;
		var that = this;
		app.Assets.videos.intro.addEventListener('ended',function(){
			$('#videoIntro').hide('clip'); 
			app.users.get('1').attributes.videoWatch = 'true';
			app.users.get('1').save();
		 	that.renderAccueil();
		 	app.Assets.sounds.ambiant.play();
		})
		
	},
	
	renderAccueil: function(){	
		accueilHTML = _.template($('#templateAccueil').html(),{});
		// FAIT MOI UNE FUCKING ANIMTION OPACITY AVEC UN CSS MATH
		$('#accueil').html(accueilHTML);
		console.log('Accueil chargé');
		

	},
	// evenement lors du click du lancement de l'application
	launchGame: function(){
		// Renvoie l'utilisateur sur sa dernière question débloquer si il a déjà commencer a jouer
		if(app.Helpers.userIsPlaying()){
			app.router.routeQuestion(app.Helpers.getLastQuestUnlock());
		}else{
			// change le statut de l'utilisateur en mode game
			app.users.get("1").set({gameStart:true});
			//enregistre son statut dans le localstorage
			app.users.get("1").save();
			//root vers l'intro du jeux
			app.router.navigate('etape1', true);
		}
	}
	
}); 

/**
 * View du début du jeux
 * @author Kévin La Rosa & Mathieu Dutto
 * @requires  backbones.js
 * @A faire : Styliser la view, notice de l'action, revoir le blocage sur la streetView
 */
app.Views.etape1 = Backbone.View.extend({
	el : '#question',
	
	events: {
		'click .nextQuestion': 'nextQuestion',
		'click #btnHelp': 'showHelp',
		'click .shown': 'hideHelp'
	},
	// Fonction appelée automatiquement lors de l'instanciation de la vue
	initialize : function() {
		if(app.Assets.sounds.ambiant.pause == true){
			app.Assets.sounds.ambiant.play();
		}
		// Controle que nous n'ayons pas l'accueil de chargé
	  	if($('#accueil:visible').length){
	  		$('#accueil:visible').hide().empty();
	  	}
	  	if($('#end:visible').length){	  		
	  		$('#end:visible').hide().empty();
	  	}
	  	//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
	  	//Affiche la zone de rendu
	  	this.$el.show();
	  	// Lance l'animation d'introduction (Voir par la création d'un template html)
	  	AnimationParam = {
	  		variables : {
	  			introQuestion : 'Nous sommes 24 jours avant la fin du monde, les mayas avaient raison',
	  			toto: 'dkjdj'
	  		},
	  		template: $('#introAnimation').html(),
	  		render: this.renderIntro,
	  		delay: 4000,
	  		that : this
	  	}
	  	app.Helpers.animation(AnimationParam);
	},
	
	//Attention prend en paramètre that qui est le this courant appelé depuis un objet étranger

	renderIntro : function (that){
		app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
		//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
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
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('1');
					app.Helpers.unlockQuestion('6');
					app.Helpers.unlockQuestion('7');
					app.Helpers.unlockQuestion('8');
					app.router.navigate('etape2', true);
				}
			},
			
		});
	},
	
	showHelp : function(){
		//affiche aide
		app.Helpers.showHelp();
	},
	
	hideHelp : function(){
		//cache aide
		app.Helpers.hideHelp();
	},
	
	nextQuestion : function(){
		$(this.el).remove();
		app.Helpers.unlockQuestion('1');
		app.router.navigate('etape2', true);

	}
}); 


/**
 * View question qui sert de classe mère aux questions enfants.
 * @author Kévin La Rosa & Tom Forlini & Mathieu Dutto
 * @requires  backbones.js
 */
app.Views.question = Backbone.View.extend({
	
	//Zone de rendering
	el : '#question',
	
	events: {
		'click .nextQuestion': 'nextQuestion',
		'click #btnHelp': 'showHelp',
		'click .shown': 'hideHelp'
	},
	
	
	// Fonction qui est appelé automatiquement lors de l'instanciation des vues questions
	initialize : function() {
		if(app.Assets.sounds.ambiant.pause == true){
			app.Assets.sounds.ambiant.play();
		}
		this.$el.html(' ');
		// Controle que nous n'ayons pas l'accueil en non hide
	  	if($('#accueil:visible').length){
	  		$('#accueil:visible').hide().empty();
	  	}
	  	if($('#end:visible').length){	  		
	  		$('#end:visible').hide().empty();
	  	}
	  	//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
		
	  	//Affiche la zone de rendu si on vient de l'accueil
	  	this.$el.show();
	  	//Affiche la question
	  	this.render();
	},
	
	render : function(){
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#template').html(),{'titreQuestion':'à faire'});
		zoneRendu.html(template);
		return this;
	},
	
	showHelp : function(){
		//affiche aide
		app.Helpers.showHelp();
	},
	
	hideHelp : function(){
		//cache aide
		app.Helpers.hideHelp();
	},
	
	nextQuestion : function(){
		nextQuestion = (app.Helpers.getCurrentQuestion()+1);
		app.Helpers.unlockQuestion(nextQuestion);
		app.router.routeQuestion(nextQuestion);
	}

});





/**
 * QUESTION 1 : 
 * @author Kévin La Rosa & Mathieu dutto
 * @requires  backbones.js
 */
app.Views.etape2 = app.Views.question.extend({

	render : function (){
		//Recupère le html générer avec le template
		accueilHTML = _.template($('#templateStreetView').html(),{'titreQuestion':'Vous devez déguerpir en vitesse, volez une voiture dans une concession proche.'});
		this.$el.html(accueilHTML);
		//Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				center : new google.maps.LatLng(48.851287,2.276246),
				zoom : 13,
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
                position : new google.maps.LatLng(48.852630,2.286480),
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
						title : 'Concession Porsche',
						position : new google.maps.LatLng(48.851190,2.276290),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
						],
				},{
						title : 'Concession Renault',
						position : new google.maps.LatLng(48.852630,2.286480),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
								]
				}
			
			],
			markersMap : [
					{
						title : 'Concession Porsche',
						position : new google.maps.LatLng(48.851287,2.276246),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.moveStreet
								
							}
						],
					},{
						title : 'Concession Renault',
						position : new google.maps.LatLng(48.852701,2.286263),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.moveStreet
								
									}
								]
						}
			],
		
		streetGuide : {

		}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
	
	nextQuestion : function(){
		app.Helpers.unlockQuestion('2');
		app.router.navigate('etape3', true);
	},
	
	//Evenement qui place la streetView sur le marker map ciblé
	moveStreet: function(marker){
		console.log(marker.latLng);
		app.street.exploration.setPosition(new google.maps.LatLng(marker.latLng.$a,marker.latLng.ab));
	},
	
	//Evenement de confirmation après avoir cliquer sur un marker d'une view
	confirmQuestion: function(marker){
		//console.log(Messi);
		var pos = marker.latLng.$a;
		var lat = marker.latLng.ab;
		var options = {
			closeButton: true,
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
			
		}
		if(pos == 48.85119 && lat == 2.2762900000000172){
			options.title = 'Vous souhaitez voler une Porsche ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape3', true);
				}
			}
			new Messi(app.Assets.images.porsche,options);
		}else{
			options.title = 'Vous souhaitez voler un kangoo ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape3', true);
				}
			}
			app.Assets.images.renault.style.width = '520px';
			new Messi(app.Assets.images.renault,options);
		}
	}
	
	
	
});


app.Views.etape3 = app.Views.question.extend({
	
	render : function (){
		//Définition des variables à passer
		image1 = {'url':'mac-gyver.jpg','alt':'livre Que ferait Mac Gyver ?','titre':'Livre : Que ferait Mac Gyver ?','description':'Le livre pour savoir ce que ferait Mac Gyver dans toutes les situations les plus périeuses. Les astuces du maître de la survie !'};
		image2 = {'url':'ipad3.png','alt':'iPad 3','titre':'Tablette tactile : iPad 3','description':'Le dernier iPad : le plus puissant et la tablette la plus pratique au monde. Un maximum d\outils en un seul objet !'};
		image3 = {'url':'photo-famille.jpg','alt':'photo de famille','titre':'Photo : une photo de famille','description':'Une photo de famille.. quoi de plus réconfortant dans les moments difficiles ? Légère et peu encombrante !'};
		//Recupère le html générer avec le template
		template = accueilHTML = _.template($('#templateWebGl').html(),{'titreQuestion':'La place manque dans cette voiture, quel objet choisissez-vous pour survivre ?','image1':image1,'image2':image2,'image3':image3});
		this.$el.html(template);
	},
	

	
});

app.Views.etape4 = app.Views.question.extend({
	

	
});

app.Views.etape5 = app.Views.question.extend({
	

});

app.Views.etape6 = app.Views.question.extend({
	
	render: function(){
		//Recupère le html générer avec le template
		accueilHTML = _.template($('#templateStreetView').html(),{'titreQuestion':'Vous semblez fatigué. Trouvez donc un endroit pour passer la nuit. Vous pouvez choisir entre un Bunker, un Hôtel 5* ou l’arche la plus proche de votre position.'});
		this.$el.html(accueilHTML);
		//Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				center : new google.maps.LatLng(48.867903,2.329117),
				zoom : 11,
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
                position : new google.maps.LatLng(48.867903,2.329117),
                pov : {
                	heading: 650, //Angle de rotation horizontal, en degrés, de la caméra
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
						title : 'Ritz hotel 5 étoiles',
						position : new google.maps.LatLng(48.86796,2.328900),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
						],
				},{
						title : 'Bunker',
						position : new google.maps.LatLng(48.868050,2.27053),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.confirmQuestion
								
									}
								]
				}
			
			],
			markersMap : [
					{
						title : 'Ritz hotel 5 étoiles',
						position : new google.maps.LatLng(48.867903,2.329117),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.moveStreet
								
							}
						],
					},{
						title : 'Bunker',
						position : new google.maps.LatLng(48.867961,2.271100),
						events: [
									{
										eventMarker : 'click',
										functionMarker : this.moveStreet
								
									}
								]
						}
			],
		
		streetGuide : {

		}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
		//Evenement qui place la streetView sur le marker map ciblé
	moveStreet: function(marker){
		console.log(marker.latLng);
		app.street.exploration.setPosition(new google.maps.LatLng(marker.latLng.$a,marker.latLng.ab));
	},
	
		//Evenement de confirmation après avoir cliquer sur un marker d'une view
	confirmQuestion: function(marker){
		var pos = marker.latLng.$a;
		var lat = marker.latLng.ab;
		var options = {
			closeButton: true,
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
			
		}
		console.log(marker);
		if(pos == 48.86796 && lat == 2.328899999999976){
			options.title = 'Vous souhaitez dormir dans un hôtel 5 étoiles ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
					app.router.navigate('etape7', true);
				}
			}
			new Messi(app.Assets.images.ritz,options);
		}else{
			options.title = 'Vous souhaitez dormir dans un bunker ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('6');
					app.router.navigate('etape7', true);
				}
			}
			app.Assets.images.bunker.style.width ='600px';
			new Messi(app.Assets.images.bunker,options);
		}
	}

	
});

app.Views.etape7 = app.Views.question.extend({
	

	
});

 app.Views.etape8 = app.Views.question.extend({

	render : function (){
		//Fil ariane
		app.Helpers.filAriane(app.Helpers.getLastQuestUnlock(),app.Helpers.getCurrentQuestion());
		//Recupère le html générer avec le template
		template = _.template($('#templateStreetView').html(),{"titreQuestion":"Entendez-vous ? Je crois que l’heure à sonner... Choisissez la direction dans laquelle vous souhaitez partir."});
		this.$el.html(template);		
		// Définition des paramètre de la street + map (voir helper)
		var optionModeStreetMap = {
			idMap : 'carte',
			idStreet : 'exploration',
			mapOptions : {
				
			},
			streetOptions : {
				
				adresseControl : false,
				adresseControlOptions: {
                     style: {backgroundColor: 'grey', color: 'yellow'} // modification css
                },
                position : new google.maps.LatLng(48.851885,2.421000),
                pov : {
                	heading: 450, //Angle de rotation horizontal, en degrés, de la caméra
                    pitch: 10, //Angle vertical, vers le haut ou le bas, par rapport à l'angle de vertical (CAMERA)
                    zoom: 0
                },
				streetViewControl: false,
				navigationControl: false,
    			mapTypeControl: false,
    			scaleControl: false,
    			draggable: false,
    			zoomControl: false,
  				scrollwheel: false,
  				//controler de direction
                panControl: false,
                // controler de direction par clavier
                keyboardShortcuts: false,
  				disableDoubleClickZoom: true,
  				//bloque le click and go
                clickToGo:false,
                //bloque le clique du sol
                linksControl:false
			},
			markersStreet : [
					{
						title : 'Partir à gauche',
						position : new google.maps.LatLng(48.851960,2.421070),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.popupInfo
								
							}
						],
					},
					{
						title : 'Partir à droite',
						position : new google.maps.LatLng(48.85185,2.421125),
						events: [
							{
								eventMarker : 'click',
								functionMarker : this.popupInfo
								
							}
						],
					}
			],
			markersMap : [
			],
		
			streetGuide : {

			}
	}
		app.Helpers.RenderStreetMapMode(optionModeStreetMap);
	},
	
	nextQuestion : function(){
		$(this.el).remove();
		app.Helpers.unlockQuestion('1');
		app.router.navigate('etape2', true);

	},
	
	popupInfo : function(marker){
		var pos = marker.latLng.$a;
		var lat = marker.latLng.ab;
		var options = {
			closeButton: true,
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
			
		}
		if(pos == 48.85196 && lat == 2.421069999999986){
			//app.Assets.sounds.boum.play();
			app.Assets.sounds.boum.play();
		 	options.title = 'Vous comptez aller à droite ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),50);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape9', true);
				}
			}
			app.Assets.images.apocalysme.style.width ='600px';
			new Messi(app.Assets.images.apocalysme,options);
			
		}else{
			app.Assets.sounds.tranquille.play();
			options.title = 'Vous comptez aller à gauche ?'
			options.callback = function(val){
				if(val == 'O'){
					app.Helpers.setPointEtape(app.Helpers.getCurrentQuestion(),0);
					app.Helpers.unlockQuestion('2');
					app.router.navigate('etape9', true);
				}
			}
			app.Assets.images.rue.style.width ='600px';
			new Messi(app.Assets.images.rue,options);
		 	
		 }
	}

	
});

app.Views.etape9 = Backbone.View.extend({

	//Zone de rendering
	el : '#end',
	
	events: {

	},
	
	
	// Fonction qui est appelé automatiquement lors de l'instanciation
	initialize : function() {
		// Controle que nous n'ayons pas l'accueil de chargé
		console.log()
	  	if($('#accueil:visible').length){
	  		$('#accueil:visible').hide().empty();
	  	}
	  	
	  	console.log($('#question:visible'));
	  	if($('#question:visible').length){	  		
	  		$('#question:visible').hide().empty();
	  	}
	  	this.$el.show();
		this.render();
	},
	
	render : function(){
		this.$el.html(_.template($('#endTemplate').html(),{}));
		//score
		
		console.log(app.Helpers.getCuid());
		score = app.Helpers.getScore();
		alert(score);
		if(score <= 50){
			alert('tu vas crever :X');
			//push sur le serveur le score
			app.Helpers.SetResultSurvive(false);
		}else{
			alert('tu vas survivre champion !!');
			app.Helpers.SetResultSurvive(true);
		}
	}

	
});







/**
 * Page du site mobile avec gestion du gyroscope
 * @author Kévin La Rosa 
 * @requires  backbones.js
 */


app.Views.mobileExperience = Backbone.View.extend({
	
	//zone de rendering kIkou math ? a quand une intégration de accueilMobile  en Mquery. . . 
	el : '#question',
	// Fonction appelé automatiquement lors de l'instanciation de la vue
	initialize : function() {
		$('#filAriane').addClass('hidden'); // cacher le fil d'ariane
		this.render();
		
	},
	
	render : function(){		
		template = _.template($('#templateMobile').html(),{test:'kjjk'});
		this.$el.show().html(template);
		//Controle si le navigateur peut utiliser le gyroscope
		if (typeof window.DeviceMotionEvent != 'undefined') {
			
	    // Définit la sensibilité du shake
	    var sensitivity = 20;
	
	    // variable de position
	    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
	
	    // ecoute pour bouger les evenement et update la position 
	    window.addEventListener('devicemotion', function (e) {
	        x1 = e.accelerationIncludingGravity.x;
	        y1 = e.accelerationIncludingGravity.y;
	        z1 = e.accelerationIncludingGravity.z;
	    }, false);
	
	    setInterval(function () {
	        var change = Math.abs(x1-x2+y1-y2+z1-z2);
	        if (change > sensitivity) {        	
				template = _.template($('#templateMobile').html(),{test:app.Helpers.getOneInfo()});
				$('#question').html(template);
	        }
	
	        // Update new position
	        x2 = x1;
	        y2 = y1;
	        z2 = z1;
	    }, 150);
	}
	}	
});

